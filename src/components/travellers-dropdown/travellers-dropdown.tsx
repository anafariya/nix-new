'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Users } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Travelers, TravelClass } from '../../../types/booking';

interface TravelersDropdownProps {
  travelers: Travelers;
  travelClass: TravelClass;
  onUpdate: (travelers: Travelers, travelClass: TravelClass) => void;
}

export function TravelersDropdown({
  travelers,
  travelClass,
  onUpdate,
}: TravelersDropdownProps) {
  const [localTravelers, setLocalTravelers] = useState<Travelers>(travelers);
  const [localClass, setLocalClass] = useState<TravelClass>(travelClass);
  const [isOpen, setIsOpen] = useState(false);

  const updateCount = (type: keyof Travelers, increment: boolean) => {
    const totalPassengers = Object.values(localTravelers).reduce(
      (a, b) => a + b,
      0
    );
    const newCount = localTravelers[type] + (increment ? 1 : -1);

    if (newCount >= 0 && (increment ? totalPassengers < 9 : true)) {
      setLocalTravelers((prev) => ({ ...prev, [type]: newCount }));
    }
  };

  const getTravelersText = () => {
    const total = Object.values(travelers).reduce((a, b) => a + b, 0);
    return `${total} Traveler${total !== 1 ? 's' : ''}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 justify-start text-left font-normal rounded-[12px] bg-white border border-gray-300"
        >
          <Users className="mr-1 h-4 w-4" />
          <span>
            {getTravelersText()} • {travelClass}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] rounded-[5px]">
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
                  variant="outline"
                  onClick={() => updateCount('adults', false)}
                  disabled={localTravelers.adults <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{localTravelers.adults}</span>
                <Button
                  size="sm"
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
                  variant="outline"
                  onClick={() => updateCount('children', false)}
                  disabled={localTravelers.children <= 0}
                >
                  -
                </Button>
                <span className="w-8 text-center">
                  {localTravelers.children}
                </span>
                <Button
                  size="sm"
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
                  variant="outline"
                  onClick={() => updateCount('infants', false)}
                  disabled={localTravelers.infants <= 0}
                >
                  -
                </Button>
                <span className="w-8 text-center">
                  {localTravelers.infants}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCount('infants', true)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Travel Class Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#BC1110]">
              Travel Class
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  'Economy',
                  'Premium Economy',
                  'Business',
                  'First Class',
                ] as TravelClass[]
              ).map((classType) => (
                <Button
                  key={classType}
                  variant="outline"
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
              variant="outline"
              onClick={() => {
                setLocalTravelers(travelers);
                setLocalClass(travelClass);
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#BC1110] hover:bg-[#BC1110]/90 rounded-[5px]"
              onClick={() => {
                onUpdate(localTravelers, localClass);
                setIsOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
