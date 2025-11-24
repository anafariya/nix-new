import { create } from 'zustand';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

interface City {
  CityName: string;
  CountryName: string;
  CountryCode: string;
}

interface HotelStore {
  cities: City[];
  isLoading: boolean;
  fetchCities: (prefix: string) => Promise<void>;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export const useHotelStore = create<HotelStore>((set) => ({
  cities: [],
  isLoading: false,
  fetchCities: async (prefix: string) => {
    try {
      set({ isLoading: true });
      console.log('Fetching cities for prefix:', prefix);

      const response = await axios.get(
        `https://fares.nixtour.com/Online3s/Services/MainService.asmx/GetCities?strInputXML=%3CGetCities%3E%3CSalesChannel%3EONLINE-DC%3C/SalesChannel%3E%3CCompCode%3EKN2182%3C/CompCode%3E%3CPrefix%3E${prefix}%3C/Prefix%3E%3CLangCode%3EGB%3C/LangCode%3E%3CProduct%3EHHL%3C/Product%3E%3CCountryCode%3E%3C/CountryCode%3E%3C/GetCities%3E`
      );

      console.log('Raw API Response:', response.data);

      // Parse XML response
      const result = parser.parse(response.data);
      console.log('Parsed XML Result:', result);

      // Extract cities from the parsed XML (string['#text'])
      let citiesArray = [];
      const cityString = result?.string?.['#text'];
      if (cityString) {
        // Fix property names to be quoted for valid JSON
        const jsonLike = cityString.replace(
          /([{,])\s*([A-Za-z0-9_]+)\s*:/g,
          '$1"$2":'
        );
        try {
          citiesArray = JSON.parse(jsonLike);
        } catch (e) {
          console.error('Failed to parse cities JSON:', e, jsonLike);
          citiesArray = [];
        }
      }

      const formattedCities = citiesArray.map((city: any) => ({
        CityName: city.CityName || '',
        CountryName: city.CountryName || '',
        CountryCode: city.CityCode || '',
      }));

      console.log('Formatted Cities:', formattedCities);

      set({
        cities: formattedCities,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching cities:', error);
      set({ cities: [], isLoading: false });
    }
  },
}));
