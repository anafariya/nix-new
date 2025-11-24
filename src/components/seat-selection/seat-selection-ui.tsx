import React, { useState, useMemo, useCallback } from 'react';
import { X, Plane, Users, Info, Check } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Passenger {
  id: string;
  name: string;
  type: 'ADT' | 'CHD' | 'INF';
}

// interface SeatCharacteristic {
//   code: string;
//   label: string;
// }

interface Seat {
  row: string;
  column: string;
  code: string;
  status: 'Available' | 'Reserved' | 'NoSeat' | 'Blocked';
  characteristics: string[];
  price: number;
  brand: string;
}

interface Flight {
  id: string;
  carrier: string;
  number: string;
  departure: string;
  arrival: string;
  date: string;
  equipment: string;
  seats: Seat[];
  layout: {
    startRow: number;
    endRow: number;
    columns: string[];
  };
}

interface SeatAssignment {
  passengerId: string;
  flightId: string;
  seatCode: string;
}

// ============================================================================
// PARSER
// ============================================================================

const parseTravelportResponse = (response: any): Flight[] => {
  const flights: Flight[] = [];
  const catalogOfferings =
    response?.CatalogOfferingsAncillaryListResponse?.CatalogOfferingsID || [];
  const seatingCharts =
    response?.CatalogOfferingsAncillaryListResponse?.ReferenceList?.[0]
      ?.SeatingChart || [];

  catalogOfferings.forEach((offering: any) => {
    const flight = offering.Flight?.[0];
    if (!flight) return;

    const flightId = flight.id;
    const catalogItems = offering.CatalogOffering || [];

    const seatsMap = new Map<string, Seat>();
    const seatChartRef =
      catalogItems?.[0]?.ProductOptions?.[0]?.Product?.[0]?.[0]
        ?.SeatingChartRef;

    catalogItems.forEach((catalog: any) => {
      const products = catalog.ProductOptions?.[0]?.Product || [];
      const price = catalog.Price?.TotalPrice || 0;
      const brand = products[0]?.Brand?.name || 'Standard';
      const chartRef = products[0]?.SeatingChartRef;

      products.forEach((product: any) => {
        const availabilities = product.SeatAvailability || [];
        availabilities.forEach((avail: any) => {
          const status = avail.seatAvailabilityStatus;
          const seatCodes = avail.value || [];

          seatCodes.forEach((seatCode: string) => {
            const row = seatCode.match(/\d+/)?.[0] || '';
            const column = seatCode.match(/[A-Z]+/)?.[0] || '';

            // Find characteristics from seating chart
            const chart = seatingCharts.find((c: any) => c.id === chartRef);
            const cabin = chart?.Cabin?.[0];
            const rowData = cabin?.Row?.find((r: any) => r.label === row);
            const spaceData = rowData?.Space?.find(
              (s: any) => s.location === column
            );
            const characteristics = spaceData?.Characteristic || [];

            seatsMap.set(seatCode, {
              row,
              column,
              code: seatCode,
              status:
                status === 'Available'
                  ? 'Available'
                  : status === 'Reserved'
                    ? 'Reserved'
                    : 'NoSeat',
              characteristics,
              price,
              brand,
            });
          });
        });
      });
    });

    // Extract layout from first seating chart
    const seatsChart = seatingCharts.find((c: any) => c.id === seatChartRef);
    const cabin = seatsChart?.Cabin?.[0];
    const layout = cabin?.Layout || [];
    const startRow = layout.find((l: any) => l.startRow)?.startRow || 1;
    const endRow = layout.find((l: any) => l.endRow)?.endRow || 30;
    const columns = layout.filter((l: any) => l.value).map((l: any) => l.value);

    flights.push({
      id: flightId,
      carrier: flight.carrier,
      number: flight.number,
      departure: flight.Departure.location,
      arrival: flight.Arrival.location,
      date: flight.Departure.date,
      equipment: flight.equipment,
      seats: Array.from(seatsMap.values()),
      layout: { startRow, endRow, columns },
    });
  });

  return flights;
};

// ============================================================================
// CHARACTERISTIC LABELS
// ============================================================================

const CHARACTERISTIC_LABELS: Record<string, string> = {
  W: 'Window',
  A: 'Aisle',
  C: 'Center',
  L: 'Extra Legroom',
  E: 'Exit Row',
  K: 'Bulkhead',
  N: 'No Recline',
  O: 'Overwing',
  CH: 'Chargeable',
  BK: 'Blocked',
  IE: 'Infant Seat',
  '1D': 'One Device',
  H: 'Handicap',
  U: 'Upper Deck',
};

// ============================================================================
// COMPONENTS
// ============================================================================

const SeatTooltip: React.FC<{ seat: Seat; children: React.ReactNode }> = ({
  seat,
  children,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
          <div className="font-semibold mb-1">{seat.code}</div>
          <div className="text-gray-300 mb-1">{seat.brand}</div>
          {seat.characteristics.length > 0 && (
            <div className="text-gray-400 text-[10px]">
              {seat.characteristics
                .map((c) => CHARACTERISTIC_LABELS[c] || c)
                .join(', ')}
            </div>
          )}
          {seat.price > 0 && (
            <div className="text-blue-400 font-semibold mt-1">
              ₹{seat.price.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SeatButton: React.FC<{
  seat: Seat;
  isSelected: boolean;
  isAssigned: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ seat, isSelected, isAssigned, onClick, disabled }) => {
  const getButtonClass = () => {
    // if (seat.status === 'NoSeat') return 'invisible';
    if (seat.status === 'NoSeat')
      return 'bg-gray-300 cursor-not-allowed text-gray-500';
    if (disabled || seat.status === 'Reserved' || seat.status === 'Blocked') {
      return 'bg-gray-300 cursor-not-allowed text-gray-500';
    }
    if (isSelected) return 'bg-blue-600 text-white border-blue-700 border-2';
    if (isAssigned)
      return 'bg-orange-400 text-white border-orange-500 border-2';
    return 'bg-white border-gray-300 border hover:bg-blue-50 hover:border-blue-400 text-gray-700';
  };

  return (
    <SeatTooltip seat={seat}>
      <button
        onClick={onClick}
        disabled={
          disabled ||
          seat.status === 'Reserved' ||
          seat.status === 'NoSeat' ||
          seat.status === 'Blocked'
        }
        className={`w-10 h-10 text-xs font-medium rounded transition-all ${getButtonClass()}`}
      >
        {/* {seat.status !== 'NoSeat' && seat.column} */}
        {seat.column}
      </button>
    </SeatTooltip>
  );
};

const SeatMap: React.FC<{
  flight: Flight;
  selectedPassenger: Passenger | null;
  assignments: SeatAssignment[];
  onSeatSelect: (seatCode: string) => void;
}> = ({ flight, selectedPassenger, assignments, onSeatSelect }) => {
  const rows = useMemo(() => {
    const result: Record<string, Seat[]> = {};
    for (let i = flight.layout.startRow; i <= flight.layout.endRow; i++) {
      result[i.toString()] = [];
    }

    flight.seats.forEach((seat) => {
      if (result[seat.row]) {
        result[seat.row].push(seat);
      }
    });

    return result;
  }, [flight]);

  const currentAssignment = assignments.find(
    (a) => a.passengerId === selectedPassenger?.id && a.flightId === flight.id
  );

  const isExitRow = (characteristics: string[]) =>
    characteristics.includes('E') || characteristics.includes('IE');

  const canSelectSeat = (seat: Seat) => {
    if (!selectedPassenger) return false;
    if (seat.status !== 'Available') return false;
    if (isExitRow(seat.characteristics) && selectedPassenger.type !== 'ADT')
      return false;
    return true;
  };

  console.log(rows);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
        <Plane className="w-5 h-5 text-blue-600" />
        <div>
          <div className="font-semibold text-gray-900">
            {flight.carrier} {flight.number}
          </div>
          <div className="text-sm text-gray-600">
            {flight.departure} → {flight.arrival} • {flight.equipment}
          </div>
        </div>
      </div>

      {!selectedPassenger && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          Select a passenger to choose seats
        </div>
      )}

      {selectedPassenger && (
        <>
          <div className="flex justify-center gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span>Other Passenger</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Occupied/Blocked/NoSeat</span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
            {Object.entries(rows).map(([rowNum, seats]) => {
              if (seats.length === 0) return null;

              const sortedSeats = [...seats].sort(
                (a, b) =>
                  flight.layout.columns.indexOf(a.column) -
                  flight.layout.columns.indexOf(b.column)
              );

              return (
                <div key={rowNum} className="flex items-center gap-1 mb-1">
                  <div className="w-8 text-xs text-gray-500 font-medium text-right mr-2">
                    {rowNum}
                  </div>
                  <div className="flex gap-1">
                    {sortedSeats.map((seat, idx) => {
                      const isSelected =
                        currentAssignment?.seatCode === seat.code;
                      const isAssigned = assignments.some(
                        (a) =>
                          a.seatCode === seat.code &&
                          a.flightId === flight.id &&
                          a.passengerId !== selectedPassenger.id
                      );

                      // Add aisle gap
                      const showGap =
                        idx > 0 &&
                        Math.abs(
                          flight.layout.columns.indexOf(seat.column) -
                            flight.layout.columns.indexOf(
                              sortedSeats[idx - 1].column
                            )
                        ) > 1;

                      return (
                        <React.Fragment key={seat.code}>
                          {showGap && <div className="w-4"></div>}
                          <SeatButton
                            seat={seat}
                            isSelected={isSelected}
                            isAssigned={isAssigned}
                            onClick={() => onSeatSelect(seat.code)}
                            disabled={!canSelectSeat(seat)}
                          />
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const SeatSelectionDialog: React.FC<{
  rawResponses: any[];
  onClose: () => void;
}> = ({ rawResponses, onClose }) => {
  const passengers: Passenger[] = [
    { id: 'p1', name: 'John Doe', type: 'ADT' },
    { id: 'p2', name: 'Jane Smith', type: 'CHD' },
  ];

  const flights = useMemo(() => {
    const allFlights: Flight[] = [];
    rawResponses.forEach((response) => {
      allFlights.push(...parseTravelportResponse(response));
    });
    return allFlights;
  }, [rawResponses]);

  const [selectedFlightId, setSelectedFlightId] = useState<string>(
    flights[0]?.id || ''
  );
  const [selectedPassengerId, setSelectedPassengerId] = useState<string>(
    passengers[0]?.id || ''
  );
  const [assignments, setAssignments] = useState<SeatAssignment[]>([]);

  const selectedFlight = flights.find((f) => f.id === selectedFlightId);
  const selectedPassenger = passengers.find(
    (p) => p.id === selectedPassengerId
  );

  console.log('Flights', flights);

  const handleSeatSelect = useCallback(
    (seatCode: string) => {
      if (!selectedPassenger || !selectedFlight) return;

      setAssignments((prev) => {
        const filtered = prev.filter(
          (a) =>
            !(
              a.passengerId === selectedPassenger.id &&
              a.flightId === selectedFlight.id
            )
        );

        return [
          ...filtered,
          {
            passengerId: selectedPassenger.id,
            flightId: selectedFlight.id,
            seatCode,
          },
        ];
      });
    },
    [selectedPassenger, selectedFlight]
  );

  const handleConfirm = () => {
    console.log('Seat Assignments:', assignments);
    const formatted = assignments.map((a) => {
      const passenger = passengers.find((p) => p.id === a.passengerId);
      const flight = flights.find((f) => f.id === a.flightId);
      return {
        passenger: passenger?.name,
        flight: `${flight?.carrier}${flight?.number}`,
        seat: a.seatCode,
      };
    });
    console.table(formatted);
    alert('Seat assignments confirmed! Check console for details.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Seat Selection
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Sidebar - Stacked on mobile, side-by-side on desktop */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r bg-gray-50 p-3 sm:p-4 overflow-y-auto">
            {/* Flight Selection */}
            <div className="mb-4 lg:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <Plane className="w-3 h-3 sm:w-4 sm:h-4" />
                Flights
              </h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
                {flights.map((flight) => (
                  <button
                    key={flight.id}
                    onClick={() => setSelectedFlightId(flight.id)}
                    className={`flex-shrink-0 lg:flex-shrink text-left p-2 sm:p-3 rounded-lg transition-all min-w-[160px] lg:min-w-0 ${
                      selectedFlightId === flight.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="font-semibold text-xs sm:text-sm">
                      {flight.carrier} {flight.number}
                    </div>
                    <div className="text-[10px] sm:text-xs opacity-80 mt-1">
                      {flight.departure} → {flight.arrival}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Passenger Selection */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Passengers
              </h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
                {passengers.map((passenger) => {
                  const assignment = assignments.find(
                    (a) =>
                      a.passengerId === passenger.id &&
                      a.flightId === selectedFlightId
                  );

                  return (
                    <button
                      key={passenger.id}
                      onClick={() => setSelectedPassengerId(passenger.id)}
                      className={`flex-shrink-0 lg:flex-shrink text-left p-2 sm:p-3 rounded-lg transition-all min-w-[140px] lg:min-w-0 ${
                        selectedPassengerId === passenger.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">
                            {passenger.name}
                          </div>
                          <div className="text-[10px] sm:text-xs opacity-80 mt-1">
                            {passenger.type === 'ADT' ? 'Adult' : 'Child'}
                          </div>
                        </div>
                        {assignment && (
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold flex-shrink-0">
                            <Check className="w-3 h-3" />
                            {assignment.seatCode}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Seat Map */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            {selectedFlight ? (
              <SeatMap
                flight={selectedFlight}
                selectedPassenger={selectedPassenger || null}
                assignments={assignments}
                onSeatSelect={handleSeatSelect}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Info className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm sm:text-base">No flights available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-3 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs sm:text-sm text-gray-600">
            {assignments.length} seat(s) selected
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={assignments.length === 0}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DEMO APP
// ============================================================================

export default function SeatMapDemo({
  seatmapResponse,
  passengers,
  currency,
  onConfirm,
  setExtraPrice,
}: any) {
  console.log({
    seatmapResponse,
    passengers,
    currency,
    onConfirm,
    setExtraPrice,
  });

  const [showDialog, setShowDialog] = useState(false);

  // Mock data - replace with your actual Travelport responses
  // const mockResponses = [
  //   {
  //     CatalogOfferingsAncillaryListResponse: {
  //       CatalogOfferingsID: [
  //         {
  //           Flight: [
  //             {
  //               id: 'flight1',
  //               carrier: 'EY',
  //               number: '233',
  //               Departure: { location: 'BLR', date: '2025-11-09' },
  //               Arrival: { location: 'AUH' },
  //               equipment: '789',
  //             },
  //           ],
  //           CatalogOffering: [
  //             {
  //               ProductOptions: [
  //                 {
  //                   Product: [
  //                     {
  //                       Brand: { name: 'Standard' },
  //                       SeatAvailability: [
  //                         {
  //                           seatAvailabilityStatus: 'Available',
  //                           value: ['15A', '15C', '15D', '16A', '16C'],
  //                         },
  //                         {
  //                           seatAvailabilityStatus: 'Reserved',
  //                           value: ['15B', '16B'],
  //                         },
  //                       ],
  //                       SeatingChartRef: 'chart1',
  //                     },
  //                   ],
  //                 },
  //               ],
  //               Price: { TotalPrice: 1500 },
  //             },
  //           ],
  //         },
  //       ],
  //       ReferenceList: [
  //         {
  //           SeatingChart: [
  //             {
  //               id: 'chart1',
  //               Cabin: [
  //                 {
  //                   Layout: [
  //                     { startRow: 15, endRow: 20 },
  //                     { position: ['W'], value: 'A' },
  //                     { position: ['C'], value: 'B' },
  //                     { position: ['A'], value: 'C' },
  //                     { position: ['A'], value: 'D' },
  //                   ],
  //                   Row: [
  //                     {
  //                       label: '15',
  //                       Space: [
  //                         { location: 'A', Characteristic: ['W', 'N'] },
  //                         { location: 'B', Characteristic: ['C'] },
  //                         { location: 'C', Characteristic: ['A'] },
  //                         { location: 'D', Characteristic: ['A'] },
  //                       ],
  //                     },
  //                     {
  //                       label: '16',
  //                       Space: [
  //                         { location: 'A', Characteristic: ['W', 'L', 'E'] },
  //                         { location: 'B', Characteristic: ['C'] },
  //                         { location: 'C', Characteristic: ['A', 'E'] },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Flight Booking
          </h1>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Bengaluru → Abu Dhabi</div>
                <div className="text-sm text-gray-600">
                  Etihad Airways • 4h 15m
                </div>
              </div>
              <button
                onClick={() => setShowDialog(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select Seats
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDialog && (
        <SeatSelectionDialog
          rawResponses={[seatmapResponse?.gdsOrNdcResponse]}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
