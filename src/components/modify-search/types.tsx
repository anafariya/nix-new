export interface ModifyFlightInterface {
  searchParams: any;
  setFlightsData: React.Dispatch<React.SetStateAction<any>>;
  setBrands?: React.Dispatch<React.SetStateAction<any[]>>;
  setCatalogProducts?: React.Dispatch<React.SetStateAction<any[]>>;
  setFlights?: React.Dispatch<React.SetStateAction<any[]>>;
  setProducts?: React.Dispatch<React.SetStateAction<any[]>>;
  setTermsAndConditions?: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface TravelersAndClass {
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  travelClass: string;
  setTravelClass: React.Dispatch<React.SetStateAction<string>>;
  setTravelers: React.Dispatch<
    React.SetStateAction<{ adults: number; children: number; infants: number }>
  >;
  setShow: (show: boolean) => void;
}
