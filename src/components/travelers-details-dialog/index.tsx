// import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
// import axios from 'axios';
import { useParams } from 'react-router-dom';
import { TripSummary } from '../trip-summary';
// import SeatSelectionDialog from '../seat-selection';

export type Passenger = {
  id?: string;
  type: string;
  title: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  passport_number: string;
  passport_expiry: string | null;
  nationality: string;
  issuing_country: string;
  seatId: string;
};

type PassengerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passengers: Passenger[];
  onContinue?: () => void;
  flightDetails?: any;
  grandTotal?: number;
};

export const PassengerDialog: React.FC<PassengerDialogProps> = ({
  open,
  onOpenChange,
  passengers,
  onContinue,
  flightDetails,
  grandTotal,
}) => {
  const params = useParams();
  const { fields } = params;
  // parse fields only once
  const data: Record<string, string> = {};
  fields?.split('&')?.forEach((a: any) => {
    const [key, value] = a.split('=');
    if (key) data[key] = value;
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl p-0 w-[95vw] md:w-3/4 max-h-[95dvh] rounded-xl md:rounded-xl overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]">
          <DialogHeader className="bg-blue-800 text-white p-4 md:p-6">
            <DialogTitle>Passenger Details</DialogTitle>
            <DialogDescription className="text-sm text-nix-white">
              Below are the passenger details fetched from your offer.
            </DialogDescription>
          </DialogHeader>

          {/* Trip summary */}
          <div className="w-[95%] mx-auto flex flex-col gap-2">
            <TripSummary flightDetails={flightDetails} />
            {sessionStorage.getItem('tripType') === 'round-trip' && (
              <TripSummary flightDetails={flightDetails} index={1} />
            )}
          </div>

          {/* Passengers List */}

          <div className="mt-4 p-4 md:p-6 space-y-6 overflow-y-visible max-h-fit">
            {passengers.map((p, idx) => (
              <div
                key={p.id}
                className="border rounded-lg p-4 md:p-6 bg-white shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                <div className="md:col-span-2">
                  <div className="text-sm font-medium">Passenger {idx + 1}</div>
                  <div className="text-xs text-muted-foreground">{p.id}</div>
                </div>

                <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                  <div className="md:col-span-2">
                    <span className="font-medium">Type:</span> {p.type}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Title:</span> {p.title || '—'}
                  </div>
                  <div className="md:col-span-4">
                    <span className="font-medium">First name:</span>{' '}
                    {p.first_name || '—'}
                  </div>
                  <div className="md:col-span-4">
                    <span className="font-medium">Last name:</span>{' '}
                    {p.last_name || '—'}
                  </div>

                  <div className="md:col-span-4">
                    <span className="font-medium">Date of birth:</span>{' '}
                    {p.dob ? new Date(p.dob).toLocaleDateString() : '—'}
                  </div>
                  {p?.passport_number &&
                    p?.nationality &&
                    p?.issuing_country &&
                    p?.passport_expiry && (
                      <>
                        <div className="md:col-span-4">
                          <span className="font-medium">Nationality:</span>{' '}
                          {p.nationality || '—'}
                        </div>
                        <div className="md:col-span-4">
                          <span className="font-medium">Issuing Country:</span>{' '}
                          {p.issuing_country || '—'}
                        </div>

                        <div className="md:col-span-6">
                          <span className="font-medium">Passport number:</span>{' '}
                          {p.passport_number || '—'}
                        </div>
                        <div className="md:col-span-6">
                          <span className="font-medium">Passport Expiry:</span>{' '}
                          {p.passport_expiry
                            ? new Date(p.passport_expiry).toLocaleDateString()
                            : '—'}
                        </div>
                      </>
                    )}
                  {p?.seatId && (
                    <>
                      <div className="md:col-span-4">
                        <span className="font-medium">SeatID:</span>{' '}
                        {p.seatId || '—'}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}

          <div className="mt-6 flex justify-end p-4 md:p-6">
            <Button
              variant="ghost"
              className="hover:bg-red-800 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className="bg-blue-800 text-white hover:text-white hover:bg-blue-900"
              // onClick={() => {
              //   setLoading(true);
              //   setOpenSeatMap(true);
              //   if (gdsOrNdcResponse === null) fetchSeats();
              //   onOpenChange(!loading && true);
              // }}
              // disabled={loading}
              onClick={() => {
                onContinue?.();
                onOpenChange(false);
              }}
            >
              Continue to pay{' '}
              {flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                ?.CurrencyCode?.value || 'Rs'}{' '}
              {grandTotal}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* <SeatSelectionDialog
        open={openSeatMap && gdsOrNdcResponse != null}
        onOpenChange={setOpenSeatMap}
        seatmapResponse={gdsOrNdcResponse}
        passengers={passengers}
        currency="INR"
      /> */}
    </>
  );
};

// Example usage from another component
// export const PassengerDialogExampleParent: React.FC<{ passengers: Passenger[] }> = ({ passengers }) => {
//   const [open, setOpen] = React.useState(false);
//   return (
//     <div>
//       <Button onClick={() => setOpen(true)}>View Passenger Details</Button>
//       <PassengerDialog open={open} onOpenChange={setOpen} passengers={passengers} />
//     </div>
//   );
// };
