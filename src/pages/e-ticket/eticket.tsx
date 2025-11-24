import { useRef, useState } from 'react';
import {
  Plane,
  User,
  CreditCard,
  Download,
  Printer,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';
// import { Card, CardContent } from '../../components/ui/card';

import QRCode from 'react-qr-code';
// Sample API response data
const apiResponse = {
  ReservationResponse: {
    Reservation: {
      Identifier: {
        value: '4c85f642-e350-44cb-862c-411416b85036',
      },
      Offer: [
        {
          id: 'offer_1',
          Product: [
            {
              id: 'product_1',
              FlightSegment: [
                {
                  id: 'FlightSegment_01',
                  sequence: 1,
                  connectionDuration: 'PT1H55M',
                  Flight: {
                    duration: 'PT4H5M',
                    carrier: 'EY',
                    number: '1013',
                    operatingCarrier: 'QP',
                    operatingCarrierName: 'AKASA AIR',
                    equipment: '7M8',
                    Departure: {
                      location: 'BLR',
                      date: '2026-03-10',
                      time: '10:00:00',
                    },
                    Arrival: {
                      location: 'AUH',
                      date: '2026-03-10',
                      time: '12:35:00',
                    },
                  },
                },
                {
                  id: 'FlightSegment_02',
                  sequence: 2,
                  Flight: {
                    duration: 'PT6H',
                    carrier: 'EY',
                    number: '843',
                    equipment: '781',
                    Departure: {
                      location: 'AUH',
                      date: '2026-03-10',
                      time: '14:30:00',
                    },
                    Arrival: {
                      location: 'SVO',
                      date: '2026-03-10',
                      time: '19:30:00',
                    },
                  },
                },
              ],
              PassengerFlight: [
                {
                  passengerTypeCode: 'ADT',
                  FlightProduct: [
                    {
                      classOfService: 'Q',
                      cabin: 'Economy',
                      fareBasisCode: 'QLX05H6R',
                      Brand: {
                        name: 'ECONOMY BASIC',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'product_2',
              FlightSegment: [
                {
                  id: 'FlightSegment_03',
                  sequence: 3,
                  connectionDuration: 'PT2H30M',
                  Flight: {
                    duration: 'PT5H50M',
                    carrier: 'EY',
                    number: '846',
                    equipment: '32A',
                    Departure: {
                      location: 'SVO',
                      date: '2026-03-20',
                      time: '17:40:00',
                    },
                    Arrival: {
                      location: 'AUH',
                      date: '2026-03-21',
                      time: '00:30:00',
                    },
                  },
                },
                {
                  id: 'FlightSegment_04',
                  sequence: 4,
                  Flight: {
                    duration: 'PT4H5M',
                    carrier: 'EY',
                    number: '1012',
                    operatingCarrier: 'QP',
                    operatingCarrierName: 'AKASA AIR',
                    equipment: '7M8',
                    Departure: {
                      location: 'AUH',
                      date: '2026-03-21',
                      time: '03:00:00',
                    },
                    Arrival: {
                      location: 'BLR',
                      date: '2026-03-21',
                      time: '08:45:00',
                    },
                  },
                },
              ],
            },
          ],
          Price: {
            CurrencyCode: { value: 'INR' },
            Base: 107510,
            TotalTaxes: 76367,
            TotalPrice: 183877,
            PriceBreakdown: [
              {
                requestedPassengerType: 'ADT',
                Amount: {
                  Base: 56585,
                  Taxes: { TotalTaxes: 35557 },
                  Total: 92142,
                },
              },
              {
                requestedPassengerType: 'CHD',
                Amount: {
                  Base: 42435,
                  Taxes: { TotalTaxes: 34849 },
                  Total: 77284,
                },
              },
              {
                requestedPassengerType: 'INF',
                Amount: {
                  Base: 8490,
                  Taxes: { TotalTaxes: 5961 },
                  Total: 14451,
                },
              },
            ],
          },
          TermsAndConditionsFull: [
            {
              BaggageAllowance: [{ Text: ['00K'] }],
            },
          ],
        },
      ],
      Traveler: [
        {
          id: 'travelerRefId_1',
          birthDate: '1996-02-09',
          gender: 'Male',
          passengerTypeCode: 'ADT',
          PersonName: {
            Given: 'JOHN MR',
            Surname: 'DOE',
          },
          Telephone: [
            {
              countryAccessCode: '91',
              phoneNumber: '9446111111',
            },
          ],
          Email: [{ value: 'johndoe@gmail.com' }],
          TravelDocument: [
            {
              docNumber: '85696526',
              docType: 'Passport',
              expireDate: '2031-03-13',
              issueCountry: 'IN',
            },
          ],
        },
        {
          id: 'travelerRefId_2',
          birthDate: '2021-02-09',
          gender: 'Male',
          passengerTypeCode: 'CHD',
          PersonName: {
            Given: 'HANEES MSTR',
            Surname: 'BD',
          },
          TravelDocument: [
            {
              docNumber: '856965',
              docType: 'Passport',
              expireDate: '2031-03-13',
            },
          ],
        },
        {
          id: 'travelerRefId_3',
          birthDate: '2025-01-24',
          gender: 'Male',
          passengerTypeCode: 'INF',
          PersonName: {
            Given: 'ALPHA MSTR',
            Surname: 'ACHU',
          },
          TravelDocument: [
            {
              docNumber: '364896',
              docType: 'Passport',
              expireDate: '2033-07-13',
            },
          ],
        },
      ],
      Receipt: [
        {
          Confirmation: {
            Locator: {
              source: '1G',
              creationDate: '2025-11-12',
              value: 'DVTKQC',
            },
          },
        },
        {
          Document: [
            {
              Number: '6072863100488',
              TravelerIdentifierRef: { id: 'travelerRefId_1' },
            },
          ],
        },
        {
          Document: [
            {
              Number: '6072863100489',
              TravelerIdentifierRef: { id: 'travelerRefId_2' },
            },
          ],
        },
        {
          Document: [
            {
              Number: '6072863100490',
              TravelerIdentifierRef: { id: 'travelerRefId_3' },
            },
          ],
        },
      ],
    },
  },
};

const ETicketComponent = () => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  // const [qr, setQR] = useState('');

  // Generate QRCode
  // useEffect(() => {
  //   QRCode.toDataURL('PNR: ABC123', (err: any, url: any) => {
  //     console.log(err);
  //     setQR(url);
  //   });
  // }, []);

  const reservation = apiResponse.ReservationResponse.Reservation;
  const offer = reservation.Offer[0];
  const pnr = reservation.Receipt[0]?.Confirmation?.Locator?.value || 'DVTKQC';
  const creationDate =
    reservation.Receipt[0]?.Confirmation?.Locator?.creationDate || '2025-11-12';

  // Helper functions
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const parseDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) return `${match[1]}h ${match[2]}m`;
    return duration;
  };

  const getAirportName = (code: string) => {
    const airports: Record<string, string> = {
      BLR: 'Bangalore',
      AUH: 'Abu Dhabi',
      SVO: 'Moscow',
      DEL: 'Delhi',
      MOW: 'Moscow',
    };
    return airports[code] || code;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsDownloading(true);

    // Simple HTML to PDF approach using the browser's print capability
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow pop-ups to download the PDF');
      setIsDownloading(false);
      return;
    }

    const ticketHTML = ticketRef.current?.innerHTML || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-Ticket ${pnr}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            padding: 20px;
            background: white;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body>
        ${ticketHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  // Get all flight segments
  const allSegments: any[] = offer.Product.flatMap((p: any) => p.FlightSegment);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Preparing...' : 'Download'}
          </button>
        </div>

        <div ref={ticketRef} className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b-4 border-blue-600 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#BC1110] mb-1">
                  Nixtour
                </h1>
                <p className="text-sm text-gray-600">
                  {formatDate(creationDate)}
                </p>
                <p className="text-lg font-semibold mt-2">
                  E-ticket Itinerary Receipt
                </p>
              </div>
              <div className="flex gap-3">
                {/* QR Code */}
                <div className="bg-gray-50 border-2 border-gray-200 p-2 rounded">
                  {/* <svg
                    width="80"
                    height="80"
                    viewBox="0 0 33 33"
                    className="bg-white"
                  >
                    <rect width="33" height="33" fill="white" />
                    <rect x="0" y="0" width="7" height="7" fill="black" />
                    <rect x="1" y="1" width="5" height="5" fill="white" />
                    <rect x="2" y="2" width="3" height="3" fill="black" />
                    <rect x="26" y="0" width="7" height="7" fill="black" />
                    <rect x="27" y="1" width="5" height="5" fill="white" />
                    <rect x="28" y="2" width="3" height="3" fill="black" />
                    <rect x="0" y="26" width="7" height="7" fill="black" />
                    <rect x="1" y="27" width="5" height="5" fill="white" />
                    <rect x="2" y="28" width="3" height="3" fill="black" />
                    {[8, 10, 12, 14, 16, 18, 20, 22, 24].map((x) => (
                      <rect
                        key={x}
                        x={x}
                        y="6"
                        width="1"
                        height="1"
                        fill="black"
                      />
                    ))}
                    {[8, 10, 12, 14, 16, 18, 20, 22, 24].map((y) => (
                      <rect
                        key={y}
                        x="6"
                        y={y}
                        width="1"
                        height="1"
                        fill="black"
                      />
                    ))}
                  </svg> */}
                  {/* <img src={qr} alt="E-Ticket QR Code" /> */}
                  <QRCode value="DVTKQC-PNR" size={100} />
                </div>
                {/* PNR */}
                <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-gray-200 px-4 py-2 rounded">
                  <p className="text-xs text-gray-600">Booking Reference</p>
                  <p className="text-2xl font-bold tracking-wider">{pnr}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Passengers Section */}
          {reservation.Traveler.map((traveler: any, idx) => {
            const ticketDoc = reservation.Receipt.find((r) =>
              r.Document?.some(
                (d: any) => d.TravelerIdentifierRef?.id === traveler.id
              )
            );
            const ticketNumber = ticketDoc?.Document?.[0]?.Number || 'N/A';
            const priceBreakdown = offer.Price.PriceBreakdown.find(
              (p: any) =>
                p.requestedPassengerType === traveler.passengerTypeCode
            );

            return (
              <div key={traveler.id} className="border-b last:border-b-0">
                {/* Passenger Header */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-bold">
                          {traveler.PersonName.Surname}/
                          {traveler.PersonName.Given}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {traveler.passengerTypeCode === 'ADT'
                          ? 'Adult'
                          : traveler.passengerTypeCode === 'CHD'
                            ? 'Child'
                            : 'Infant'}
                        {' • '}Born: {formatDate(traveler.birthDate)}
                        {' • '}
                        {traveler.gender}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-600">E-Ticket Number</p>
                      <p className="font-mono font-bold">{ticketNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info (only for primary passenger) */}
                {idx === 0 && traveler.Telephone && (
                  <div className="p-4 bg-blue-50 border-b grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>
                        +{traveler.Telephone[0].countryAccessCode}{' '}
                        {traveler.Telephone[0].phoneNumber}
                      </span>
                    </div>
                    {traveler.Email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="break-all">
                          {traveler.Email[0].value}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Passport Info */}
                {traveler.TravelDocument &&
                  traveler.TravelDocument[0]?.docNumber && (
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="grid sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Passport Number</p>
                          <p className="font-semibold">
                            {traveler?.TravelDocument?.[0]?.docNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Issue Country</p>
                          <p className="font-semibold">
                            {traveler?.TravelDocument?.[0]?.issueCountry ||
                              'IN'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expiry Date</p>
                          <p className="font-semibold">
                            {formatDate(
                              traveler?.TravelDocument?.[0]?.expireDate
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Flight Itinerary */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-blue-600" />
                    Flight Itinerary
                  </h3>

                  {allSegments.map((segment, segIdx) => {
                    const flight = segment.Flight;
                    const isConnecting = segIdx < allSegments.length - 1;

                    return (
                      <div key={segment.id} className="mb-6 last:mb-0">
                        {/* Flight Route */}
                        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border mb-3">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">
                                {flight.carrier} {flight.number}
                              </div>
                              <span className="text-sm text-gray-600">
                                {flight.operatingCarrierName || flight.carrier}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {parseDuration(flight.duration)}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Departure */}
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Departure
                              </p>
                              <p className="text-3xl font-bold text-blue-600">
                                {formatTime(flight.Departure.time)}
                              </p>
                              <p className="font-semibold mt-1">
                                {getAirportName(flight.Departure.location)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {flight.Departure.location}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(flight.Departure.date)}
                              </p>
                            </div>

                            {/* Arrival */}
                            <div className="text-right">
                              <p className="text-xs text-gray-600 mb-1">
                                Arrival
                              </p>
                              <p className="text-3xl font-bold text-blue-600">
                                {formatTime(flight.Arrival.time)}
                              </p>
                              <p className="font-semibold mt-1">
                                {getAirportName(flight.Arrival.location)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {flight.Arrival.location}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(flight.Arrival.date)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Flight Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-600 text-xs">Class</p>
                            <p className="font-semibold">
                              {
                                offer?.Product?.[0]?.PassengerFlight?.[0]
                                  ?.FlightProduct?.[0]?.cabin
                              }
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-600 text-xs">Aircraft</p>
                            <p className="font-semibold">{flight?.equipment}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-600 text-xs">Status</p>
                            <p className="font-semibold text-green-600">
                              Confirmed
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-600 text-xs">Baggage</p>
                            <p className="font-semibold">0 KG</p>
                          </div>
                        </div>

                        {/* Connection Info */}
                        {isConnecting && segment.connectionDuration && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                            <p className="font-semibold text-yellow-800">
                              ⏱ Connection Time:{' '}
                              {parseDuration(segment?.connectionDuration)} at{' '}
                              {flight?.Arrival?.location}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Fare Breakdown */}
                {priceBreakdown && (
                  <div className="p-4 bg-gray-50 border-t">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      Fare Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare</span>
                        <span className="font-semibold">
                          INR {priceBreakdown.Amount.Base.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-semibold">
                          INR{' '}
                          {priceBreakdown.Amount.Taxes.TotalTaxes.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t-2 border-blue-600">
                        <span className="font-bold text-lg">Total Amount</span>
                        <span className="font-bold text-lg text-blue-600">
                          INR {priceBreakdown.Amount.Total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Total Price Summary */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <p className="text-sm opacity-90">Total Amount Paid</p>
                <p className="text-xs opacity-75 mt-1">
                  Base: INR {offer.Price.Base.toLocaleString()} + Taxes: INR{' '}
                  {offer.Price.TotalTaxes.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">
                  INR {offer.Price.TotalPrice.toLocaleString()}
                </p>
                <p className="text-sm opacity-90">
                  for {reservation.Traveler.length} passenger(s)
                </p>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="p-6 bg-gray-50 border-t">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Important Information
            </h3>
            <div className="text-xs text-gray-700 space-y-2">
              <p>
                • Please arrive at the airport at least 3 hours before
                international departure.
              </p>
              <p>
                • Valid passport and visa (if required) must be presented at
                check-in.
              </p>
              <p>
                • Check-in opens 24 hours and closes 60 minutes before
                departure.
              </p>
              <p>
                • Baggage allowance is per passenger as mentioned in the
                itinerary.
              </p>
              <p>
                • This is an electronic ticket. Please keep this receipt for
                your records.
              </p>
              <p>• Fare rules: NON ENDORSABLE / NON REFUNDABLE</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-100 text-center text-xs text-gray-600">
            <p>
              For support and inquiries, please contact Etihad Airways customer
              service
            </p>
            <p className="mt-1">Thank you for choosing Etihad Airways</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; background: white; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ETicketComponent;
