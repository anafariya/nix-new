import React, { useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../components/ui/select';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface PassengerValue {
  id?: string;
  type: string;
  title: string;
  first_name: string;
  last_name: string;
  dob: string | null; // ISO date string or null
  passport_number: string;
  passport_expiry: string | null;
  nationality: string;
  issuing_country: string;
}

interface Props {
  index: number;
  value: PassengerValue;
  onChange: (patch: Partial<PassengerValue>) => void;
}

const PassengerForm: React.FC<Props> = ({ index, value, onChange }) => {
  // memoized handlers to avoid re-creation
  const handleField = useCallback(
    (field: keyof PassengerValue, v: any) => {
      // If date -> convert to ISO string; else keep string
      if (field === 'dob' || field === 'passport_expiry') {
        // Check valid DOB
        if (field === 'dob' && v) {
          const targetDate: Date = new Date(v);
          const currentDate: Date = new Date();

          const diffTime = currentDate.getTime() - targetDate.getTime();
          const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

          const dobError = document.getElementById(`dob-${index}`);

          if (value.type === 'ADT' && diffYears < 12) {
            // setError(`Passenger ${i + 1} - [ ${p.type} ] is under 12 years old`);
            alert(`Passenger ${index + 1} is under 12 years old`);
            // setIsErrorModalOpen(true);
            dobError?.focus();
            dobError?.classList.add('border-red-500');
            return;
          } else if (
            value.type === 'CHD' &&
            (diffYears < 2 || diffYears >= 12)
          ) {
            // setError(
            //   `Passenger ${i + 1} - [ ${p.type} ] must be between 2 and 12 years old`
            // );
            alert(`Passenger ${index + 1} must be between 2 and 12 years old`);
            // setIsErrorModalOpen(true);
            dobError?.focus();
            dobError?.classList.add('border-red-500');
            return;
          } else if (
            value.type === 'INF' &&
            (diffYears >= 2 || diffYears < 0)
          ) {
            // setError(
            //   `Passenger ${i + 1} - [ ${p.type} ] must be under 2 years old`
            // );
            alert(`Passenger ${index + 1} must be under 2 years old`);
            // setIsErrorModalOpen(true);
            dobError?.focus();
            dobError?.classList.add('border-red-500');
            return;
          }
        }

        onChange({
          [field]: v ? dayjs(v).format('YYYY-MM-DD') : null,
        } as Partial<PassengerValue>);
      } else {
        onChange({ [field]: v } as Partial<PassengerValue>);
      }
    },
    [onChange]
  );

  const dobDayjs = useMemo(
    () => (value.dob ? dayjs(value.dob) : null),
    [value.dob]
  );
  const expiryDayjs = useMemo(
    () => (value.passport_expiry ? dayjs(value.passport_expiry) : null),
    [value.passport_expiry]
  );

  return (
    <div className="flex-1">
      <Card className="w-full rounded-xl shadow-none border-0">
        <CardHeader className="hidden">
          <CardTitle className="text-xl font-semibold">
            Who's travelling?
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 py-2 px-0">
          <div>
            <div className="flex gap-4 md:justify-between flex-wrap">
              <div className="text-lg space-y-1 w-fit">
                <Label>Title on ID *</Label>
                <Select
                  value={value.title || ''}
                  onValueChange={(val) => handleField('title', val)}
                >
                  <SelectTrigger className="outline-none rounded-xl w-36">
                    <SelectValue placeholder="Select Title" />
                  </SelectTrigger>
                  <SelectContent>
                    {value.type.includes('ADT') ? (
                      <>
                        <SelectItem value="MR">Mr</SelectItem>
                        <SelectItem value="MS">Ms</SelectItem>
                        <SelectItem value="MRS">Mrs</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="MSTR">Mstr</SelectItem>
                        <SelectItem value="MISS">Miss</SelectItem>
                      </>
                    )}

                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-40">
                <Label htmlFor={`givenName-${index}`}>Given name(s) *</Label>
                <Input
                  id={`givenName-${index}`}
                  placeholder="Enter first name"
                  value={value.first_name}
                  onChange={(e) =>
                    handleField('first_name', e.target.value.trim())
                  }
                  className="text-lg rounded-xl my-2 placeholder:text-gray-400"
                />
              </div>

              <div className="flex-1 min-w-40">
                <Label htmlFor={`surname-${index}`}>Surname *</Label>
                <Input
                  id={`surname-${index}`}
                  placeholder="Enter last name"
                  value={value.last_name}
                  onChange={(e) =>
                    handleField('last_name', e.target.value.trim())
                  }
                  className="text-lg rounded-xl my-2 placeholder:text-gray-400"
                />
              </div>

              <div className="flex-1 space-y-2 min-w-40">
                <Label htmlFor={`dob-${index}`}>Date of Birth *</Label>
                <DatePicker
                  id={`dob-${index}`}
                  className="w-full rounded-xl"
                  placeholder="Select Date of Birth"
                  value={dobDayjs}
                  format="DD MMM YYYY"
                  disabledDate={(current) => {
                    return current && current.isAfter(dayjs().startOf('day'));
                  }}
                  // onChange={(date) =>
                  //   handleField('dob', date ? dayjs(date).toISOString() : null)
                  // }
                  onChange={(date) =>
                    handleField(
                      'dob',
                      date ? dayjs(date).format('YYYY-MM-DD') : null
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 space-y-1">
            <p>• Enter passenger's name exactly as it appears on their ID</p>
            <p>
              • Ensure the travel document is valid on the return date of the
              trip
            </p>
          </div>

          <div>
            <Label className="text-gray-700 cursor-pointer hover:text-black">
              Passport Details (Optional for domestic travel)
            </Label>

            {/* show fields only when passport_number is present OR you want explicit toggle on parent */}
            <div className="grid grid-cols-2 gap-4 my-4">
              <div>
                <Label htmlFor={`passnum-${index}`}>Passport Number *</Label>
                <Input
                  id={`passnum-${index}`}
                  placeholder="Enter passport number"
                  value={value.passport_number}
                  onChange={(e) =>
                    handleField('passport_number', e.target.value.trim())
                  }
                  className="text-lg rounded-xl my-2 placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor={`expiry-${index}`}>Passport Expiry *</Label>
                <DatePicker
                  id={`expiry-${index}`}
                  className="w-full rounded-xl mt-2"
                  placeholder="Select Passport Expiry"
                  value={expiryDayjs}
                  format="DD MMM YYYY"
                  disabledDate={(current) => {
                    return current && current.isBefore(dayjs().startOf('day'));
                  }}
                  // onChange={(date) =>
                  //   handleField(
                  //     'passport_expiry',
                  //     date ? dayjs(date).toISOString() : null
                  //   )
                  // }
                  onChange={(date) =>
                    handleField(
                      'passport_expiry',
                      date ? dayjs(date).format('YYYY-MM-DD') : null
                    )
                  }
                />
              </div>

              <div>
                <Label>Nationality *</Label>
                <Select
                  value={value.nationality || ''}
                  onValueChange={(val) => handleField('nationality', val)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Issuing Country *</Label>
                <Select
                  value={value.issuing_country || ''}
                  onValueChange={(val) => handleField('issuing_country', val)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(PassengerForm);
