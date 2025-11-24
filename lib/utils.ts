import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Icon imports for mini inclusions
import hotelIcon from '../src/assets/images/hotel.webp';
import visaIcon from '../src/assets/images/visa.webp';
import transferIcon from '../src/assets/images/transfer.webp';
import sightSeeingIcon from '../src/assets/images/Sightseeing.webp';
import flightIcon from '../src/assets/images/flight.webp';
import mealIcon from '../src/assets/images/meal.webp';
import guideIcon from '../src/assets/images/Guide.webp';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMiniInclusionIcon(miniInclusion: string): string | null {
  switch (miniInclusion) {
    case 'Transfer':
      return transferIcon;
    case 'AirTicket':
      return flightIcon;
    case 'SightSeeing':
      return sightSeeingIcon;
    case 'Hotel':
      return hotelIcon;
    case 'Meal':
      return mealIcon;
    case 'Visa':
      return visaIcon;
    case 'Guide':
      return guideIcon;
    default:
      return null;
  }
}



// Create SEO-friendly URL slug from package name or title
export function createHolidaySlug(text: string): string {
  let processedText = text
    .toLowerCase()
    // Don't remove "tour packages" anymore since we have /holidays route for destinations
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  return processedText;
}

// Create slug from package name (returns package name as simple slug)
export function createHolidaySlugFromTitle(packageName: string): string {
  return createHolidaySlug(packageName);
}

// Convert URL slug back to possible package name variants for matching
export function generatePackageNameCandidates(urlSlug: string): string[] {
  // Decode URL component and replace hyphens with spaces
  const decodedFromUrl = decodeURIComponent(urlSlug).replace(/-/g, ' ');
  
  // Helper to title-case a string (each word capitalized)
  const toTitleCase = (s: string) => 
    s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  
  // Helper to capitalize first letter only
  const toSentenceCase = (s: string) => 
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return [
    decodedFromUrl, // Original decoded
    toTitleCase(decodedFromUrl), // Title Case
    toSentenceCase(decodedFromUrl), // Sentence case
    decodedFromUrl.toUpperCase(), // UPPERCASE
    decodedFromUrl.toLowerCase() // lowercase
  ];
}

// Convert URL slug back to possible title variants for matching
export function generateTitleCandidates(urlSlug: string): string[] {
  // Decode URL component and replace hyphens with spaces
  const decodedFromUrl = decodeURIComponent(urlSlug).replace(/-/g, ' ');
  
  // Helper to title-case a string (each word capitalized)
  const toTitleCase = (s: string) => 
    s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  
  // Helper to capitalize first letter only
  const toSentenceCase = (s: string) => 
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return [
    decodedFromUrl, // Original decoded
    toTitleCase(decodedFromUrl), // Title Case
    toSentenceCase(decodedFromUrl), // Sentence case
    decodedFromUrl.toUpperCase(), // UPPERCASE
    decodedFromUrl.toLowerCase() // lowercase
  ];
}


// Filter state interface for Choose Your Best-Fit Package section
export interface FilterState {
  sector: 'domestic' | 'international';
  days: 'day-1-3' | 'day-4-6' | 'day-7-9' | 'day-10-12' | 'day-13-more';
  budget: 'rs-u-10k' | 'rs-10k-20k' | 'rs-20k-40k' | 'rs-40k-60k' | 'rs-60k-80k' | 'rs-80k-more';
}

