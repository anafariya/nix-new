import axios from 'axios';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Navbar } from '../../components/navbar/navbar';
import PassengerForm from '../../components/passenger-form'; // default export in updated PassengerForm
import { Label } from '@radix-ui/react-label';
import { Input } from 'antd';
import { Card, CardContent } from '../../components/ui/card';
import {
  Armchair,
  Backpack,
  Briefcase,
  CalendarCheck,
  CalendarX2,
  Info,
  Luggage,
  Percent,
  TicketPercent,
  Utensils,
} from 'lucide-react';
import Footer from '../../components/footer/footer';
import { TripSummary } from '../../components/trip-summary';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';
// import { PassengerDialog } from '../../components/travelers-details-dialog';
import dayjs from 'dayjs';
import { SeatSelectionDialog } from '../../components/seat-selection';
import {
  addOffersToWorkbench,
  addTravelersToWorkbench,
  // commitToWorkbench,
  createWorkbench,
  // postCommitToWorkbench,
} from '../../components/helpers';
// import SeatMapDemo from '../../components/seat-selection/seat-selection-ui';
import { useNavigate } from 'react-router-dom';
import { PaymentConfirmationModal } from '../../components/travelers-details-dialog/flight-payment-confirmation';
// import dayjs from 'dayjs';

export const BookFlight = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [extraPrice, setExtraPrice] = useState({
    seatPrice: 0,
    mealPrice: 0,
    extraLuggage: 0,
  });

  const [warnings, setWarnings] = useState([]);

  const [workbenchID, setWorkbenchID] = useState('');
  const [passengersList, setPassengersList] = useState<
    {
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
    }[]
  >([]);
  const [contactDetail, setContactDetail] = useState({
    name: '',
    number: '',
    email: '',
  });

  // Seat Selection Dialog
  const [openSeatMap, setOpenSeatMap] = useState<boolean>(false);

  const [gdsOrNdcResponse, setGDSOrNDCResponse] = useState<any>(null);
  // Ref to prevent overlapping runs of the scheduled job
  const isRunningRef = useRef(false);
  const [offerCreationFailed, setOfferCreationFailed] = useState(false);

  const navigate = useNavigate();
  // const [loading, setLoading] = useState<boolean>(false);
  const [pnrModal, setPnrModal] = useState<{
    open: boolean;
    data: any[];
    message?: string;
  }>({ open: false, data: [], message: '' });

  const state: { workbench_id: string } = { workbench_id: '' };

  // Suppose current URL is: https://example.com/page?name=John&age=30
  const fields = useMemo(
    () => new URL(window.location.href),
    [window.location.href]
  );

  let data: {
    if?: string | null;
    pid1?: string | null;
    cid1?: string | null;
    pr?: string | null;
    pid2?: string | null;
    cid2?: string | null;
    pid?: string | null;
    cid?: string | null;
  } = {};

  if (sessionStorage.getItem('tripType') === 'round-trip') {
    data = {
      if: fields?.searchParams?.get('if'),
      pid1: fields?.searchParams?.get('pid1'),
      cid1: fields?.searchParams?.get('cid1'),
      pr: fields?.searchParams?.get('pr'),
      pid2: fields?.searchParams?.get('pid2'),
      cid2: fields?.searchParams?.get('cid2'),
    };
  } else {
    data = {
      if: fields?.searchParams?.get('if'),
      pid1: fields?.searchParams?.get('pid'),
      cid1: fields?.searchParams?.get('cid'),
      pr: fields?.searchParams?.get('pr'),
    };
  }

  // // parse fields only once
  // const data: Record<string, string> = {};
  // fields?.split('&')?.forEach((a: any) => {
  //   const [key, value] = a.split('=');
  //   if (key) data[key] = value;
  // });

  // let offer: any = null;
  // let product: any = null;
  // let segmentFirst: any = null;
  // let segmentLast: any = null;
  // let passengerFlights: any = null;

  const travelers = JSON.parse(sessionStorage.getItem('travelers') || '');

  let adults = 0,
    children = 0,
    infants = 0;

  let onwardDate: any = sessionStorage.getItem('onwardDate') || null; // "2025-11-12"
  const returnDate: any = sessionStorage.getItem('returnDate') || null;
  let fromAirportCode: string = sessionStorage.getItem('fromAirportCode') || ''; // "BOM"
  let toAirportCode: string = sessionStorage.getItem('toAirportCode') || ''; // "BLR"

  let travelClass: string = ''; // "Economy"

  // fetch flight details and populate passengersList
  const getFlightDetails = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);

    let passengersDetails: typeof passengersList = [];

    const qty =
      Number(travelers.adults + travelers.children + travelers.infants) || 1;
    for (let i = 0; i < qty; i++) {
      passengersDetails.push({
        id: `${'P'}-${i}-${i}`,
        type: 'P',
        // pf?.passengerTypeCode === 'ADT' && idx !== 0
        //   ? 'CNN'
        //   : (pf?.passengerTypeCode ?? 'ADT'),
        title: '',
        first_name: '',
        last_name: '',
        dob: null,
        passport_number: '',
        passport_expiry: null,
        nationality: '',
        issuing_country: '',
        seatId: '',
      });
    }

    setPassengersList(passengersDetails);

    try {
      let parameters = {
        OfferQueryBuildFromCatalogProductOfferings: {
          BuildFromCatalogProductOfferingsRequestAir: {
            '@type': 'BuildFromCatalogProductOfferingsRequestAir',
            CatalogProductOfferingsIdentifier: {
              Identifier: {
                value: data?.if || fields.searchParams?.get('if') || '',
              },
            },
            CatalogProductOfferingSelection: [
              {
                CatalogProductOfferingIdentifier: {
                  Identifier: {
                    value: data?.cid || fields.searchParams?.get('cid') || 'o1',
                  },
                },
                ProductIdentifier: [
                  {
                    Identifier: {
                      value:
                        data?.pid || fields.searchParams?.get('pid') || 'p0',
                    },
                  },
                ],
              },
            ],
          },
        },
      };

      if (sessionStorage.getItem('tripType') === 'round-trip') {
        parameters = {
          OfferQueryBuildFromCatalogProductOfferings: {
            BuildFromCatalogProductOfferingsRequestAir: {
              '@type': 'BuildFromCatalogProductOfferingsRequestAir',
              CatalogProductOfferingsIdentifier: {
                Identifier: {
                  value: data?.if || fields.searchParams?.get('if') || '',
                },
              },
              CatalogProductOfferingSelection: [
                {
                  CatalogProductOfferingIdentifier: {
                    Identifier: {
                      value:
                        data?.cid1 || fields.searchParams?.get('cid1') || 'o1',
                    },
                  },
                  ProductIdentifier: [
                    {
                      Identifier: {
                        value:
                          data?.pid1 ||
                          fields.searchParams?.get('pid1') ||
                          'p0',
                      },
                    },
                  ],
                },
                {
                  CatalogProductOfferingIdentifier: {
                    Identifier: {
                      value:
                        data?.cid2 || fields.searchParams?.get('cid2') || 'o2',
                    },
                  },
                  ProductIdentifier: [
                    {
                      Identifier: {
                        value:
                          data?.pid2 ||
                          fields.searchParams?.get('pid2') ||
                          'p8',
                      },
                    },
                  ],
                },
              ],
            },
          },
        };
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/travelport/price`,
        parameters,
        {
          headers: { 'Content-Type': 'application/json' },
          signal,
        }
      );

      console.log('Air Price Parameters', parameters);

      console.log('Fetch Offer', response.data);

      setFlightDetails(response.data);

      // Build passengers list based on response (deterministic)
      passengersDetails = [];
      response?.data?.OfferListResponse?.OfferID?.[0]?.Product?.[0]?.PassengerFlight?.forEach(
        (pf: any, idx: number) => {
          const qty = Number(pf?.passengerQuantity || 1);
          for (let i = 0; i < qty; i++) {
            passengersDetails.push({
              id: `${pf?.passengerTypeCode ?? 'P'}-${idx}-${i}`,
              type: pf?.passengerTypeCode,
              // pf?.passengerTypeCode === 'ADT' && idx !== 0
              //   ? 'CNN'
              //   : (pf?.passengerTypeCode ?? 'ADT'),
              title: '',
              first_name: '',
              last_name: '',
              dob: null,
              passport_number: '',
              passport_expiry: null,
              nationality: '',
              issuing_country: '',
              seatId: '',
            });

            // if (pf?.passengerTypeCode === 'ADT' && idx !== 0) children += 1;
            if (
              pf?.passengerTypeCode === 'CNN' ||
              pf?.passengerTypeCode === 'CHD'
            )
              children += 1;
            else if (pf?.passengerTypeCode === 'ADT') adults += 1;
            else infants += 1;
          }
        }
      );

      // // Assuming `response` is your OfferListResponse JSON object
      // offer = response.data?.OfferListResponse?.OfferID?.[0];
      // product = offer?.Product?.[0];
      // segmentFirst = product?.FlightSegment?.[0]?.Flight;
      // segmentLast =
      //   product?.FlightSegment?.[product?.FlightSegment?.length - 1]?.Flight;
      // passengerFlights = product?.PassengerFlight;

      // // ✅ Extract flight info
      // onwardDate = segmentFirst?.Departure?.date; // "2025-11-12"
      // fromAirportCode = segmentFirst?.Departure?.location; // "BOM"
      // toAirportCode = segmentLast?.Arrival?.location; // "BLR"

      // // ✅ Extract travel class (cabin)
      // travelClass = passengerFlights?.[0]?.FlightProduct?.[0]?.cabin; // "Economy"

      setPassengersList(passengersDetails);
      setPnrModal({ open: false, data: [], message: '' });
      setWarnings([]);
      setContactDetail({ name: '', email: '', number: '' });
    } catch (err: any) {
      if (axios.isCancel(err)) {
        // request cancelled
      } else {
        console.error('Fetch Offer Error', err);
        setError(err?.message || 'Failed to fetch flight details');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, []);

  // useEffect: fetch on mount or when params change
  useEffect(() => {
    const controller = new AbortController();
    getFlightDetails(controller.signal);
    return () => controller.abort();
  }, [getFlightDetails, window.location.href]);

  // Determine if seat data is available in the response
  const seatDataAvailable = (() => {
    if (!gdsOrNdcResponse) return false;
    const anc = gdsOrNdcResponse?.CatalogOfferingsAncillaryListResponse;
    const seatMapResp =
      gdsOrNdcResponse?.CatalogOfferingsSeatMapResponse ||
      gdsOrNdcResponse?.CatalogOfferingsAncillaryListResponse?.SeatMap;

    // If the ancillary response contains an error, treat as unavailable
    if (
      anc?.Result?.Error &&
      Array.isArray(anc.Result.Error) &&
      anc.Result.Error.length > 0 &&
      anc?.Identifier?.value === undefined
    )
      if (!anc?.Result?.Error?.[0]?.Message?.toUpperCase()?.includes('RETRY'))
        return false;

    // If there's an identifier for ancillaries or a seatmap object, we consider seats available
    if (anc?.Identifier?.value) return true;
    if (seatMapResp && Object.keys(seatMapResp).length > 0) return true;

    // Fallback: any non-empty top-level response likely contains useful data
    return Object.keys(gdsOrNdcResponse).length > 0;
  })();

  // Auto-close seat dialog if data becomes unavailable or an error modal opens
  useEffect(() => {
    if (openSeatMap && seatDataAvailable && !isErrorModalOpen) {
      setOpenSeatMap(true);
    } else setOpenSeatMap(false);

    if (isErrorModalOpen) {
      setOpenSeatMap(false);
      setOpen(false);
      setPnrModal({ ...pnrModal, open: false });
    }
  }, [openSeatMap, seatDataAvailable, isErrorModalOpen]);

  // Set up scheduled job
  useEffect(() => {
    // Run the identifier + workbench creation job immediately on mount (or when `fields` changes),
    // then repeat every 15 minutes. Use a ref to avoid overlapping runs.
    let mounted = true;

    const performJob = async () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      try {
        console.log('Scheduled job: checking prerequisites...');

        // Ensure flight details and search pieces are available before fetching identifier.
        if (!flightDetails) {
          console.log('Skipping identifier fetch: flightDetails not ready');
          return;
        }

        if (offerCreationFailed) {
          console.log(
            'Previous offer creation failed - skipping further offer attempts'
          );
          return;
        }

        // Creating Workbench
        const res = await createWorkbench({ ReservationID: {} });
        if (!res) {
          console.error('createWorkbench returned null or failed');
          return;
        }

        const workbench_id =
          res?.ReservationResponse?.Reservation?.Identifier?.value;

        if (!workbench_id) {
          console.error('Workbench id missing in response', res);
          return;
        }

        state.workbench_id = workbench_id;

        console.log('Workbench Id', workbench_id);

        if (mounted) setWorkbenchID(workbench_id);

        // Multiple Offers to Workbench
        if (sessionStorage.getItem('tripType') === 'round-trip') {
          // Return Trip
          const params = {
            OfferQueryBuildFromCatalogProductOfferings: {
              BuildFromCatalogProductOfferingsRequest: {
                '@type': 'BuildFromCatalogProductOfferingsRequestAir',
                CatalogProductOfferingsIdentifier: {
                  Identifier: {
                    value: data?.if || fields.searchParams.get('if') || '',
                  },
                },
                CatalogProductOfferingSelection: [
                  {
                    CatalogProductOfferingIdentifier: {
                      Identifier: {
                        value:
                          data?.cid1 || fields.searchParams.get('cid1') || '',
                      },
                    },
                    ProductIdentifier: [
                      {
                        Identifier: {
                          value:
                            data?.pid1 || fields.searchParams.get('pid1') || '',
                        },
                      },
                    ],
                  },
                  {
                    CatalogProductOfferingIdentifier: {
                      Identifier: {
                        value:
                          data?.cid2 || fields.searchParams.get('cid2') || '',
                      },
                    },
                    ProductIdentifier: [
                      {
                        Identifier: {
                          value:
                            data?.pid2 || fields.searchParams.get('pid2') || '',
                        },
                      },
                    ],
                  },
                ],
              },
            },
          };

          await addOffers(params, workbench_id);
        } else {
          // One Way Trip
          const params = {
            OfferQueryBuildFromCatalogProductOfferings: {
              BuildFromCatalogProductOfferingsRequestAir: {
                '@type': 'BuildFromCatalogProductOfferingsRequestAir',
                CatalogProductOfferingsIdentifier: {
                  Identifier: {
                    value: data?.if || fields.searchParams.get('if'),
                  },
                },
                CatalogProductOfferingSelection: [
                  {
                    CatalogProductOfferingIdentifier: {
                      Identifier: {
                        value: data?.cid || fields.searchParams.get('cid'),
                      },
                    },
                    ProductIdentifier: [
                      {
                        Identifier: {
                          value: data?.pid || fields.searchParams.get('pid'),
                        },
                      },
                    ],
                  },
                ],
              },
            },
          };

          await addOffers(params, workbench_id);
        }
      } catch (err) {
        console.error('Scheduled identifier/workbench job failed', err);
      } finally {
        isRunningRef.current = false;
      }
    };

    // Run immediately (if prerequisites met) and schedule to run every 15 minutes
    performJob();

    const intervalId = setInterval(
      () => {
        console.log('Fetching Identifier...');
        fetchIdentifier().then((res) => {
          console.log(res);
          performJob();
        });
      },
      15 * 60 * 1000
    );

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [fields, flightDetails]);

  // Add Offers
  async function addOffers(params: any, workbench_id: string = workbenchID) {
    try {
      // Retry loop for offer creation: on temporary/GDS communication errors
      // keep trying until we get an identifier or a non-retryable error.
      const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
      const maxOfferRetries = 12; // safety cap to avoid infinite looping in one run
      let offerAttempt = 0;
      let offerIdentifier: string | null = null;

      while (offerAttempt < maxOfferRetries) {
        offerAttempt += 1;
        try {
          const offerRes = await addOffersToWorkbench({
            workbench_id,
            params,
          });

          // Inspect any errors reported in OfferListResponse
          const errors = offerRes?.OfferListResponse?.Result?.Error || null;

          if (errors && Array.isArray(errors) && errors.length > 0) {
            const messages = errors
              .map((e: any) => e?.Message || JSON.stringify(e))
              .join('\n');

            const isTemporary = errors.some((e: any) => {
              const cat = (e?.category || '')?.toString()?.toUpperCase();
              const msg = (e?.Message || '')?.toString()?.toUpperCase();
              return (
                cat === 'TEMPORARY' ||
                msg.includes('RETRY') ||
                e?.SourceCode === '2599'
              );
            });

            console.warn(
              `Offer creation attempt ${offerAttempt} returned errors (temporary=${isTemporary}):`,
              messages,
              offerRes
            );

            if (isTemporary) {
              // temporary error -> retry with backoff (capped)
              const backoff = Math.min(30000, 500 * Math.pow(2, offerAttempt));
              console.log(
                `Temporary offer error, retrying in ${backoff}ms (attempt ${offerAttempt}/${maxOfferRetries})`
              );
              await sleep(backoff);
              continue; // try again
            }

            // Non-retryable error: surface to user and mark as failed
            setError(messages || 'Offer creation failed');
            setIsErrorModalOpen(true);
            setOfferCreationFailed(true);
            return;
          }

          // No errors -> try to read identifier
          offerIdentifier =
            offerRes?.OfferListResponse?.OfferID?.[0]?.Identifier?.value ||
            null;

          if (offerIdentifier) {
            console.log('Created offer identifier:', offerIdentifier);
            break; // success
          }

          // No errors but also no identifier: treat as transient and retry
          console.warn(
            `Offer creation attempt ${offerAttempt} returned no identifier, retrying...`,
            offerRes
          );
          const backoff = Math.min(30000, 500 * offerAttempt);
          await sleep(backoff);
          continue;
        } catch (err: any) {
          console.error('addOffersToWorkbench attempt failed', err);
          const status = err?.response?.status;
          // Retry on 5xx server errors
          if (status && status >= 500 && status < 600) {
            const backoff = Math.min(30000, 500 * offerAttempt);
            console.log(
              `Server error, retrying addOffersToWorkbench in ${backoff}ms (attempt ${offerAttempt}/${maxOfferRetries})`
            );
            await sleep(backoff);
            continue;
          }

          // Unknown/network error -> surface and stop trying this run
          setError(err?.message || 'Offer creation failed');
          setIsErrorModalOpen(true);
          // mark as failed so we don't aggressively retry repeatedly in this session
          setOfferCreationFailed(true);
          return;
        }
      }

      if (!offerIdentifier) {
        // We exhausted attempts without a definitive non-retryable error.
        // Do not mark as permanently failed so the interval job can retry later.
        console.warn(
          'Offer creation did not yield an identifier after retries; will try again on next scheduled run.'
        );
        return;
      }
    } catch (err) {
      console.error('addOffersToWorkbench failed', err);
    }
  }

  // Handle Continue
  async function handleContinue() {
    const passengersFirstName: any[] = [];
    const passengersPassportNumber: any[] = [];

    for (let i = 0; i < passengersList.length; i++) {
      const p = passengersList[i];

      if (passengersFirstName.includes(p.first_name)) {
        setError(`Duplicate First Name of Passenger ${i + 1} - [ ${p.type} ]`);
        // alert(`Duplicate First Name ${i + 1}`);
        await checkValidPassenger();
        return;
      } else passengersFirstName.push(p.first_name);

      if (data?.pr && data?.pr != 'false') {
        if (passengersPassportNumber.includes(p.passport_number)) {
          setError(
            `Duplicate Passport Number of Passenger ${i + 1} - [ ${p.type} ]`
          );
          // alert(`Duplicate Passport Number ${i + 1}`);
          await checkValidPassenger();
          return;
        } else passengersPassportNumber.push(p.passport_number);
      }
    }

    if (pnrModal.data.length) return setPnrModal({ ...pnrModal, open: true });

    const workbench_id = workbenchID;

    setPnrModal({
      open: true && !isErrorModalOpen,
      data: [],
      message: 'Processing your booking, please wait...',
    });

    if (!workbench_id) {
      console.error('No workbench_id available. Cannot continue booking.');
      setError('Internal error: workbench is not initialized.');
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      // Add travelers sequentially to avoid server 'previous transaction in progress' errors.
      const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
      const maxRetries = 3;

      for (let index = 0; index < passengersList.length; index++) {
        const passenger = passengersList[index];
        const gender = ['m', 'mr', 'mstr', 'male'].includes(
          (passenger?.title || '').toLowerCase()
        )
          ? 'Male'
          : 'Female';

        let travelerParams: any = {
          '@type': 'Traveler',
          gender: gender,
          id: passenger?.id,
          passengerTypeCode: passenger?.type,
          Telephone: [
            {
              '@type': 'Telephone',
              countryAccessCode: '91',
              phoneNumber: contactDetail?.number,
              role: 'Mobile',
              id: index,
            },
          ],
          birthDate: dayjs(passenger?.dob).format('YYYY-MM-DD'),
          PersonName: {
            '@type': 'PersonNameDetail',
            Prefix: passenger?.title.toUpperCase(),
            Given: passenger?.first_name,
            Surname: passenger?.last_name,
          },
          Email: [
            {
              value: contactDetail?.email,
            },
          ],
        };

        if (data?.pr != undefined && data?.pr) {
          travelerParams = {
            '@type': 'Traveler',
            gender: gender,
            id: passenger?.id,
            passengerTypeCode: passenger?.type,
            Telephone: [
              {
                '@type': 'Telephone',
                countryAccessCode: '91',
                phoneNumber: contactDetail?.number,
                role: 'Mobile',
                id: index,
              },
            ],
            birthDate: passenger?.dob,
            PersonName: {
              '@type': 'PersonNameDetail',
              Prefix: passenger?.title.toUpperCase(),
              Given: passenger?.first_name,
              Surname: passenger?.last_name,
            },
            Email: [
              {
                value: contactDetail?.email,
              },
            ],
            TravelDocument: [
              {
                '@type': 'TravelDocument',
                docType: 'Passport',
                docNumber: passenger?.passport_number,
                expireDate: dayjs(passenger?.passport_expiry).format(
                  'YYYY-MM-DD'
                ),
                // "issueDate": dayjs(passenger?.passport_issue).format('YYYY-MM-DD'),
                issueCountry: passenger?.issuing_country.toUpperCase(),
                birthDate: dayjs(passenger?.dob).format('YYYY-MM-DD'),
                // "birthCountry": passenger?.issuing_country.toUpperCase(),
                Gender: 'Male',
                PersonName: {
                  '@type': 'PersonName',
                  Prefix: passenger?.title.toUpperCase(),
                  Given: passenger?.first_name,
                  Surname: passenger?.last_name,
                },
              },
            ],
          };
        }

        console.log('Traveler Params:', travelerParams);

        let attempt = 0;
        while (attempt <= maxRetries) {
          attempt += 1;
          try {
            const res = await addTravelersToWorkbench({
              workbench_id,
              params: travelerParams,
            });

            // If API returns an error structure, inspect it
            const errors =
              res?.TravelerResponse?.Result?.Error ||
              res?.Result?.Error ||
              res?.OfferListResponse?.Result?.Error;

            if (errors && Array.isArray(errors) && errors.length > 0) {
              const msg = errors
                .map((e: any) => e?.Message || JSON.stringify(e))
                .join('\n');
              console.warn(
                'addTravelersToWorkbench returned errors:',
                msg,
                res
              );

              // If error indicates previous transaction in progress, retry with backoff
              const isPrevTxnError = errors.some(
                (e: any) =>
                  (e?.Message || '')
                    .toUpperCase()
                    .includes('PREVIOUS TRANSACTION') ||
                  e?.SourceCode === '4423'
              );

              if (isPrevTxnError && attempt <= maxRetries) {
                const backoff = 300 * attempt; // ms
                console.log(
                  `Retrying add traveler (attempt ${attempt}) after ${backoff}ms`
                );
                await sleep(backoff);
                continue;
              }

              // Non-retryable error: throw to abort booking
              throw new Error(msg || 'Failed to add traveler');
            }

            // Successful addition (break retry loop)
            break;
          } catch (err: any) {
            // If it's the last attempt, rethrow
            if (attempt > maxRetries) {
              console.error(
                'Failed to add traveler after retries',
                passenger,
                err
              );
              throw err;
            }

            // For network/server errors (5xx), do a short backoff and retry
            const status = err?.response?.status;
            if (
              (status && status >= 500 && status < 600) ||
              (err?.message && err?.message.includes('PREVIOUS TRANSACTION'))
            ) {
              const backoff = 300 * attempt;
              console.log(
                `Transient error, retrying add traveler (attempt ${attempt}) after ${backoff}ms`
              );
              await sleep(backoff);
              continue;
            }

            // Otherwise, not retryable
            throw err;
          }
        }
      }

      // setPnrModal({
      //   open: true,
      //   data: [],
      //   message: 'Payment!',
      // });

      // const commitParams = {
      //   '@type': 'ReservationQueryCommitReservation',
      //   ReservationQueryCommitReservation: {
      //     scheduleChangeAcceptedInd: true,
      //   },
      // };

      // // const commitParams = {
      // //   ReservationQueryCommitReservation: {
      // //     enableTwoStepCommitInd: true,
      // //     overrideMCTInd: false,
      // //     errorWhenScheduleChangesInd: true,
      // //     errorWhenOfferPriceChangesInd: true,
      // //   },
      // // };

      // const commitRes = await commitToWorkbench({
      //   workbench_id,
      //   params: commitParams,
      // });

      // if (commitRes != null) {
      //   const locator =
      //     commitRes?.ReservationResponse?.Reservation?.Receipt?.[0]
      //       ?.Confirmation?.Locator?.value;

      //   const warnings = commitRes?.ReservationResponse?.Result?.Warning;

      //   setWarnings(warnings);

      //   if (locator) {
      //     try {
      //       const finalRes = await postCommitToWorkbench({
      //         locator,
      //         params: {},
      //       });
      //       console.log('Final Res', finalRes);

      //       setPnrModal({
      //         open: true,
      //         data: finalRes?.ReservationResponse?.Reservation?.Receipt,
      //         message: 'Here is your booking confirmation!',
      //       });
      //       // Optionally handle success (navigate to confirmation page, etc.)
      //     } catch (err) {
      //       console.error('postCommitToWorkbench failed', err);
      //       setError(
      //         'Booking succeeded but finalization failed. Please contact support.'
      //       );
      //       setIsErrorModalOpen(true);
      //     }
      //   } else {
      //     console.error('Commit succeeded but locator missing', commitRes);
      //     setError('Booking failed to return a locator.');
      //     setIsErrorModalOpen(true);
      //   }
      // } else {
      //   console.error('commitToWorkbench returned null');
      //   setError('Failed to commit booking.');
      //   setIsErrorModalOpen(true);
      // }
    } catch (err: any) {
      console.error('handleContinue error', err);
      setError(err?.message || 'Failed to add travelers or commit booking');
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      navigate('/payment-confirmation', {
        state: {
          workbench_id: state.workbench_id || workbenchID,
        },
      });
    }, 2100);

    return true;
  }

  // Fetch seats id available
  async function fetchSeats() {
    let parameters = {
      CatalogOfferingsQuerySeatAvailability: {
        SeatAvailabilityOfferings: {
          '@type': 'SeatAvailabilityOfferingsBuildFromCatalogProductOfferings',
          BuildFromCatalogProductOfferingsRequest: {
            '@type': 'BuildFromCatalogProductOfferingsRequest',
            CatalogProductOfferingsIdentifier: {
              id: 'catalogProductOfferings_1',
              Identifier: {
                value: data?.if || fields.searchParams.get('if') || '',
                authority: 'Travelport',
              },
            },
            CatalogProductOfferingSelection: [
              {
                '@type': 'CatalogProductOfferingSelection',
                CatalogProductOfferingIdentifier: {
                  id: data?.cid || fields.searchParams.get('cid') || '',
                },
                ProductIdentifier: [
                  {
                    id: data?.pid || fields.searchParams.get('pid') || '',
                  },
                ],
              },
            ],
          },
        },
      },
    };

    if (sessionStorage.getItem('tripType') === 'round-trip') {
      parameters = {
        CatalogOfferingsQuerySeatAvailability: {
          SeatAvailabilityOfferings: {
            '@type':
              'SeatAvailabilityOfferingsBuildFromCatalogProductOfferings',
            BuildFromCatalogProductOfferingsRequest: {
              '@type': 'BuildFromCatalogProductOfferingsRequest',
              CatalogProductOfferingsIdentifier: {
                id: 'catalogProductOfferings_1',
                Identifier: {
                  value: data?.if || fields.searchParams.get('if') || '',
                  authority: 'Travelport',
                },
              },
              CatalogProductOfferingSelection: [
                {
                  '@type': 'CatalogProductOfferingSelection',
                  CatalogProductOfferingIdentifier: {
                    id: data?.cid1 || fields.searchParams.get('cid1') || '',
                  },
                  ProductIdentifier: [
                    {
                      id: data?.pid1 || fields.searchParams.get('pid1') || '',
                    },
                  ],
                },
                {
                  '@type': 'CatalogProductOfferingSelection',
                  CatalogProductOfferingIdentifier: {
                    id: data?.cid2 || fields.searchParams.get('cid2') || '',
                  },
                  ProductIdentifier: [
                    {
                      id: data?.pid2 || fields.searchParams.get('pid2') || '',
                    },
                  ],
                },
              ],
            },
          },
        },
      };
    }

    console.log('Fetch Seat Parameters:', parameters);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/travelport/seat`,
        parameters,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.data) {
        setGDSOrNDCResponse(res.data);
        console.log('SeatMap Response:', res.data);
        return res.data;
      }
    } catch (error) {
      console.log('SeatMap Error', error);
      setOpenSeatMap(false);
      return null;
    }
    // setLoading(false);
  }

  // Fetch identifier(runs after every 15 minutes)
  const fetchIdentifier = async () => {
    let parameters = {
      '@type': 'CatalogProductOfferingsQueryRequest',
      CatalogProductOfferingsRequest: {
        '@type': 'CatalogProductOfferingsRequestAir',
        offersPerPage: 1000,
        maxNumberOfUpsellsToReturn: 4,
        contentSourceList: ['GDS'],
        PassengerCriteria: [
          {
            number: travelers.adults || 1,
            passengerTypeCode: 'ADT',
          },
          {
            number: travelers.children,
            passengerTypeCode: 'CHD',
          },
          {
            number: travelers.infants,
            passengerTypeCode: 'INF',
          },
        ],
        SearchCriteriaFlight: [
          {
            '@type': 'SearchCriteriaFlight',
            From: {
              value: fromAirportCode,
            },
            To: {
              value: toAirportCode,
            },
            departureDate: onwardDate.format('YYYY-MM-DD'),
          },
        ],
        SearchModifiersAir: {
          '@type': 'SearchModifiersAir',
          CabinPreference: {
            cabins: travelClass.replace(' ', ''),
            preferenceType: 'Permitted',
          },
        },
        PricingModifiersAir: {
          '@type': 'PricingModifiersAir',
          FareSelection: {
            fareType: 'PublicAndPrivateFares',
            '@type': 'FareSelection',
          },
          CustomResponseModifiersAir: {
            '@type': 'CustomResponseModifiersAir',
            SearchRepresentation: 'Journey',
          },
        },
      },
    };

    if (sessionStorage.getItem('tripType') === 'round-trip') {
      parameters = {
        '@type': 'CatalogProductOfferingsQueryRequest',
        CatalogProductOfferingsRequest: {
          '@type': 'CatalogProductOfferingsRequestAir',
          offersPerPage: 1000,
          maxNumberOfUpsellsToReturn: 4,
          contentSourceList: ['GDS'],
          PassengerCriteria: [
            {
              number: travelers.adults || 1,
              passengerTypeCode: 'ADT',
            },
            {
              number: travelers.children,
              passengerTypeCode: 'CHD',
            },
            {
              number: travelers.infants,
              passengerTypeCode: 'INF',
            },
          ],
          SearchCriteriaFlight: [
            {
              '@type': 'SearchCriteriaFlight',
              From: {
                value: fromAirportCode,
              },
              To: {
                value: toAirportCode,
              },
              departureDate: onwardDate.format('YYYY-MM-DD'),
            },
            {
              '@type': 'SearchCriteriaFlight',
              From: {
                value: toAirportCode,
              },
              To: {
                value: fromAirportCode,
              },
              departureDate: returnDate.format('YYYY-MM-DD'),
            },
          ],
          SearchModifiersAir: {
            '@type': 'SearchModifiersAir',
            CabinPreference: {
              cabins: travelClass.replace(' ', ''),
              preferenceType: 'Permitted',
            },
          },
          PricingModifiersAir: {
            '@type': 'PricingModifiersAir',
            FareSelection: {
              fareType: 'PublicAndPrivateFares',
              '@type': 'FareSelection',
            },
            CustomResponseModifiersAir: {
              '@type': 'CustomResponseModifiersAir',
              SearchRepresentation: 'Journey',
            },
          },
        },
      };
    }

    await axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/api/travelport/search`,
        parameters,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        const identifier =
          response?.data?.CatalogProductOfferingsResponse
            ?.CatalogProductOfferings?.Identifier?.value;

        if (sessionStorage.getItem('tripType') === 'round-trip' && identifier) {
          window.location.href = `/flight-booking?if=${identifier}&pid1=${data?.pid1 || fields?.searchParams?.get('pid1')}&cid1=${data?.cid1 || fields?.searchParams?.get('cid1')}&pid2=${data?.pid2 || fields?.searchParams?.get('pid2')}&cid2=${data?.cid2 || fields?.searchParams?.get('cid2')}&pr=${data?.pr}`;
        } else if (identifier) {
          window.location.href = `/flight-booking?if=${identifier}&pid=${data?.pid || fields?.searchParams?.get('pid')}&cid=${data?.cid || fields?.searchParams?.get('cid')}&pr=${data?.pr}`;
        }
      })
      .catch((error) => console.error('Refreshing Identifier Error:', error));
  };

  // handle passenger updates (immutable update)
  const handlePassengerChange = useCallback(
    (index: number, patch: Partial<any>) => {
      setPassengersList((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], ...patch };
        return next;
      });
    },
    []
  );

  // Check Naming Validity of Passengers according to Airline
  async function checkValidPassenger() {
    const airlineID =
      flightDetails?.OfferListResponse?.OfferID?.[0]?.Product?.[0]
        ?.FlightSegment?.[0]?.Flight?.operatingCarrier ||
      flightDetails?.OfferListResponse?.OfferID?.[0]?.Product?.[0]
        ?.FlightSegment?.[0]?.Flight?.carrier;

    const airlineName =
      flightDetails?.OfferListResponse?.OfferID?.[0]?.Product?.[0]
        ?.FlightSegment?.[0]?.Flight?.operatingCarrierName;

    try {
      const res = await axios.get(
        `https://api.nixtour.com/api/Web/AirlineMissingNameFormat?IATACode=${airlineID}`
      );

      if (res?.data?.Success && res?.data?.StatusCode === 200) {
        const { FirstNameColumn, LastNameColumn, AirlineName } =
          res.data.Data || {};
        const resolvedAirline = airlineName || AirlineName || 'this airline';

        if (FirstNameColumn && LastNameColumn)
          setError(
            (prev) =>
              `${prev ? prev + '\n\n' : ''}Name Format Required for "${resolvedAirline}"\n` +
              `• First Name: ${FirstNameColumn}\n` +
              `• Last Name: ${LastNameColumn}`
          );

        setIsErrorModalOpen(true);
      }
    } catch (err: any) {
      console.error('Name format validation error:', err);
      setError(
        err?.message ||
          err?.response?.data?.message ||
          'Passenger name validation failed. Please try again.'
      );
      setIsErrorModalOpen(true);
    }
  }

  // Next Function
  async function handleNext() {
    // Basic validation
    if (
      !contactDetail.name.trim() ||
      contactDetail.name.trim().length < 3 ||
      !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(contactDetail.name.trim())
    ) {
      setError('Invalid Contact Name');
      // alert('Invalid Contact Name');
      setIsErrorModalOpen(true);
      return;
    }
    if (!contactDetail.number || contactDetail.number.length < 10) {
      setError('Invalid Contact Number');
      // alert('Invalid Contact Number');
      setIsErrorModalOpen(true);

      return;
    }
    if (
      !contactDetail.email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        contactDetail.email
      )
    ) {
      setError('Invalid Contact Email');
      // alert('Invalid Contact Email');
      setIsErrorModalOpen(true);
      return;
    }

    for (let i = 0; i < passengersList.length; i++) {
      const p = passengersList[i];
      if (
        !p.first_name ||
        p.first_name.length > 48 ||
        !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(p.first_name)
      ) {
        setError(`Invalid First Name of Passenger ${i + 1} - [ ${p.type} ]`);
        // alert(`Invalid First Name ${i + 1}`);
        await checkValidPassenger();
        return;
      }
      if (
        !p.last_name ||
        p.last_name.length > 48 ||
        !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(p.last_name)
      ) {
        setError(`Invalid Last Name of Passenger ${i + 1} - [ ${p.type} ]`);
        // alert(`Invalid Last Name ${i + 1}`);
        await checkValidPassenger();

        return;
      }
      if (!p.title) {
        setError(`Missing Title of Passenger ${i + 1} - [ ${p.type} ]`);
        // alert(`Missing Title ${i + 1}`);
        await checkValidPassenger();

        return;
      }
      if (!p.dob) {
        setError(`Missing DOB of Passenger ${i + 1} - [ ${p.type} ]`);
        // alert(`Missing DOB ${i + 1}`);
        setIsErrorModalOpen(true);

        return;
      }

      if (p.dob) {
        const targetDate: Date = new Date(p.dob);
        const currentDate: Date = new Date();

        const diffTime = currentDate.getTime() - targetDate.getTime();
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

        if (p.type === 'ADT' && diffYears < 12) {
          setError(`Passenger ${i + 1} - [ ${p.type} ] is under 12 years old`);
          // alert(`Passenger ${i + 1} is under 12 years old`);
          setIsErrorModalOpen(true);
          return;
        } else if (p.type === 'CHD' && (diffYears < 2 || diffYears >= 12)) {
          setError(
            `Passenger ${i + 1} - [ ${p.type} ] must be between 2 and 12 years old`
          );
          // alert(`Passenger ${i + 1} must be between 2 and 12 years old`);
          setIsErrorModalOpen(true);
          return;
        } else if (p.type === 'INF' && (diffYears >= 2 || diffYears < 0)) {
          setError(
            `Passenger ${i + 1} - [ ${p.type} ] must be under 2 years old`
          );
          // alert(`Passenger ${i + 1} must be under 2 years old`);
          setIsErrorModalOpen(true);
          return;
        }
      }

      if (data?.pr && data?.pr != 'false') {
        if (!p.passport_number) {
          setError(
            `Missing Passport Number of Passenger ${i + 1} - [ ${p.type} ]`
          );
          // alert(`Missing Passport Number ${i + 1}`);
          setIsErrorModalOpen(true);

          return;
        }

        if (p.passport_number.length < 6 || p.passport_number.length > 9) {
          setError(
            `Invalid Passport Number of Passenger ${i + 1} - [ ${p.type} ]`
          );
          // alert(`Invalid Passport Number ${i + 1}`);
          setIsErrorModalOpen(true);

          return;
        }

        if (!p.passport_expiry) {
          setError(
            `Missing Passport Expiry of Passenger ${i + 1} - [ ${p.type} ]`
          );
          // alert(`Missing Passport Expiry ${i + 1}`);
          setIsErrorModalOpen(true);

          return;
        }

        if (p.passport_expiry) {
          const expiryDate: Date = new Date(p.passport_expiry);
          const endJourneyDate: Date =
            sessionStorage.getItem('tripType') === 'round-trip'
              ? new Date(dayjs(returnDate).add(1, 'day').format('YYYY-MM-DD'))
              : new Date(dayjs(onwardDate).add(1, 'day').format('YYYY-MM-DD'));

          const diffTime = expiryDate.getTime() - endJourneyDate.getTime();
          const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

          if (diffYears < 0.5) {
            setError(
              `Passport of Passenger ${i + 1} - [ ${p.type} ] must be valid for at least 6 months after the end of the journey`
            );
            // alert(`Passport of Passenger ${i + 1} must be valid for at least 6 months after the end of the journey`);
            setIsErrorModalOpen(true);
            return;
          }
        }

        if (!p.nationality) {
          setError(`Missing Nationality of Passenger ${i + 1} - [ ${p.type} ]`);
          // alert(`Missing Nationality ${i + 1}`);
          setIsErrorModalOpen(true);

          return;
        }
        if (!p.issuing_country) {
          setError(
            `Missing Issuing Country of Passenger ${i + 1} - [ ${p.type} ]`
          );
          // alert(`Missing Issuing Country ${i + 1}`);
          setIsErrorModalOpen(true);

          return;
        }
      }
    }

    setIsErrorModalOpen(false);

    setError(null);

    // At this point you can construct payload and POST to booking endpoint
    console.log('Submitting', {
      contactDetail: { ...contactDetail, name: contactDetail.name.trim() },
      passengersList,
    });
    // example: await axios.post('/api/book', { contactDetail, passengersList });

    return true;
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-[1200px]">
        {/* Trip summary */}
        <div className="mb-6">
          <TripSummary flightDetails={flightDetails} />
          {sessionStorage.getItem('tripType') === 'round-trip' && (
            <TripSummary flightDetails={flightDetails} index={1} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger forms */}
            <section>
              <h2 className="font-bold text-xl mb-2">Who is travelling?</h2>

              <div className="space-y-4">
                {passengersList.map((p, idx) => (
                  <div
                    key={p.id ?? idx}
                    className="rounded-xl border p-4 shadow-md bg-white"
                  >
                    <p className="font-semibold">
                      Passenger {idx + 1} - [ {p.type} ]
                    </p>
                    <hr className="my-2" />
                    <PassengerForm
                      index={idx}
                      value={p}
                      onChange={(patch: any) =>
                        handlePassengerChange(idx, patch)
                      }
                    />
                  </div>
                ))}

                {isLoading && <div>Loading passengers…</div>}
                {/* {error && <div className="text-red-600">{error}</div>} */}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-bold text-xl mb-2">Contact Details</h2>

              <div className="rounded-xl border p-4 shadow-lg grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="Enter contact name"
                    value={contactDetail.name}
                    onChange={(e) =>
                      setContactDetail((s) => ({
                        ...s,
                        name: e.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    placeholder="Enter contact email"
                    value={contactDetail.email}
                    onChange={(e) =>
                      setContactDetail((s) => ({
                        ...s,
                        email: e.target.value.trim(),
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    placeholder="Enter contact number"
                    value={contactDetail.number.trim()}
                    onChange={(e) =>
                      setContactDetail((s) => ({
                        ...s,
                        number: e.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
            </section>

            {/* Ancilleries */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Extras</h2>

              <Card className="border rounded-xl shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div
                      className="flex flex-col items-center space-y-2 cursor-pointer text-blue-600"
                      onClick={() => {
                        handleNext().then(async (trigger) => {
                          if (trigger === undefined)
                            return setIsErrorModalOpen(true);

                          // Do not open if error modal already shown
                          if (isErrorModalOpen) return;

                          // If we already have seat data, open immediately
                          if (
                            gdsOrNdcResponse
                              ?.CatalogOfferingsAncillaryListResponse
                              ?.Identifier?.value
                          ) {
                            return setOpenSeatMap(true);
                          }

                          // Otherwise fetch seats and use the returned response directly
                          setError('Loading Seats...');
                          setIsErrorModalOpen(true);
                          const res = await fetchSeats();
                          const errorMsg =
                            res?.CatalogOfferingsAncillaryListResponse?.Result
                              ?.Error?.[0];

                          if (
                            errorMsg &&
                            res?.CatalogOfferingsAncillaryListResponse
                              ?.Identifier?.value === undefined
                          ) {
                            setOpenSeatMap(false);
                            setError(
                              errorMsg?.Message || 'SeatMap Not Available!'
                            );
                            setIsErrorModalOpen(true);
                            return;
                          }

                          // If fetch returned seat data, open dialog
                          if (
                            res &&
                            res?.CatalogOfferingsAncillaryListResponse
                              ?.Identifier?.value
                          ) {
                            setIsErrorModalOpen(false);
                            setOpenSeatMap(true);
                          } else {
                            setError('SeatMap Not Available!');
                            setIsErrorModalOpen(true);
                          }
                        });
                      }}
                    >
                      <Armchair className="w-8 h-8" />
                      <div className="font-medium">Seat</div>
                      {/* <p className="text-sm">
                        Overall size limit (L + W + H): 90 cm
                      </p>
                      <p className="text-sm font-semibold">1 × 3 kg</p> */}
                    </div>

                    <div className="flex flex-col items-center space-y-2 cursor-pointer text-orange-600">
                      <Utensils className="w-8 h-8" />
                      <div className="font-medium">Meals</div>
                      {/* <p className="text-sm">
                        Overall size limit (L + W + H): 115 cm
                      </p>
                      <p className="text-sm font-semibold">1 × 7 kg</p> */}
                    </div>

                    <div className="flex flex-col items-center space-y-2 cursor-pointer text-violet-600">
                      <Luggage className="w-8 h-8" />
                      <div className="font-medium">Extra Luggage</div>
                      {/* <p className="text-sm">View Details</p>
                      <p className="text-sm font-semibold">15 kg</p> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {false && (
              <>
                {/* Baggage / policies */}
                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    Baggage allowance
                  </h2>

                  <Card className="border rounded-xl shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Backpack className="w-8 h-8" />
                          <div className="font-medium">Personal item</div>
                          <p className="text-sm">
                            Overall size limit (L + W + H): 90 cm
                          </p>
                          <p className="text-sm font-semibold">1 × 3 kg</p>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                          <Briefcase className="w-8 h-8" />
                          <div className="font-medium">Carry-on baggage</div>
                          <p className="text-sm">
                            Overall size limit (L + W + H): 115 cm
                          </p>
                          <p className="text-sm font-semibold">1 × 7 kg</p>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                          <Luggage className="w-8 h-8" />
                          <div className="font-medium">Checked baggage</div>
                          <p className="text-sm">View Details</p>
                          <p className="text-sm font-semibold">15 kg</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Cancellation & changes */}
                <section>
                  <h2 className="text-xl font-semibold mb-2">
                    Cancellations &amp; changes
                  </h2>
                  <div className="space-y-3">
                    <Card className="border rounded-xl">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-50 p-2 rounded-md">
                            <CalendarX2 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              Cancellations
                            </div>
                            <p className="text-sm text-gray-600">
                              Cancellation policy:{' '}
                              <span className="text-red-600 font-medium">
                                Non-refundable
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="text-sm font-medium text-gray-500">
                          Included
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border rounded-xl">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-50 p-2 rounded-md">
                            <CalendarCheck className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              Changes
                            </div>
                            <p className="text-sm text-gray-600">
                              Change policy: From{' '}
                              <span className="font-medium">₹ 3,000</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-sm font-medium text-gray-500">
                          Included
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Discounts */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-xl font-semibold">Stay Discounts</h2>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>

                  <Card className="border rounded-xl">
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <TicketPercent className="w-8 h-8" />
                        <div className="font-medium">
                          New user promo code (1st booking)
                        </div>
                        <p className="text-sm text-orange-600 font-semibold">
                          10% off (up to ₹ 600.00)
                        </p>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <TicketPercent className="w-8 h-8" />
                        <div className="font-medium">
                          New user promo code (2nd booking)
                        </div>
                        <p className="text-sm text-orange-600 font-semibold">
                          5% off (up to ₹ 375.00)
                        </p>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <Percent className="w-8 h-8" />
                        <div className="font-medium">Flyer Exclusive Offer</div>
                        <p className="text-sm text-orange-600 font-semibold">
                          Up to 25% Off
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </>
            )}

            {/* Next button */}
            <div className="pt-4">
              <Button
                variant="default"
                className="bg-blue-700 hover:bg-blue-800 w-full rounded-xl text-lg"
                onClick={() => {
                  handleNext().then((trigger) =>
                    setOpen(
                      trigger != undefined && trigger && !isErrorModalOpen
                    )
                  );
                }}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Right column - price details */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-xl font-bold space-y-2 bg-blue-700 text-white p-4">
                <h2 className="text-lg">Price Details</h2>
                <hr className="border-white/30" />
                <div className="bg-blue-500 p-4 space-y-2 rounded">
                  <p className="flex justify-between">
                    <span>Base Price:</span>
                    <span>
                      {flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                        ?.CurrencyCode?.value || ''}{' '}
                      {flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                        ?.Base || 'Confirming...'}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Total Taxes:</span>
                    <span>
                      {flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                        ?.CurrencyCode?.value || ''}{' '}
                      {flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                        ?.TotalTaxes || 'Confirming...'}
                    </span>
                  </p>

                  {/* Extra Prices */}

                  {extraPrice?.seatPrice > 0 && (
                    <p className="flex justify-between">
                      <span>Seat:</span>
                      <span>{extraPrice?.seatPrice}</span>
                    </p>
                  )}

                  {extraPrice?.mealPrice > 0 && (
                    <p className="flex justify-between">
                      <span>Meals:</span>
                      <span>{extraPrice?.mealPrice}</span>
                    </p>
                  )}

                  {extraPrice?.extraLuggage > 0 && (
                    <p className="flex justify-between">
                      <span>Extra Luggage:</span>
                      <span>{extraPrice?.extraLuggage}</span>
                    </p>
                  )}

                  <div className="w-full h-1 bg-white/30 rounded-full"></div>
                  <p className="flex justify-between bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-[6px] p-2 px-3">
                    <span>Total:</span>
                    <span>
                      {flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                        ?.CurrencyCode?.value || ''}{' '}
                      {flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                        ?.TotalPrice +
                        (extraPrice?.seatPrice || 0) +
                        (extraPrice?.mealPrice || 0) +
                        (extraPrice?.extraLuggage || 0) || 'Confirming...'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* <div>
            {SeatMapDemo({
              seatmapResponse: { gdsOrNdcResponse },
              passengers: { passengersList },
              currency: 'INR',
              onConfirm: { setPassengersList },
              setExtraPrice: { setExtraPrice },
            })}
          </div> */}
        </div>

        {/* Passenger Dialog */}
        {/* {open && (
          <PassengerDialog
            open={open}
            onOpenChange={setOpen}
            passengers={passengersList}
            onContinue={handleContinue}
            flightDetails={flightDetails}
            grandTotal={
              flightDetails?.OfferListResponse?.OfferID?.[0]?.Price
                ?.TotalPrice +
              (extraPrice?.seatPrice || 0) +
              (extraPrice?.mealPrice || 0) +
              (extraPrice?.extraLuggage || 0)
            }
          />
        )} */}

        {open && (
          <PaymentConfirmationModal
            open={open}
            onOpenChange={setOpen}
            offerData={flightDetails}
            passengers={passengersList}
            onProceedToPayment={() => {
              handleContinue();
              // alert('Proceeding to payment...');
              setOpen(false);
            }}
            onEditPassengers={() => {
              setOpen(false);
              // alert('Opening passenger edit form...');
            }}
          />
        )}
        {/* Seat Selection Dialog */}
        <SeatSelectionDialog
          open={openSeatMap && false}
          onOpenChange={setOpenSeatMap}
          seatmapResponse={gdsOrNdcResponse}
          passengers={passengersList}
          currency="INR"
          onConfirm={setPassengersList}
          setExtraPrice={setExtraPrice}
        />

        {/* <SeatMapDemo
          open={openSeatMap}
          onOpenChange={setOpenSeatMap}
          seatmapResponse={gdsOrNdcResponse}
          passengers={passengersList}
          currency="INR"
          onConfirm={setPassengersList}
          setExtraPrice={setExtraPrice}
        /> */}

        {/* Error Modal */}

        <Modal
          open={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
        >
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {error?.toLowerCase()?.includes('seat')
                ? 'Information'
                : 'Required Field'}
            </h3>
            <p className="text-gray-600 mb-4 whitespace-pre-line text-left">
              {error}
            </p>
            <Button
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-[6px]"
            >
              OK
            </Button>
          </div>
        </Modal>

        {/* PNR Modal */}
        {!isErrorModalOpen && (
          <Modal
            open={pnrModal.open && !isErrorModalOpen}
            onClose={() => setPnrModal({ ...pnrModal, open: true })}
          >
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{pnrModal.message}</h3>
              {pnrModal.data?.length || true ? (
                <>
                  {/* <div className="">
                    {pnrModal.data?.map((receipt: any, index: number) => (
                      <p
                        key={index}
                        className="text-gray-600 mb-4 whitespace-pre-line"
                      >
                        {receipt?.Confirmation?.Locator?.source}:{' '}
                        {receipt.Confirmation?.Locator?.value}
                      </p>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 whitespace-pre-line text-center">
                    Please save the PNR(s) for future reference.
                  </p> */}

                  <div className="space-y-2">
                    {warnings?.length
                      ? warnings?.map((warning: any, index: number) => (
                          <p
                            key={index}
                            className="text-gray-600 mb-4 whitespace-pre-line text-sm"
                          >
                            {warning?.category && (
                              <>
                                {' '}
                                <strong>{warning?.category}:</strong>{' '}
                                <span>{warning?.Message}</span>
                              </>
                            )}
                          </p>
                        ))
                      : null}
                  </div>

                  {pnrModal.message?.includes('Payment') && (
                    <div className="flex justify-evenly w-full mt-4">
                      <Button
                        onClick={() =>
                          setPnrModal({ open: false, data: [], message: '' })
                        }
                        className="w-fit bg-[#BC1110] hover:bg-[#BC1110]/90 text-white rounded-[6px]"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          navigate('/payment-confirmation', {
                            state: {
                              workbench_id: state.workbench_id || workbenchID,
                            },
                          })
                        }
                        className="w-fit bg-blue-600 hover:bg-blue-700 text-white rounded-[6px]"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </Modal>
        )}
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </>
  );
};

export default BookFlight;
