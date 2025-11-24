import { create } from "zustand";
import axios from "axios";

interface City {
    CityName: string;
    CountryName: string;
    AirportName: string;
    AirportCode: string;
    CountryCode: string;
    ProvinceCode: string;
    ProvinceName: string;
    IsCity: boolean;
}

interface Airline {
    AirlineId: number;
    AirlineName: string;
    AirlineType: string;
    IataCode: string;
    IcaoCode: string;
    CallSign: string;
    IsActive: boolean | null;
    ImageUrl: string;
}

interface CitiesStore {
    cities: City[];
    airlines: Airline[];
    isLoading: boolean;
    error: string | null;
    fetchCities: (prefix: string) => Promise<void>;
    fetchAirlines: () => Promise<void>;
}

export const useCitiesStore = create<CitiesStore>((set) => ({
    cities: [],
    airlines: [],
    isLoading: false,
    error: null,

    fetchCities: async (prefix) => {
        set({ isLoading: true, error: null });

        try {
            const url = `https://fares.nixtour.com/Online3s/Services/MainService.asmx/GetCities?strInputXML=%3CGetCities%3E%3CCompCode%3EKN2182%3C/CompCode%3E%3CPrefix%3E${encodeURIComponent(
                prefix
            )}%3C/Prefix%3E%3CLangCode%3EGB%3C/LangCode%3E%3CProduct%3EAIR%3C/Product%3E%3CCountryCode%3E%3C/CountryCode%3E%3C/GetCities%3E`;

            const response = await axios.get(url, { headers: { "Content-Type": "text/xml" } });

            console.log("Raw response:", response.data);

            const regex = /<string[^>]*>(.*?)<\/string>/s;
            const match = response.data.match(regex);

            if (match && match[1]) {
                const citiesJsonString = match[1].replace(/([a-zA-Z0-9_]+)(?=\s*:)/g, '"$1"');
                const cities = JSON.parse(citiesJsonString) || [];
                console.log("Parsed cities data:", cities);

                set({
                    cities: cities,
                    isLoading: false,
                    error: null,
                });
            } else {
                console.error("No city data found in the response.");
                set({
                    cities: [],
                    isLoading: false,
                    error: "No city data found in the response.",
                });
            }
        } catch (error: any) {
            console.error("Error during API request or parsing:", error);
            set({
                cities: [],
                isLoading: false,
                error: error?.response?.data?.message || error?.message || "An error occurred while fetching cities",
            });
        }
    },

    // New function to fetch airlines
    fetchAirlines: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.get("https://api.nixtour.com/api/Web/AirlineList");

            if (response.data.Success && response.data.StatusCode === 200) {
                const airlines = response.data.Data || [];
                set({
                    airlines: airlines,
                    isLoading: false,
                    error: null,
                });
            } else {
                console.error("No airline data found in the response.");
                set({
                    airlines: [],
                    isLoading: false,
                    error: "No airline data found in the response.",
                });
            }
        } catch (error: any) {
            console.error("Error during API request:", error);
            set({
                airlines: [],
                isLoading: false,
                error: error?.response?.data?.message || error?.message || "An error occurred while fetching airlines",
            });
        }
    },
}));
