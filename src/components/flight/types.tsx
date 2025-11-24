export interface FlightDetail {
  filters: {
    departureTimeRange: { start: string; end: string };
    arrivalTimeRange: { start: string; end: string };
    priceRange: [number, number];
    stops: {
      nonStop: boolean;
      oneStop: boolean;
      twoPlusStop: boolean;
    };
    airline: string;
    duration: string;
    directFlight: boolean;
    // Returnn Flight Filters
    returnDepartureTimeRange: { start: string; end: string };
    returnArrivalTimeRange: { start: string; end: string };
    returnPriceRange: [number, number];
    returnStops: {
      nonStop: boolean;
      oneStop: boolean;
      twoPlusStop: boolean;
    };
    returnAirline: string;
    returnDuration: string;
    returnDirectFlight: boolean;
  };
  flights?: any[];
  airlineSpecificData?: any[];
  airlines?: any[];
  flightsData?: any;
  catalogProducts?: any[];
  products?: any[];
  termsAndConditions?: any[];
  brands?: any[];
  onClick?: () => void;
}
