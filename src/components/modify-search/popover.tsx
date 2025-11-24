import React, { useState } from 'react';
import { Button } from '../ui/button';
// import { Label } from '../ui/label';
import { cn } from '../../../lib/utils';
import type { Travelers, TravelClass } from '../../../types/booking';
import { TravelersAndClass } from './types';

export const PopoverContent: React.FC<TravelersAndClass> = ({
  travelClass,
  travelers,
  setTravelClass,
  setTravelers,
  setShow,
}) => {
  const [localTravelers, setLocalTravelers] = useState<Travelers>(travelers);
  const [localClass, setLocalClass] = useState<TravelClass | string>(
    travelClass
  );

  // Update count of travelers

  const updateCount = (type: keyof Travelers, increment: boolean) => {
    const totalPassengers = Object.values(localTravelers).reduce(
      (a, b) => a + b,
      0
    );
    const newCount = localTravelers[type] + (increment ? 1 : -1);

    if (newCount >= 0 && (increment ? totalPassengers < 9 : true)) {
      setLocalTravelers((prev) => ({ ...prev, [type]: newCount }));
    }

    console.log(localClass, localTravelers);
  };

  return (
    <div
      className="w-[320px] rounded-[12px] absolute z-[100] bg-white border-2 top-25 md:-left-4 p-4 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
        {/* Travelers Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#BC1110]">Travellers</h3>

          {/* Adults */}
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Adults</div>
              <div className="text-sm text-gray-500">(Aged 12+ yrs)</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => updateCount('adults', false)}
                disabled={localTravelers.adults <= 1}
              >
                -
              </Button>
              <span className="w-8 text-center">{localTravelers.adults}</span>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => updateCount('adults', true)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Children */}
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Children</div>
              <div className="text-sm text-gray-500">(Aged 2-12 yrs)</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => updateCount('children', false)}
                disabled={localTravelers.children <= 0}
              >
                -
              </Button>
              <span className="w-8 text-center">{localTravelers.children}</span>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => updateCount('children', true)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Infants</div>
              <div className="text-sm text-gray-500">(Below 2 yrs)</div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={() => updateCount('infants', false)}
                disabled={localTravelers.infants <= 0}
              >
                -
              </Button>
              <span className="w-8 text-center">{localTravelers.infants}</span>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => updateCount('infants', true)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <hr />

        {/* Travel Class Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#BC1110]">Travel Class</h3>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                'Economy',
                'Premium Economy',
                'Business',
                'First',
              ] as TravelClass[]
            ).map((classType) => (
              <Button
                key={classType}
                variant="outline"
                type="button"
                className={cn(
                  'w-full justify-center',
                  localClass === classType &&
                    'bg-[#BC1110] rounded-[5px] text-white hover:text-white hover:bg-[#BC1110]/90'
                )}
                onClick={() => setLocalClass(classType)}
              >
                {classType}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            className="rounded-[5px]"
            type="button"
            variant="outline"
            onClick={() => {
              setLocalTravelers(travelers);
              setLocalClass(travelClass);
              setShow(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#BC1110] hover:bg-[#BC1110]/90 rounded-[5px]"
            type="button"
            onClick={() => {
              setTravelClass(localClass);
              setTravelers(localTravelers);
              setShow(false);
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
