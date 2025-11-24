'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Clock, ChevronDown, ChevronUp, Plane } from 'lucide-react';
import dayjs from 'dayjs';
import { calculateTimeDifference, toTitleCase } from '../helpers';
import { cn } from '../../../lib/utils'; // for conditional classNames (optional helper)

interface TripSummaryProps {
  flightDetails: any;
  index?: number;
}

export const TripSummary: React.FC<TripSummaryProps> = ({
  flightDetails,
  index,
}) => {
  const [showSummary, setShowSummary] = useState(false);

  // 🧠 Memoize data to prevent recomputation on every render
  const offer = useMemo(
    () => flightDetails?.OfferListResponse?.OfferID?.[0]?.Product?.[index || 0],
    [flightDetails]
  );

  const flightSegments = useMemo(() => offer?.FlightSegment ?? [], [offer]);
  const firstSegment = flightSegments[0];
  const lastSegment = flightSegments[flightSegments.length - 1];

  const session = useMemo(() => {
    if (index && index === 1) {
      return {
        fromCity: sessionStorage.getItem('toCity'),
        toCity: sessionStorage.getItem('fromCity'),
        fromCode: sessionStorage.getItem('toAirportCode'),
        toCode: sessionStorage.getItem('fromAirportCode'),
      };
    }
    return {
      fromCity: sessionStorage.getItem('fromCity'),
      toCity: sessionStorage.getItem('toCity'),
      fromCode: sessionStorage.getItem('fromAirportCode'),
      toCode: sessionStorage.getItem('toAirportCode'),
    };
  }, []);

  let fromCityDisplay =
    session.fromCode === firstSegment?.Flight?.Departure?.location &&
    session.fromCity
      ? session.fromCity
      : firstSegment?.Flight?.Departure?.location;

  let toCityDisplay =
    session.toCode === lastSegment?.Flight?.Arrival?.location && session.toCity
      ? session.toCity
      : lastSegment?.Flight?.Arrival?.location;

  // if (
  //   sessionStorage.getItem('tripType') === 'round-trip' &&
  //   index &&
  //   index === 1
  // ) {
  //   fromCityDisplay =
  //     session.toCode === firstSegment?.Flight?.Departure?.location &&
  //     session.toCity
  //       ? session.toCity
  //       : firstSegment?.Flight?.Departure?.location;
  //   toCityDisplay =
  //     session.fromCode === lastSegment?.Flight?.Arrival?.location &&
  //     session.fromCode
  //       ? session.fromCity
  //       : lastSegment?.Flight?.Arrival?.location;

  // }

  const travelDate = dayjs(firstSegment?.Flight?.Departure?.date).format(
    'DD MMM YYYY'
  );

  const totalDuration = calculateTimeDifference(
    {
      date: firstSegment?.Flight?.Departure?.date,
      time: firstSegment?.Flight?.Departure?.time?.slice(0, 5),
    },
    {
      date: lastSegment?.Flight?.Arrival?.date,
      time: lastSegment?.Flight?.Arrival?.time?.slice(0, 5),
    }
  );

  useEffect(() => {
    setShowSummary(false);
  }, []);

  return (
    <div className="w-full pb-0">
      <Card
        className={cn(
          'p-6 rounded-2xl transition-all duration-300 shadow-md border',
          showSummary
            ? 'bg-white border-gray-100 hover:shadow-lg'
            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
        )}
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer"
          onClick={() => setShowSummary((p) => !p)}
        >
          <h2
            className={cn(
              'text-xl md:text-2xl font-semibold flex items-center gap-2 transition-colors tracking-tight',
              !showSummary && 'text-white'
            )}
          >
            <Plane
              className={cn(
                'w-5 h-5',
                showSummary ? 'text-blue-600' : 'text-white'
              )}
            />
            {index && index === 1 ? 'Return' : 'Trip'} to{' '}
            {toCityDisplay || session?.toCity}
            {showSummary ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </h2>

          <button
            onClick={(e) => {
              e.stopPropagation();
              window.history.back();
            }}
            className={cn(
              'text-sm font-medium transition-all px-3 py-1 rounded-md hidden md:inline-block',
              showSummary
                ? 'text-blue-600 hover:underline hover:text-blue-700'
                : 'text-white hover:bg-blue-700/30'
            )}
          >
            Change Flight
          </button>
        </div>

        {/* Summary */}
        {showSummary && (
          <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="h-[1px] bg-gray-200" />

            {/* Route Overview */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="font-semibold text-gray-800 text-base">
                {fromCityDisplay} → {toCityDisplay}
              </p>
              <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-x-2">
                <span>{travelDate}</span>
                <span className="text-gray-400">•</span>
                <span>Total duration: {totalDuration}</span>
              </div>
            </div>

            {/* Flight Segments */}
            <div className="space-y-8 border-l-2 border-blue-100 pl-5 relative">
              {flightSegments.map((flight: any, i: number) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[12px] top-[6px] w-3 h-3 bg-blue-500 ring-2 ring-blue-100 rounded-full group-hover:scale-125 transition-transform" />

                  <div className="space-y-1 pl-2">
                    <p className="text-base font-semibold text-gray-800">
                      {flight?.Flight?.Departure?.time?.slice(0, 5)} —{' '}
                      {session.fromCode ===
                        flight?.Flight?.Departure?.location && session.fromCity
                        ? session.fromCity
                        : flight?.Flight?.Departure?.location}{' '}
                      {flight?.Flight?.Departure?.terminal &&
                        `• Terminal ${flight?.Flight?.Departure?.terminal}`}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {toTitleCase(flight?.Flight?.operatingCarrierName || '')}{' '}
                      ·{' '}
                      {`${flight?.Flight?.operatingCarrier || flight?.Flight?.carrier}-${flight?.Flight?.number}`}
                    </p>

                    <p className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1 text-blue-500" />
                      Flight time: {flight?.Flight?.duration?.slice(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Arrival */}
              <div className="relative group">
                <div className="absolute -left-[12px] top-[6px] w-3 h-3 bg-green-500 ring-2 ring-green-100 rounded-full group-hover:scale-125 transition-transform" />

                <div className="space-y-1 pl-2">
                  <p className="text-base font-semibold text-gray-800">
                    {lastSegment?.Flight?.Arrival?.time?.slice(0, 5)} —{' '}
                    {toCityDisplay}{' '}
                    {lastSegment?.Flight?.Arrival?.terminal &&
                      `• Terminal ${lastSegment?.Flight?.Arrival?.terminal}`}
                  </p>

                  <p className="text-gray-600 text-sm">
                    {toTitleCase(
                      lastSegment?.Flight?.operatingCarrierName || ''
                    )}{' '}
                    ·{' '}
                    {`${lastSegment?.Flight?.operatingCarrier || lastSegment?.Flight?.carrier}-${lastSegment?.Flight?.number}`}
                  </p>

                  <p className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1 text-green-600" />
                    Flight time: {lastSegment?.Flight?.duration?.slice(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
