import { useEffect, useMemo, useState } from 'react';

/*
  SeatSelectionDialog.tsx
  - React + TypeScript component built for use with shadcn/ui + Tailwind CSS.
  - Goal: render a responsive modal dialog that visualises an aircraft seat map from either
    a GDS or NDC response and supports pagination, seat selection and a passenger panel.
  - Keep styling professional and minimal. The layout is responsive and attempts to show
    approximate seat positions so users can imagine the seat in the plane.

  Usage:
    <SeatSelectionDialog
      open={open}
      onOpenChange={setOpen}
      seatmapResponse={gdsOrNdcResponse}
      passengers={[{ id: 'p1', name: 'PANKAJ YADAV' }]}
      currency="INR"
    />

  Notes:
   - This is a single-file component that returns a presentational dialog. It does not
     make network requests. It expects the seatmap payloads in the format you provided
     (CatalogOfferingsAncillaryListResponse-like). The parser is defensive and works for
     both ContentSource: "GDS" and ContentSource: "NDC".
*/

// shadcn/ui components (example)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import type { Passenger } from '../travelers-details-dialog';
import { MoveRight } from 'lucide-react';

// ---- Types ----

type SeatStatus =
  | 'available'
  | 'reserved'
  | 'blocked'
  | 'noseat'
  | 'unknown'
  | 'selected';

type Seat = {
  id: string; // e.g. "17A"
  row: number;
  column: string; // letter
  status: SeatStatus;
  characteristics: string[]; // raw tokens (e.g. ['A','W','BK','CH'])
  price?: number | null; // optional
  brand?: string | null;
};

type SeatingChart = {
  id: string;
  cabin?: string;
  rows: Array<{ label: number; seats: Array<Seat | null> }>;
};

// type Passenger = { id: string; name: string; seatId?: string | null };

type SeatmapResponse = any; // keep open — parser will be defensive

// ---- Small helpers ----

const STATUS_PRIORITY: Record<string, SeatStatus> = {
  Available: 'available',
  Reserved: 'reserved',
  Blocked: 'blocked',
  NoSeat: 'noseat',
  'No Seat': 'noseat',
  // other variations
};

function normalizeStatus(raw: string | undefined): SeatStatus {
  if (!raw) return 'unknown';
  if (STATUS_PRIORITY[raw]) return STATUS_PRIORITY[raw];
  const r = raw.toLowerCase();
  if (r.includes('avail')) return 'available';
  if (r.includes('reserv')) return 'reserved';
  if (r.includes('block')) return 'blocked';
  if (r.includes('no')) return 'noseat';
  return 'unknown';
}

// try best-effort mapping for common characteristic tokens to UI badges (speculative)
const CHAR_MAP: Record<string, string> = {
  A: 'Aisle',
  W: 'Window',
  BK: 'Blocked',
  CH: 'Chargeable',
  GN: 'Galley',
  EL: 'Extra legroom',
  ER: 'Exit row',
  LA: 'Lavatory',
};

function charBadges(chars: string[]) {
  return chars.map((c) => CHAR_MAP[c] || c).slice(0, 2);
}

// ---- Parser: convert GDS/NDC response into SeatingChart[] + seat map ----
function parseSeatmapResponse(payload: SeatmapResponse): SeatingChart[] {
  try {
    // defensive: locate ReferenceList.SeatingChart OR search for SeatingChart objects
    const charts: any[] = [];

    if (!payload) return [];

    // common locations seen in your files
    const root = payload?.CatalogOfferingsAncillaryListResponse || payload;

    // 1) look for ReferenceList -> ReferenceListSeatingChart
    const refs =
      root?.ReferenceList?.ReferenceListSeatingChart ||
      root?.ReferenceList ||
      [];
    if (Array.isArray(refs)) {
      refs.forEach((r: any) => {
        if (r?.SeatingChart) {
          if (Array.isArray(r.SeatingChart)) charts.push(...r.SeatingChart);
          else charts.push(r.SeatingChart);
        }
      });
    }

    // fallback: search entire payload for objects with type 'SeatingChart' key
    const walk = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj?.SeatingChart && !charts.includes(obj.SeatingChart)) {
        charts.push(obj.SeatingChart);
      }
      for (const k of Object.keys(obj)) {
        try {
          walk(obj[k]);
        } catch (e) {}
      }
    };
    walk(root);

    // Convert each seatingChart into our SeatingChart shape
    const out: SeatingChart[] = charts.map((sc: any) => {
      const id = sc?.id || sc?.SeatingChartId || 'seatingChart_unknown';
      const cabin =
        sc?.Cabin?.name || sc?.Cabin?.[0]?.name || sc?.cabin || 'Economy';

      // // rows often in sc?.Layout?.Row or sc?.Row array
      // const rowsArr =
      //   sc?.Row || sc?.Rows || sc?.Layout?.Row || sc?.Layout?.rows || [];

      // find possible row arrays across layouts, cabins, etc.
      const rowsArr =
        sc?.Row ||
        sc?.Rows ||
        sc?.Layout?.Row ||
        sc?.Layout?.rows ||
        (Array.isArray(sc?.Cabin)
          ? sc.Cabin.flatMap((c: any) => c?.Row || c?.Layout?.Row || [])
          : []);

      const rows = (Array.isArray(rowsArr) ? rowsArr : []).map((r: any) => {
        const label =
          Number(r?.label ?? r?.rowNumber ?? NaN) || Number(r?.label ?? 0);
        const spaces = r?.Space || r?.Spaces || [];

        // create seats array preserving column order for layout rendering
        const seats: Array<Seat | null> = spaces.map((s: any) => {
          if (!s) return null;
          const location = s?.location || s?.column || '';
          const seatId = `${label}${location}`;
          const chars = (
            Array.isArray(s?.Characteristic)
              ? s.Characteristic
              : s?.characteristic
                ? [s.characteristic]
                : []
          ).map(String);
          // seat status may not live on row space — we will combine with ProductSeatAvailability later
          return {
            id: seatId,
            row: label,
            column: location,
            status: chars.includes('BK') ? 'blocked' : 'unknown',
            characteristics: chars,
            price: null,
            brand: null,
          } as Seat;
        });

        return { label, seats };
      });

      return { id, cabin, rows } as SeatingChart;
    });

    // Now overlay seat statuses from ProductSeatAvailability entries found under CatalogOffering -> Product
    // find all SeatAvailability entries
    const availEntries: Array<{
      status: string;
      seats: string[];
      price?: number;
      brand?: string;
    }> = [];

    const offerings =
      root?.CatalogOfferingsID ||
      root?.CatalogOfferings ||
      root?.OfferListResponse ||
      [];

    const gatherOfferings = (arr: any[]) => {
      arr.forEach((o) => {
        const opts =
          o?.CatalogOffering ||
          o?.CatalogOfferingList ||
          o?.CatalogOfferings ||
          o?.Offer ||
          [];
        const flat = Array.isArray(opts) ? opts : [opts];
        flat.forEach((co: any) => {
          // const products = co?.ProductOptions?.Product || co?.Product || [];
          const productOptions =
            co?.Productions ||
            co?.ProductOptions ||
            co?.ProductOptions?.Product ||
            co?.Product ||
            [];

          const productOptionsArray = Array.isArray(productOptions)
            ? productOptions
            : [productOptions];

          productOptionsArray?.map((product: any) => {
            const prods = Array.isArray(product?.Product)
              ? product?.Product
              : [product?.Product];

            prods.forEach((p: any) => {
              const brand = p?.Brand?.name || p?.brand || null;
              const psa =
                p?.ProductSeatAvailability ||
                p?.SeatAvailability ||
                p?.ProductSeat ||
                [];

              const seatAvails = Array.isArray(psa) ? psa : [psa];

              seatAvails.forEach((sa: any) => {
                const sas = sa;
                // sa?.SeatAvailability ||
                // sa?.seatAvailability ||
                // (sa?.SeatAvailabilityList ? sa.SeatAvailabilityList : []);
                const sasArr = Array.isArray(sas) ? sas : [sas];
                sasArr.forEach((sai: any) => {
                  const st =
                    sai?.seatAvailabilityStatus ||
                    sai?.SeatAvailabilityStatus ||
                    sai?.status ||
                    sai?.Status;
                  // const vals = sai?.value || sai?.seats || sai?.seatList || [];
                  const vals =
                    sai?.value ||
                    sai?.seats ||
                    sai?.seatList ||
                    sai?.SeatReference ||
                    [];

                  const seats = Array.isArray(vals)
                    ? vals
                    : typeof vals === 'string'
                      ? [vals]
                      : [];

                  // try parse price if present
                  let price: number = 0;
                  if (co?.Price?.TotalPrice >= 0 || p?.Price?.TotalPrice >= 0)
                    price =
                      Number(co?.Price?.TotalPrice || p?.Price?.TotalPrice) ||
                      0;
                  if (co?.Price?.Base >= 0 || p?.Price?.Base >= 0)
                    price = Number(co?.Price?.Base || p?.Price?.Base) || price;

                  availEntries.push({ status: st, seats, price, brand });
                });
              });
            });
          });
        });
      });
    };

    // offerings can be an object or array
    if (Array.isArray(offerings)) gatherOfferings(offerings);
    else gatherOfferings([offerings]);

    // helper to find seat in out charts
    const findSeat = (seatId: string) => {
      for (const chart of out) {
        for (const r of chart.rows) {
          for (let i = 0; i < r.seats.length; i++) {
            const s = r.seats[i];
            if (s && s.id === seatId) return s;
          }
        }
      }
      return null;
    };

    console.log(out);
    console.log(availEntries);

    // overlay statuses
    availEntries.forEach((ae) => {
      const normalized = normalizeStatus(ae.status);
      ae.seats.forEach((sid) => {
        const s = findSeat(sid);
        if (s) {
          s.status = normalized === 'unknown' ? s.status : normalized;
          if (ae.price) s.price = ae?.price;
          if (ae.brand) s.brand = ae?.brand;
        }
      });
    });

    return out;
  } catch (e) {
    console.error('parseSeatmapResponse error', e);
    return [];
  }
}

// ---- Visual components ----

function SeatIcon({
  seat,
  onClick,
  selected,
  currency,
}: {
  seat: Seat | null;
  onClick: (s: Seat) => void;
  selected?: boolean;
  currency?: string;
}) {
  if (!seat) return <div className="w-12 h-10" />; // empty space placeholder

  const base =
    'w-12 h-10 rounded-md border flex items-center justify-center text-xs select-none';

  let cls =
    base +
    ' bg-white border-gray-200 text-gray-800 hover:bg-blue-400 hover:text-white';
  if (seat.status?.toLowerCase() === 'available')
    cls = base + ' bg-white border-sky-300 text-sky-700 cursor-pointer';
  if (seat.status?.toLowerCase() === 'reserved')
    cls =
      base + ' bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed';
  if (seat.status?.toLowerCase() === 'blocked')
    cls =
      base +
      ' bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-70';
  if (seat.status?.toLowerCase() === 'noseat')
    cls = base + ' bg-transparent border-transparent';
  if (selected) cls = base + ' bg-sky-600 text-white border-sky-700';

  return (
    <div
      title={`${seat.id} ${seat.brand ? `• ${seat.brand}` : ''} ${seat.price ? `• ${seat.price}` : ''} ${seat.characteristics && `• ${charBadges(seat.characteristics).join(', ')}`}`}
      // onClick={() => seat.status === 'available' && onClick(seat)}
      onClick={() =>
        (seat.status === 'available' || seat.status === 'unknown') &&
        onClick(seat)
      }
      className={cls}
      role="button"
      aria-disabled={seat.status !== 'available'}
      aria-label={`Seat ${seat.id} ${seat.status}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-[11px] font-medium">{seat.id}</div>
        <div className="text-[10px] opacity-70">
          {seat.price
            ? `${currency ? currency : '₹'} ${seat.price}`
            : // seat.brand
              //   ? seat.brand
              //   :
              ''}
        </div>
        {/* <div className="text-[9px] opacity-60">
          {charBadges(seat.characteristics).join(', ')}
        </div> */}
      </div>
    </div>
  );
}

// ---- Main exported component ----
export const SeatSelectionDialog: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  seatmapResponse: SeatmapResponse;
  passengers: Passenger[]; // now uses your exact Passenger type
  currency?: string;
  pageSize?: number; // rows per "page"
  onConfirm?: (updatedPassengers: Passenger[]) => void;
  setExtraPrice?: any;
}> = ({
  open,
  onOpenChange,
  seatmapResponse,
  passengers,
  currency = 'INR',
  pageSize = 12,
  onConfirm,
  setExtraPrice,
}) => {
  const charts = useMemo(
    () => parseSeatmapResponse(seatmapResponse),
    [seatmapResponse]
  );

  useEffect(() => {
    const passengerSeats: any[] = [];
    passengers?.map((passenger: any) => {
      if (passenger?.seatId) {
        const seat = findSeat(passenger.seatId);
        passengerSeats.push({
          id: passenger.seatId,
          pid: passenger.id,
          price: seat?.price || 0,
        });
        initialSeats[
          passenger?.id || `${passenger?.first_name}_${passenger?.last_name}`
        ] = seat?.id || '';
      }
    });

    setSelectedSeats(initialSeats);

    // passengers.forEach((p: any) => {
    //   initialSeats[p?.id || `${p?.first_name}_${p?.last_name}`] =
    //     p?.seatId || '';
    // });

    setSeatPrice(passengerSeats);
  }, [open, onOpenChange]);
  // const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const selectedChartIndex = 0;
  const chart = charts[selectedChartIndex || 0] || null;

  const [seatPrice, setSeatPrice] = useState<any>([]);
  const Flight =
    seatmapResponse?.CatalogOfferingsAncillaryListResponse
      ?.CatalogOfferingsID?.[0]?.Flight?.[0];

  // console.log(chart);

  // pagination over rows
  const [page, setPage] = useState(0);

  const totalPages = chart ? Math.ceil(chart.rows.length / pageSize) : 0;
  const visibleRows = chart
    ? chart.rows.slice(page * pageSize, (page + 1) * pageSize)
    : [];

  // selection state: map passengerId -> seatId (string) or ''
  const initialSeats: Record<string, string> = {};
  // passengers.forEach((p: any) => {
  //   initialSeats[p?.id || `${p?.first_name}_${p?.last_name}`] = p?.seatId || '';
  // });

  const [selectedSeats, setSelectedSeats] =
    useState<Record<string, string>>(initialSeats);

  // helper: determine if passenger needs a seat
  const passengerNeedsSeat = (p: Passenger) => {
    const t = (p?.type || '').toLowerCase();
    // treat 'inf', 'infant' as not requiring a seat; treat 'lap' or similar as not requiring
    if (t === 'inf' || t === 'infant' || t === 'lap') return false;
    return true;
  };

  // helper: find seat object by id
  const findSeat = (seatId: string): Seat | null => {
    for (const r of chart?.rows || []) {
      for (const s of r.seats) {
        if (s && s.id === seatId) return s;
      }
    }
    return null;
  };

  // compute reserved / taken seats from selectedSeats
  const takenSeatSet = new Set<string>(
    Object.values(selectedSeats).filter(Boolean)
  );

  // clicking on an available seat selects it for the active passenger
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);

  const selectSeatForPassenger = (seat: Seat) => {
    const p = passengers[activePassengerIndex];
    console.log(seat, p);
    if (!p) return;
    if (!passengerNeedsSeat(p)) return; // do not allow selecting for infants

    // if seat already taken by other passenger, ignore
    const occupant = Object.entries(selectedSeats).find(
      ([pid, sid]) =>
        sid === seat.id && pid !== (p.id || `${p.first_name}_${p.last_name}`)
    );
    if (occupant) return;

    setSelectedSeats((prev) => ({
      ...prev,
      [p.id || `${p.first_name}_${p.last_name}`]: seat.id,
    }));

    setSeatPrice((prev: any) => {
      const exists = prev?.find((s: any) => s.pid === p.id);

      if (!exists) {
        // Add new seat price

        if (prev)
          return [...prev, { id: seat.id, pid: p.id, price: seat.price || 0 }];
        else [{ id: seat.id, pid: p.id, price: seat.price || 0 }];
      } else {
        // Update existing entry immutably
        return prev?.map((s: any) =>
          s.pid === p.id ? { ...s, id: seat.id, price: seat.price || 0 } : s
        );
      }
    });
  };

  // allow clearing selection for passenger
  const clearSeatForPassenger = (idx: number) => {
    const p = passengers[idx];
    if (!p) return;

    const updatedPassengers = passengers.map((passenger) => {
      if (passenger.id === p.id) {
        return { ...passenger, seatId: '' };
      }
      return passenger;
    });
    onConfirm && onConfirm(updatedPassengers);

    setSelectedSeats((prev) => ({
      ...prev,
      [p.id || `${p.first_name}_${p.last_name}`]: '',
    }));

    setSeatPrice((prev: any) => {
      const exists = prev?.find((s: any) => s.pid === p.id);

      if (exists) {
        prev.map((s: any) => (s.pid === p.id ? {} : s));
      }
    });

    setExtraPrice(async (prvs: any) => ({
      ...prvs,
      seatPrice:
        (await seatPrice?.reduce(
          (sum: any, item: any) => sum + (item.price || 0),
          0
        )) || 0,
    }));
  };

  // validation: every passenger who needs a seat must have one selected
  const allEligibleHaveSeats = passengers
    .filter((p) => passengerNeedsSeat(p))
    .every((p) =>
      Boolean(selectedSeats[p.id || `${p.first_name}_${p.last_name}`])
    );

  // Confirm handler
  const handleConfirm = () => {
    // produce updated passengers array with seatId set
    const updated = passengers.map((p) => ({
      ...p,
      seatId: selectedSeats[p?.id || `${p?.first_name}_${p?.last_name}`] || '',
    }));

    setExtraPrice((prvs: any) => ({
      ...prvs,
      seatPrice:
        seatPrice?.reduce(
          (sum: any, item: any) => sum + (item.price || 0),
          0
        ) || 0,
    }));

    if (onConfirm) onConfirm(updated);
    console.log('Updated Passengers', updated);
    // console.table(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-6xl w-[95vw] md:w-[90vw] lg:w-[1100px] p-4 rounded-xl overflow-y-auto lg:overflow-hidden max-h-[95dvh] [scrollbar-width:none] [-ms-overflow-style:none]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Seat selection
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: seat map */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">About pricing</span>
                <div className="text-sm text-gray-500">
                  • Free / Paid / Not available
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs px-2 py-1 rounded-md bg-gray-100">
                  Not available
                </div>
                <div className="text-xs px-2 py-1 rounded-md bg-gray-100">
                  Free
                </div>
                <div className="text-xs px-2 py-1 rounded-md bg-emerald-50">
                  {currency ? currency : '₹'}{' '}
                  {seatPrice?.reduce(
                    (sum: any, item: any) => sum + (item.price || 0),
                    0
                  ) || 0}
                </div>
              </div>
            </div>

            <div className="flex gap-4 overflow-hidden overflow-x-auto">
              <div className="flex-1">
                <ScrollArea className="h-[56vh]">
                  <div className="w-full flex flex-col items-center">
                    <div className="w-[80%] text-center py-2 text-sm text-gray-600">
                      Front
                    </div>

                    <div className="bg-slate-50 border rounded-xl p-4 w-[90%]">
                      <div className="flex flex-col space-y-3">
                        {visibleRows.map((r) => (
                          <div
                            key={r.label}
                            className="flex items-center justify-between w-full"
                          >
                            <div
                              className="flex gap-2 items-center"
                              style={{ minWidth: 0 }}
                            >
                              {r.seats
                                .slice(0, Math.ceil(r.seats.length / 2))
                                .map((s) => (
                                  <SeatIcon
                                    key={s?.id || Math.random()}
                                    currency={currency}
                                    seat={
                                      s
                                        ? {
                                            ...s,
                                            status: takenSeatSet.has(s.id)
                                              ? 'selected'
                                              : s.status,
                                          }
                                        : null
                                    }
                                    onClick={selectSeatForPassenger}
                                    selected={Object.values(
                                      selectedSeats
                                    ).includes(s?.id || '')}
                                  />
                                ))}
                            </div>

                            <div className="w-6" />

                            <div
                              className="flex gap-2 items-center"
                              style={{ minWidth: 0 }}
                            >
                              {r.seats
                                .slice(Math.ceil(r.seats.length / 2))
                                .map((s) => (
                                  <SeatIcon
                                    key={s?.id || Math.random()}
                                    currency={currency}
                                    seat={
                                      s
                                        ? {
                                            ...s,
                                            status: takenSeatSet.has(s.id)
                                              ? 'selected'
                                              : s.status,
                                          }
                                        : null
                                    }
                                    onClick={selectSeatForPassenger}
                                    selected={Object.values(
                                      selectedSeats
                                    ).includes(s?.id || '')}
                                  />
                                ))}
                            </div>

                            <div className="w-10 text-right text-xs text-gray-500">
                              {r.label}
                            </div>
                          </div>
                        ))}

                        <div className="w-full text-center py-2 text-sm text-gray-600">
                          Rear
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between mt-3 px-5">
                  <div className="text-sm text-gray-600">
                    Showing rows {chart ? page * pageSize + 1 : 0} -{' '}
                    {chart
                      ? Math.min((page + 1) * pageSize, chart.rows.length)
                      : 0}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page <= 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                      Prev
                    </Button>
                    <div className="text-sm">
                      Page {page + 1} / {Math.max(1, totalPages)}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= totalPages - 1}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-36 hidden md:flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-2">
                  Mini map
                </div>
                <div className="h-[40vh] w-28 bg-white border rounded-lg p-1 flex flex-col justify-between">
                  {chart?.rows.map((r, i) => {
                    const isVisible =
                      i >= page * pageSize && i < (page + 1) * pageSize;
                    return (
                      <div
                        key={r.label}
                        className={`h-1 rounded ${isVisible ? 'bg-sky-600' : 'bg-gray-200'} my-[1px]`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: passenger list */}
          <div className="col-span-1">
            <Card className="w-full">
              <CardContent>
                <div className="flex flex-col py-4">
                  <div className="text-sm font-bold">
                    {sessionStorage.getItem('fromCity')?.split(',')?.[0] ||
                      Flight?.Departure?.location}{' '}
                    <MoveRight className="inline-block" />{' '}
                    {sessionStorage.getItem('toCity')?.split(',')?.[0] ||
                      Flight?.Arrival?.location}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Flight?.Departure?.date}{' '}
                    {Flight?.Departure?.time?.slice(0, 5)} •{' '}
                    {Flight?.operatingCarrier || Flight?.carrier} -{' '}
                    {Flight?.number}
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-semibold">Passengers</div>
                    <div className="flex flex-col space-y-2 mt-2">
                      {passengers.map((p, idx) => {
                        const pid = p.id || `${p.first_name}_${p.last_name}`;
                        const needsSeat = passengerNeedsSeat(p);
                        return (
                          <div
                            key={pid}
                            onClick={() => setActivePassengerIndex(idx)}
                            className={`p-3 border rounded-lg ${idx === activePassengerIndex ? 'border-sky-300 bg-sky-50' : 'border-gray-100'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-medium">
                                  {p.title
                                    ? `${p.title?.toUpperCase()} ${p.first_name?.toUpperCase()} ${p.last_name?.toUpperCase()}`
                                    : `${p.first_name?.toUpperCase()} ${p.last_name?.toUpperCase()}`}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Seat:{' '}
                                  {selectedSeats[pid] ||
                                    (needsSeat
                                      ? 'Not selected'
                                      : 'Not required')}
                                </div>
                              </div>
                              <div className="text-sm text-gray-400">
                                {idx + 1}
                              </div>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              {needsSeat ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => clearSeatForPassenger(idx)}
                                  >
                                    Clear
                                  </Button>
                                  <div className="text-xs text-gray-500">
                                    Click a seat on the map to assign
                                  </div>
                                </>
                              ) : (
                                <div className="text-xs text-gray-500">
                                  Infant / lap passenger — seat not required
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* <div className="mt-4">
                    <div className="text-sm font-semibold">Legend</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border rounded-sm" />
                        Available
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 border rounded-sm" />
                        Reserved
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-50 border rounded-sm" />
                        Blocked
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-emerald-50 border rounded-sm" />
                        Paid Seat
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="mt-4">
                    <div className="text-sm font-semibold">Legend</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      {(() => {
                        // Flatten all seats
                        const allSeats =
                          chart?.rows.flatMap((r) => r.seats.filter(Boolean)) ||
                          [];

                        // Detect which statuses exist
                        const hasAvailable = allSeats.some(
                          (s) =>
                            s?.status === 'available' || s?.status === 'unknown'
                        );
                        const hasReserved = allSeats.some(
                          (s) => s?.status === 'reserved'
                        );
                        const hasBlocked = allSeats.some(
                          (s) => s?.status === 'blocked'
                        );
                        const hasPaid = allSeats.some(
                          (s) => s?.price && s.price > 0
                        );

                        const items = [];
                        if (hasAvailable)
                          items.push({
                            label: 'Available',
                            style: 'bg-white border border-gray-300',
                          });
                        if (hasReserved)
                          items.push({
                            label: 'Reserved',
                            style: 'bg-gray-100 border border-gray-300',
                          });
                        if (hasBlocked)
                          items.push({
                            label: 'Blocked',
                            style: 'bg-gray-50 border border-gray-200',
                          });
                        if (hasPaid)
                          items.push({
                            label: 'Paid Seat',
                            style: 'bg-emerald-50 border border-gray-300',
                          });

                        // Render dynamically
                        return items.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={`w-4 h-4 rounded-sm ${item.style}`}
                            />
                            {item.label}
                          </div>
                        ));
                      })()}
                    </div>
                  </div> */}

                  <div className="mt-6 flex flex-col gap-2">
                    <Button
                      disabled={!allEligibleHaveSeats}
                      onClick={handleConfirm}
                    >
                      Confirm
                    </Button>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    {!allEligibleHaveSeats && (
                      <div className="text-xs text-rose-600 mt-2">
                        Select seats for all passengers who require seating
                        before confirming.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
