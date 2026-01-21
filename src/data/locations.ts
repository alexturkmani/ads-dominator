/**
 * Location data and utilities for geo-targeting
 * Supports worldwide city selection, radius targeting in miles/km, and location exclusions
 */

export interface Location {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'region';
  parent?: string;
  country: string;
  countryCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  population?: number;
}

export interface LocationTarget {
  id: string;
  location: Location;
  targetType: 'include' | 'exclude';
  radius?: {
    value: number;
    unit: 'miles' | 'km';
  };
}

// Countries
export const countries: Location[] = [
  { id: 'us', name: 'United States', type: 'country', country: 'United States', countryCode: 'US' },
  { id: 'ca', name: 'Canada', type: 'country', country: 'Canada', countryCode: 'CA' },
  { id: 'uk', name: 'United Kingdom', type: 'country', country: 'United Kingdom', countryCode: 'GB' },
  { id: 'au', name: 'Australia', type: 'country', country: 'Australia', countryCode: 'AU' },
  { id: 'de', name: 'Germany', type: 'country', country: 'Germany', countryCode: 'DE' },
  { id: 'fr', name: 'France', type: 'country', country: 'France', countryCode: 'FR' },
  { id: 'es', name: 'Spain', type: 'country', country: 'Spain', countryCode: 'ES' },
  { id: 'it', name: 'Italy', type: 'country', country: 'Italy', countryCode: 'IT' },
  { id: 'nl', name: 'Netherlands', type: 'country', country: 'Netherlands', countryCode: 'NL' },
  { id: 'be', name: 'Belgium', type: 'country', country: 'Belgium', countryCode: 'BE' },
  { id: 'ch', name: 'Switzerland', type: 'country', country: 'Switzerland', countryCode: 'CH' },
  { id: 'at', name: 'Austria', type: 'country', country: 'Austria', countryCode: 'AT' },
  { id: 'ie', name: 'Ireland', type: 'country', country: 'Ireland', countryCode: 'IE' },
  { id: 'nz', name: 'New Zealand', type: 'country', country: 'New Zealand', countryCode: 'NZ' },
  { id: 'sg', name: 'Singapore', type: 'country', country: 'Singapore', countryCode: 'SG' },
  { id: 'hk', name: 'Hong Kong', type: 'country', country: 'Hong Kong', countryCode: 'HK' },
  { id: 'jp', name: 'Japan', type: 'country', country: 'Japan', countryCode: 'JP' },
  { id: 'kr', name: 'South Korea', type: 'country', country: 'South Korea', countryCode: 'KR' },
  { id: 'cn', name: 'China', type: 'country', country: 'China', countryCode: 'CN' },
  { id: 'in', name: 'India', type: 'country', country: 'India', countryCode: 'IN' },
  { id: 'ae', name: 'United Arab Emirates', type: 'country', country: 'United Arab Emirates', countryCode: 'AE' },
  { id: 'sa', name: 'Saudi Arabia', type: 'country', country: 'Saudi Arabia', countryCode: 'SA' },
  { id: 'za', name: 'South Africa', type: 'country', country: 'South Africa', countryCode: 'ZA' },
  { id: 'br', name: 'Brazil', type: 'country', country: 'Brazil', countryCode: 'BR' },
  { id: 'mx', name: 'Mexico', type: 'country', country: 'Mexico', countryCode: 'MX' },
  { id: 'ar', name: 'Argentina', type: 'country', country: 'Argentina', countryCode: 'AR' },
  { id: 'cl', name: 'Chile', type: 'country', country: 'Chile', countryCode: 'CL' },
  { id: 'co', name: 'Colombia', type: 'country', country: 'Colombia', countryCode: 'CO' },
  { id: 'se', name: 'Sweden', type: 'country', country: 'Sweden', countryCode: 'SE' },
  { id: 'no', name: 'Norway', type: 'country', country: 'Norway', countryCode: 'NO' },
  { id: 'dk', name: 'Denmark', type: 'country', country: 'Denmark', countryCode: 'DK' },
  { id: 'fi', name: 'Finland', type: 'country', country: 'Finland', countryCode: 'FI' },
  { id: 'pl', name: 'Poland', type: 'country', country: 'Poland', countryCode: 'PL' },
  { id: 'pt', name: 'Portugal', type: 'country', country: 'Portugal', countryCode: 'PT' },
  { id: 'gr', name: 'Greece', type: 'country', country: 'Greece', countryCode: 'GR' },
  { id: 'tr', name: 'Turkey', type: 'country', country: 'Turkey', countryCode: 'TR' },
  { id: 'ru', name: 'Russia', type: 'country', country: 'Russia', countryCode: 'RU' },
  { id: 'il', name: 'Israel', type: 'country', country: 'Israel', countryCode: 'IL' },
  { id: 'eg', name: 'Egypt', type: 'country', country: 'Egypt', countryCode: 'EG' },
  { id: 'th', name: 'Thailand', type: 'country', country: 'Thailand', countryCode: 'TH' },
  { id: 'my', name: 'Malaysia', type: 'country', country: 'Malaysia', countryCode: 'MY' },
  { id: 'ph', name: 'Philippines', type: 'country', country: 'Philippines', countryCode: 'PH' },
  { id: 'id', name: 'Indonesia', type: 'country', country: 'Indonesia', countryCode: 'ID' },
  { id: 'vn', name: 'Vietnam', type: 'country', country: 'Vietnam', countryCode: 'VN' },
];

// US States
export const usStates: Location[] = [
  { id: 'us-al', name: 'Alabama', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ak', name: 'Alaska', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-az', name: 'Arizona', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ar', name: 'Arkansas', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ca', name: 'California', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-co', name: 'Colorado', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ct', name: 'Connecticut', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-de', name: 'Delaware', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-fl', name: 'Florida', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ga', name: 'Georgia', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-hi', name: 'Hawaii', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-id', name: 'Idaho', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-il', name: 'Illinois', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-in', name: 'Indiana', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ia', name: 'Iowa', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ks', name: 'Kansas', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ky', name: 'Kentucky', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-la', name: 'Louisiana', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-me', name: 'Maine', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-md', name: 'Maryland', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ma', name: 'Massachusetts', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-mi', name: 'Michigan', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-mn', name: 'Minnesota', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ms', name: 'Mississippi', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-mo', name: 'Missouri', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-mt', name: 'Montana', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ne', name: 'Nebraska', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-nv', name: 'Nevada', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-nh', name: 'New Hampshire', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-nj', name: 'New Jersey', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-nm', name: 'New Mexico', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ny', name: 'New York', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-nc', name: 'North Carolina', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-nd', name: 'North Dakota', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-oh', name: 'Ohio', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ok', name: 'Oklahoma', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-or', name: 'Oregon', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-pa', name: 'Pennsylvania', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ri', name: 'Rhode Island', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-sc', name: 'South Carolina', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-sd', name: 'South Dakota', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-tn', name: 'Tennessee', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-tx', name: 'Texas', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-ut', name: 'Utah', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-vt', name: 'Vermont', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-va', name: 'Virginia', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-wa', name: 'Washington', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-wv', name: 'West Virginia', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-wi', name: 'Wisconsin', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-wy', name: 'Wyoming', type: 'state', country: 'United States', countryCode: 'US' },
  { id: 'us-dc', name: 'Washington D.C.', type: 'state', country: 'United States', countryCode: 'US' },
];

// Worldwide Cities with coordinates
export const worldCities: Location[] = [
  // ============ UNITED STATES ============
  { id: 'los-angeles', name: 'Los Angeles', type: 'city', parent: 'us-ca', country: 'United States', countryCode: 'US', coordinates: { lat: 34.0522, lng: -118.2437 }, population: 3979576 },
  { id: 'san-francisco', name: 'San Francisco', type: 'city', parent: 'us-ca', country: 'United States', countryCode: 'US', coordinates: { lat: 37.7749, lng: -122.4194 }, population: 883305 },
  { id: 'san-diego', name: 'San Diego', type: 'city', parent: 'us-ca', country: 'United States', countryCode: 'US', coordinates: { lat: 32.7157, lng: -117.1611 }, population: 1423851 },
  { id: 'san-jose', name: 'San Jose', type: 'city', parent: 'us-ca', country: 'United States', countryCode: 'US', coordinates: { lat: 37.3382, lng: -121.8863 }, population: 1021795 },
  { id: 'sacramento', name: 'Sacramento', type: 'city', parent: 'us-ca', country: 'United States', countryCode: 'US', coordinates: { lat: 38.5816, lng: -121.4944 }, population: 524943 },
  { id: 'houston', name: 'Houston', type: 'city', parent: 'us-tx', country: 'United States', countryCode: 'US', coordinates: { lat: 29.7604, lng: -95.3698 }, population: 2320268 },
  { id: 'dallas', name: 'Dallas', type: 'city', parent: 'us-tx', country: 'United States', countryCode: 'US', coordinates: { lat: 32.7767, lng: -96.7970 }, population: 1343573 },
  { id: 'austin', name: 'Austin', type: 'city', parent: 'us-tx', country: 'United States', countryCode: 'US', coordinates: { lat: 30.2672, lng: -97.7431 }, population: 978908 },
  { id: 'san-antonio', name: 'San Antonio', type: 'city', parent: 'us-tx', country: 'United States', countryCode: 'US', coordinates: { lat: 29.4241, lng: -98.4936 }, population: 1547253 },
  { id: 'new-york', name: 'New York City', type: 'city', parent: 'us-ny', country: 'United States', countryCode: 'US', coordinates: { lat: 40.7128, lng: -74.0060 }, population: 8336817 },
  { id: 'miami', name: 'Miami', type: 'city', parent: 'us-fl', country: 'United States', countryCode: 'US', coordinates: { lat: 25.7617, lng: -80.1918 }, population: 467963 },
  { id: 'orlando', name: 'Orlando', type: 'city', parent: 'us-fl', country: 'United States', countryCode: 'US', coordinates: { lat: 28.5383, lng: -81.3792 }, population: 307573 },
  { id: 'tampa', name: 'Tampa', type: 'city', parent: 'us-fl', country: 'United States', countryCode: 'US', coordinates: { lat: 27.9506, lng: -82.4572 }, population: 399700 },
  { id: 'chicago', name: 'Chicago', type: 'city', parent: 'us-il', country: 'United States', countryCode: 'US', coordinates: { lat: 41.8781, lng: -87.6298 }, population: 2693976 },
  { id: 'philadelphia', name: 'Philadelphia', type: 'city', parent: 'us-pa', country: 'United States', countryCode: 'US', coordinates: { lat: 39.9526, lng: -75.1652 }, population: 1584064 },
  { id: 'phoenix', name: 'Phoenix', type: 'city', parent: 'us-az', country: 'United States', countryCode: 'US', coordinates: { lat: 33.4484, lng: -112.0740 }, population: 1680992 },
  { id: 'seattle', name: 'Seattle', type: 'city', parent: 'us-wa', country: 'United States', countryCode: 'US', coordinates: { lat: 47.6062, lng: -122.3321 }, population: 753675 },
  { id: 'denver', name: 'Denver', type: 'city', parent: 'us-co', country: 'United States', countryCode: 'US', coordinates: { lat: 39.7392, lng: -104.9903 }, population: 727211 },
  { id: 'las-vegas', name: 'Las Vegas', type: 'city', parent: 'us-nv', country: 'United States', countryCode: 'US', coordinates: { lat: 36.1699, lng: -115.1398 }, population: 651319 },
  { id: 'boston', name: 'Boston', type: 'city', parent: 'us-ma', country: 'United States', countryCode: 'US', coordinates: { lat: 42.3601, lng: -71.0589 }, population: 692600 },
  { id: 'washington-dc', name: 'Washington D.C.', type: 'city', parent: 'us-dc', country: 'United States', countryCode: 'US', coordinates: { lat: 38.9072, lng: -77.0369 }, population: 705749 },
  { id: 'atlanta', name: 'Atlanta', type: 'city', parent: 'us-ga', country: 'United States', countryCode: 'US', coordinates: { lat: 33.7490, lng: -84.3880 }, population: 498715 },
  { id: 'detroit', name: 'Detroit', type: 'city', parent: 'us-mi', country: 'United States', countryCode: 'US', coordinates: { lat: 42.3314, lng: -83.0458 }, population: 670031 },
  { id: 'minneapolis', name: 'Minneapolis', type: 'city', parent: 'us-mn', country: 'United States', countryCode: 'US', coordinates: { lat: 44.9778, lng: -93.2650 }, population: 429606 },
  { id: 'nashville', name: 'Nashville', type: 'city', parent: 'us-tn', country: 'United States', countryCode: 'US', coordinates: { lat: 36.1627, lng: -86.7816 }, population: 689447 },
  { id: 'portland', name: 'Portland', type: 'city', parent: 'us-or', country: 'United States', countryCode: 'US', coordinates: { lat: 45.5152, lng: -122.6784 }, population: 654741 },
  { id: 'charlotte', name: 'Charlotte', type: 'city', parent: 'us-nc', country: 'United States', countryCode: 'US', coordinates: { lat: 35.2271, lng: -80.8431 }, population: 885708 },
  { id: 'salt-lake-city', name: 'Salt Lake City', type: 'city', parent: 'us-ut', country: 'United States', countryCode: 'US', coordinates: { lat: 40.7608, lng: -111.8910 }, population: 200567 },
  { id: 'indianapolis', name: 'Indianapolis', type: 'city', parent: 'us-in', country: 'United States', countryCode: 'US', coordinates: { lat: 39.7684, lng: -86.1581 }, population: 876384 },
  { id: 'columbus-oh', name: 'Columbus', type: 'city', parent: 'us-oh', country: 'United States', countryCode: 'US', coordinates: { lat: 39.9612, lng: -82.9988 }, population: 905748 },
  { id: 'honolulu', name: 'Honolulu', type: 'city', parent: 'us-hi', country: 'United States', countryCode: 'US', coordinates: { lat: 21.3069, lng: -157.8583 }, population: 350964 },

  // ============ CANADA ============
  { id: 'toronto', name: 'Toronto', type: 'city', country: 'Canada', countryCode: 'CA', coordinates: { lat: 43.6532, lng: -79.3832 }, population: 2731571 },
  { id: 'vancouver', name: 'Vancouver', type: 'city', country: 'Canada', countryCode: 'CA', coordinates: { lat: 49.2827, lng: -123.1207 }, population: 631486 },
  { id: 'montreal', name: 'Montreal', type: 'city', country: 'Canada', countryCode: 'CA', coordinates: { lat: 45.5017, lng: -73.5673 }, population: 1762949 },
  { id: 'calgary', name: 'Calgary', type: 'city', country: 'Canada', countryCode: 'CA', coordinates: { lat: 51.0447, lng: -114.0719 }, population: 1239220 },
  { id: 'edmonton', name: 'Edmonton', type: 'city', country: 'Canada', countryCode: 'CA', coordinates: { lat: 53.5461, lng: -113.4938 }, population: 932546 },
  { id: 'ottawa', name: 'Ottawa', type: 'city', country: 'Canada', countryCode: 'CA', coordinates: { lat: 45.4215, lng: -75.6972 }, population: 934243 },
  { id: 'winnipeg', name: 'Winnipeg', type: 'city', country: 'Canada', countryCode: 'CA', coordinates: { lat: 49.8951, lng: -97.1384 }, population: 749534 },

  // ============ UNITED KINGDOM ============
  { id: 'london', name: 'London', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 51.5074, lng: -0.1278 }, population: 8982000 },
  { id: 'manchester', name: 'Manchester', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 53.4808, lng: -2.2426 }, population: 547627 },
  { id: 'birmingham', name: 'Birmingham', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 52.4862, lng: -1.8904 }, population: 1141816 },
  { id: 'leeds', name: 'Leeds', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 53.8008, lng: -1.5491 }, population: 793139 },
  { id: 'glasgow', name: 'Glasgow', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 55.8642, lng: -4.2518 }, population: 635640 },
  { id: 'liverpool', name: 'Liverpool', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 53.4084, lng: -2.9916 }, population: 494814 },
  { id: 'edinburgh', name: 'Edinburgh', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 55.9533, lng: -3.1883 }, population: 488050 },
  { id: 'bristol', name: 'Bristol', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 51.4545, lng: -2.5879 }, population: 463400 },
  { id: 'cardiff', name: 'Cardiff', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 51.4816, lng: -3.1791 }, population: 366903 },
  { id: 'belfast', name: 'Belfast', type: 'city', country: 'United Kingdom', countryCode: 'GB', coordinates: { lat: 54.5973, lng: -5.9301 }, population: 343542 },

  // ============ AUSTRALIA ============
  { id: 'sydney', name: 'Sydney', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -33.8688, lng: 151.2093 }, population: 5312163 },
  { id: 'melbourne', name: 'Melbourne', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -37.8136, lng: 144.9631 }, population: 5078193 },
  { id: 'brisbane', name: 'Brisbane', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -27.4698, lng: 153.0251 }, population: 2514184 },
  { id: 'perth', name: 'Perth', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -31.9505, lng: 115.8605 }, population: 2085973 },
  { id: 'adelaide', name: 'Adelaide', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -34.9285, lng: 138.6007 }, population: 1345777 },
  { id: 'gold-coast', name: 'Gold Coast', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -28.0167, lng: 153.4000 }, population: 679127 },
  { id: 'canberra', name: 'Canberra', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -35.2809, lng: 149.1300 }, population: 453558 },
  { id: 'hobart', name: 'Hobart', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -42.8821, lng: 147.3272 }, population: 240342 },
  { id: 'darwin', name: 'Darwin', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -12.4634, lng: 130.8456 }, population: 147255 },
  { id: 'cairns', name: 'Cairns', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -16.9186, lng: 145.7781 }, population: 152729 },
  { id: 'newcastle-au', name: 'Newcastle', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -32.9283, lng: 151.7817 }, population: 322278 },
  { id: 'wollongong', name: 'Wollongong', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -34.4278, lng: 150.8931 }, population: 305880 },
  { id: 'geelong', name: 'Geelong', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -38.1499, lng: 144.3617 }, population: 268277 },
  { id: 'townsville', name: 'Townsville', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -19.2590, lng: 146.8169 }, population: 180820 },
  { id: 'sunshine-coast', name: 'Sunshine Coast', type: 'city', country: 'Australia', countryCode: 'AU', coordinates: { lat: -26.6500, lng: 153.0667 }, population: 351000 },

  // ============ NEW ZEALAND ============
  { id: 'auckland', name: 'Auckland', type: 'city', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -36.8485, lng: 174.7633 }, population: 1657200 },
  { id: 'wellington', name: 'Wellington', type: 'city', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -41.2866, lng: 174.7756 }, population: 215400 },
  { id: 'christchurch', name: 'Christchurch', type: 'city', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -43.5321, lng: 172.6362 }, population: 389700 },
  { id: 'hamilton-nz', name: 'Hamilton', type: 'city', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -37.7870, lng: 175.2793 }, population: 176500 },
  { id: 'tauranga', name: 'Tauranga', type: 'city', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -37.6878, lng: 176.1651 }, population: 155200 },
  { id: 'dunedin', name: 'Dunedin', type: 'city', country: 'New Zealand', countryCode: 'NZ', coordinates: { lat: -45.8788, lng: 170.5028 }, population: 134100 },

  // ============ GERMANY ============
  { id: 'berlin', name: 'Berlin', type: 'city', country: 'Germany', countryCode: 'DE', coordinates: { lat: 52.5200, lng: 13.4050 }, population: 3769495 },
  { id: 'munich', name: 'Munich', type: 'city', country: 'Germany', countryCode: 'DE', coordinates: { lat: 48.1351, lng: 11.5820 }, population: 1471508 },
  { id: 'hamburg', name: 'Hamburg', type: 'city', country: 'Germany', countryCode: 'DE', coordinates: { lat: 53.5511, lng: 9.9937 }, population: 1841179 },
  { id: 'frankfurt', name: 'Frankfurt', type: 'city', country: 'Germany', countryCode: 'DE', coordinates: { lat: 50.1109, lng: 8.6821 }, population: 753056 },
  { id: 'cologne', name: 'Cologne', type: 'city', country: 'Germany', countryCode: 'DE', coordinates: { lat: 50.9375, lng: 6.9603 }, population: 1085664 },
  { id: 'dusseldorf', name: 'Düsseldorf', type: 'city', country: 'Germany', countryCode: 'DE', coordinates: { lat: 51.2277, lng: 6.7735 }, population: 619294 },
  { id: 'stuttgart', name: 'Stuttgart', type: 'city', country: 'Germany', countryCode: 'DE', coordinates: { lat: 48.7758, lng: 9.1829 }, population: 634830 },

  // ============ FRANCE ============
  { id: 'paris', name: 'Paris', type: 'city', country: 'France', countryCode: 'FR', coordinates: { lat: 48.8566, lng: 2.3522 }, population: 2161000 },
  { id: 'marseille', name: 'Marseille', type: 'city', country: 'France', countryCode: 'FR', coordinates: { lat: 43.2965, lng: 5.3698 }, population: 861635 },
  { id: 'lyon', name: 'Lyon', type: 'city', country: 'France', countryCode: 'FR', coordinates: { lat: 45.7640, lng: 4.8357 }, population: 516092 },
  { id: 'toulouse', name: 'Toulouse', type: 'city', country: 'France', countryCode: 'FR', coordinates: { lat: 43.6047, lng: 1.4442 }, population: 479553 },
  { id: 'nice', name: 'Nice', type: 'city', country: 'France', countryCode: 'FR', coordinates: { lat: 43.7102, lng: 7.2620 }, population: 342669 },
  { id: 'bordeaux', name: 'Bordeaux', type: 'city', country: 'France', countryCode: 'FR', coordinates: { lat: 44.8378, lng: -0.5792 }, population: 257068 },

  // ============ SPAIN ============
  { id: 'madrid', name: 'Madrid', type: 'city', country: 'Spain', countryCode: 'ES', coordinates: { lat: 40.4168, lng: -3.7038 }, population: 3223334 },
  { id: 'barcelona', name: 'Barcelona', type: 'city', country: 'Spain', countryCode: 'ES', coordinates: { lat: 41.3851, lng: 2.1734 }, population: 1620343 },
  { id: 'valencia', name: 'Valencia', type: 'city', country: 'Spain', countryCode: 'ES', coordinates: { lat: 39.4699, lng: -0.3763 }, population: 791413 },
  { id: 'seville', name: 'Seville', type: 'city', country: 'Spain', countryCode: 'ES', coordinates: { lat: 37.3891, lng: -5.9845 }, population: 688711 },
  { id: 'malaga', name: 'Málaga', type: 'city', country: 'Spain', countryCode: 'ES', coordinates: { lat: 36.7213, lng: -4.4214 }, population: 574654 },

  // ============ ITALY ============
  { id: 'rome', name: 'Rome', type: 'city', country: 'Italy', countryCode: 'IT', coordinates: { lat: 41.9028, lng: 12.4964 }, population: 2872800 },
  { id: 'milan', name: 'Milan', type: 'city', country: 'Italy', countryCode: 'IT', coordinates: { lat: 45.4642, lng: 9.1900 }, population: 1371498 },
  { id: 'naples', name: 'Naples', type: 'city', country: 'Italy', countryCode: 'IT', coordinates: { lat: 40.8518, lng: 14.2681 }, population: 967069 },
  { id: 'turin', name: 'Turin', type: 'city', country: 'Italy', countryCode: 'IT', coordinates: { lat: 45.0703, lng: 7.6869 }, population: 870456 },
  { id: 'florence', name: 'Florence', type: 'city', country: 'Italy', countryCode: 'IT', coordinates: { lat: 43.7696, lng: 11.2558 }, population: 382258 },
  { id: 'venice', name: 'Venice', type: 'city', country: 'Italy', countryCode: 'IT', coordinates: { lat: 45.4408, lng: 12.3155 }, population: 261905 },

  // ============ NETHERLANDS ============
  { id: 'amsterdam', name: 'Amsterdam', type: 'city', country: 'Netherlands', countryCode: 'NL', coordinates: { lat: 52.3676, lng: 4.9041 }, population: 872680 },
  { id: 'rotterdam', name: 'Rotterdam', type: 'city', country: 'Netherlands', countryCode: 'NL', coordinates: { lat: 51.9244, lng: 4.4777 }, population: 651446 },
  { id: 'the-hague', name: 'The Hague', type: 'city', country: 'Netherlands', countryCode: 'NL', coordinates: { lat: 52.0705, lng: 4.3007 }, population: 545163 },
  { id: 'utrecht', name: 'Utrecht', type: 'city', country: 'Netherlands', countryCode: 'NL', coordinates: { lat: 52.0907, lng: 5.1214 }, population: 357597 },

  // ============ IRELAND ============
  { id: 'dublin', name: 'Dublin', type: 'city', country: 'Ireland', countryCode: 'IE', coordinates: { lat: 53.3498, lng: -6.2603 }, population: 554554 },
  { id: 'cork', name: 'Cork', type: 'city', country: 'Ireland', countryCode: 'IE', coordinates: { lat: 51.8985, lng: -8.4756 }, population: 210000 },
  { id: 'galway', name: 'Galway', type: 'city', country: 'Ireland', countryCode: 'IE', coordinates: { lat: 53.2707, lng: -9.0568 }, population: 83456 },

  // ============ JAPAN ============
  { id: 'tokyo', name: 'Tokyo', type: 'city', country: 'Japan', countryCode: 'JP', coordinates: { lat: 35.6762, lng: 139.6503 }, population: 13960000 },
  { id: 'osaka', name: 'Osaka', type: 'city', country: 'Japan', countryCode: 'JP', coordinates: { lat: 34.6937, lng: 135.5023 }, population: 2691000 },
  { id: 'kyoto', name: 'Kyoto', type: 'city', country: 'Japan', countryCode: 'JP', coordinates: { lat: 35.0116, lng: 135.7681 }, population: 1461000 },
  { id: 'yokohama', name: 'Yokohama', type: 'city', country: 'Japan', countryCode: 'JP', coordinates: { lat: 35.4437, lng: 139.6380 }, population: 3748995 },
  { id: 'nagoya', name: 'Nagoya', type: 'city', country: 'Japan', countryCode: 'JP', coordinates: { lat: 35.1815, lng: 136.9066 }, population: 2320361 },

  // ============ SOUTH KOREA ============
  { id: 'seoul', name: 'Seoul', type: 'city', country: 'South Korea', countryCode: 'KR', coordinates: { lat: 37.5665, lng: 126.9780 }, population: 9733509 },
  { id: 'busan', name: 'Busan', type: 'city', country: 'South Korea', countryCode: 'KR', coordinates: { lat: 35.1796, lng: 129.0756 }, population: 3429000 },
  { id: 'incheon', name: 'Incheon', type: 'city', country: 'South Korea', countryCode: 'KR', coordinates: { lat: 37.4563, lng: 126.7052 }, population: 2957000 },

  // ============ CHINA & HONG KONG ============
  { id: 'beijing', name: 'Beijing', type: 'city', country: 'China', countryCode: 'CN', coordinates: { lat: 39.9042, lng: 116.4074 }, population: 21540000 },
  { id: 'shanghai', name: 'Shanghai', type: 'city', country: 'China', countryCode: 'CN', coordinates: { lat: 31.2304, lng: 121.4737 }, population: 24280000 },
  { id: 'guangzhou', name: 'Guangzhou', type: 'city', country: 'China', countryCode: 'CN', coordinates: { lat: 23.1291, lng: 113.2644 }, population: 13500000 },
  { id: 'shenzhen', name: 'Shenzhen', type: 'city', country: 'China', countryCode: 'CN', coordinates: { lat: 22.5431, lng: 114.0579 }, population: 12530000 },
  { id: 'hong-kong', name: 'Hong Kong', type: 'city', country: 'Hong Kong', countryCode: 'HK', coordinates: { lat: 22.3193, lng: 114.1694 }, population: 7500700 },

  // ============ SINGAPORE ============
  { id: 'singapore', name: 'Singapore', type: 'city', country: 'Singapore', countryCode: 'SG', coordinates: { lat: 1.3521, lng: 103.8198 }, population: 5850342 },

  // ============ INDIA ============
  { id: 'mumbai', name: 'Mumbai', type: 'city', country: 'India', countryCode: 'IN', coordinates: { lat: 19.0760, lng: 72.8777 }, population: 20411000 },
  { id: 'delhi', name: 'Delhi', type: 'city', country: 'India', countryCode: 'IN', coordinates: { lat: 28.7041, lng: 77.1025 }, population: 16787941 },
  { id: 'bangalore', name: 'Bangalore', type: 'city', country: 'India', countryCode: 'IN', coordinates: { lat: 12.9716, lng: 77.5946 }, population: 8443675 },
  { id: 'hyderabad', name: 'Hyderabad', type: 'city', country: 'India', countryCode: 'IN', coordinates: { lat: 17.3850, lng: 78.4867 }, population: 6809970 },
  { id: 'chennai', name: 'Chennai', type: 'city', country: 'India', countryCode: 'IN', coordinates: { lat: 13.0827, lng: 80.2707 }, population: 4681087 },
  { id: 'kolkata', name: 'Kolkata', type: 'city', country: 'India', countryCode: 'IN', coordinates: { lat: 22.5726, lng: 88.3639 }, population: 4496694 },
  { id: 'pune', name: 'Pune', type: 'city', country: 'India', countryCode: 'IN', coordinates: { lat: 18.5204, lng: 73.8567 }, population: 3124458 },

  // ============ UAE & SAUDI ============
  { id: 'dubai', name: 'Dubai', type: 'city', country: 'United Arab Emirates', countryCode: 'AE', coordinates: { lat: 25.2048, lng: 55.2708 }, population: 3331000 },
  { id: 'abu-dhabi', name: 'Abu Dhabi', type: 'city', country: 'United Arab Emirates', countryCode: 'AE', coordinates: { lat: 24.4539, lng: 54.3773 }, population: 1483000 },
  { id: 'riyadh', name: 'Riyadh', type: 'city', country: 'Saudi Arabia', countryCode: 'SA', coordinates: { lat: 24.7136, lng: 46.6753 }, population: 7676654 },
  { id: 'jeddah', name: 'Jeddah', type: 'city', country: 'Saudi Arabia', countryCode: 'SA', coordinates: { lat: 21.2854, lng: 39.2376 }, population: 4697000 },

  // ============ SOUTH AFRICA ============
  { id: 'johannesburg', name: 'Johannesburg', type: 'city', country: 'South Africa', countryCode: 'ZA', coordinates: { lat: -26.2041, lng: 28.0473 }, population: 5635127 },
  { id: 'cape-town', name: 'Cape Town', type: 'city', country: 'South Africa', countryCode: 'ZA', coordinates: { lat: -33.9249, lng: 18.4241 }, population: 4618000 },
  { id: 'durban', name: 'Durban', type: 'city', country: 'South Africa', countryCode: 'ZA', coordinates: { lat: -29.8587, lng: 31.0218 }, population: 3720953 },

  // ============ BRAZIL ============
  { id: 'sao-paulo', name: 'São Paulo', type: 'city', country: 'Brazil', countryCode: 'BR', coordinates: { lat: -23.5505, lng: -46.6333 }, population: 12325232 },
  { id: 'rio-de-janeiro', name: 'Rio de Janeiro', type: 'city', country: 'Brazil', countryCode: 'BR', coordinates: { lat: -22.9068, lng: -43.1729 }, population: 6748000 },
  { id: 'brasilia', name: 'Brasília', type: 'city', country: 'Brazil', countryCode: 'BR', coordinates: { lat: -15.7942, lng: -47.8822 }, population: 3055149 },

  // ============ MEXICO ============
  { id: 'mexico-city', name: 'Mexico City', type: 'city', country: 'Mexico', countryCode: 'MX', coordinates: { lat: 19.4326, lng: -99.1332 }, population: 8918653 },
  { id: 'guadalajara', name: 'Guadalajara', type: 'city', country: 'Mexico', countryCode: 'MX', coordinates: { lat: 20.6597, lng: -103.3496 }, population: 1495182 },
  { id: 'monterrey', name: 'Monterrey', type: 'city', country: 'Mexico', countryCode: 'MX', coordinates: { lat: 25.6866, lng: -100.3161 }, population: 1142994 },
  { id: 'cancun', name: 'Cancún', type: 'city', country: 'Mexico', countryCode: 'MX', coordinates: { lat: 21.1619, lng: -86.8515 }, population: 888797 },

  // ============ ARGENTINA ============
  { id: 'buenos-aires', name: 'Buenos Aires', type: 'city', country: 'Argentina', countryCode: 'AR', coordinates: { lat: -34.6037, lng: -58.3816 }, population: 3075646 },
  { id: 'cordoba-ar', name: 'Córdoba', type: 'city', country: 'Argentina', countryCode: 'AR', coordinates: { lat: -31.4201, lng: -64.1888 }, population: 1391000 },

  // ============ SCANDINAVIA ============
  { id: 'stockholm', name: 'Stockholm', type: 'city', country: 'Sweden', countryCode: 'SE', coordinates: { lat: 59.3293, lng: 18.0686 }, population: 975904 },
  { id: 'oslo', name: 'Oslo', type: 'city', country: 'Norway', countryCode: 'NO', coordinates: { lat: 59.9139, lng: 10.7522 }, population: 697010 },
  { id: 'copenhagen', name: 'Copenhagen', type: 'city', country: 'Denmark', countryCode: 'DK', coordinates: { lat: 55.6761, lng: 12.5683 }, population: 644431 },
  { id: 'helsinki', name: 'Helsinki', type: 'city', country: 'Finland', countryCode: 'FI', coordinates: { lat: 60.1699, lng: 24.9384 }, population: 656229 },

  // ============ OTHER EUROPEAN ============
  { id: 'zurich', name: 'Zurich', type: 'city', country: 'Switzerland', countryCode: 'CH', coordinates: { lat: 47.3769, lng: 8.5417 }, population: 428737 },
  { id: 'geneva', name: 'Geneva', type: 'city', country: 'Switzerland', countryCode: 'CH', coordinates: { lat: 46.2044, lng: 6.1432 }, population: 203856 },
  { id: 'vienna', name: 'Vienna', type: 'city', country: 'Austria', countryCode: 'AT', coordinates: { lat: 48.2082, lng: 16.3738 }, population: 1897491 },
  { id: 'brussels', name: 'Brussels', type: 'city', country: 'Belgium', countryCode: 'BE', coordinates: { lat: 50.8503, lng: 4.3517 }, population: 185103 },
  { id: 'lisbon', name: 'Lisbon', type: 'city', country: 'Portugal', countryCode: 'PT', coordinates: { lat: 38.7223, lng: -9.1393 }, population: 504718 },
  { id: 'porto', name: 'Porto', type: 'city', country: 'Portugal', countryCode: 'PT', coordinates: { lat: 41.1579, lng: -8.6291 }, population: 237591 },
  { id: 'athens', name: 'Athens', type: 'city', country: 'Greece', countryCode: 'GR', coordinates: { lat: 37.9838, lng: 23.7275 }, population: 664046 },
  { id: 'warsaw', name: 'Warsaw', type: 'city', country: 'Poland', countryCode: 'PL', coordinates: { lat: 52.2297, lng: 21.0122 }, population: 1790658 },
  { id: 'krakow', name: 'Krakow', type: 'city', country: 'Poland', countryCode: 'PL', coordinates: { lat: 50.0647, lng: 19.9450 }, population: 779115 },
  { id: 'prague', name: 'Prague', type: 'city', country: 'Czech Republic', countryCode: 'CZ', coordinates: { lat: 50.0755, lng: 14.4378 }, population: 1309000 },
  { id: 'budapest', name: 'Budapest', type: 'city', country: 'Hungary', countryCode: 'HU', coordinates: { lat: 47.4979, lng: 19.0402 }, population: 1756000 },
  { id: 'istanbul', name: 'Istanbul', type: 'city', country: 'Turkey', countryCode: 'TR', coordinates: { lat: 41.0082, lng: 28.9784 }, population: 15460000 },
  { id: 'moscow', name: 'Moscow', type: 'city', country: 'Russia', countryCode: 'RU', coordinates: { lat: 55.7558, lng: 37.6173 }, population: 12537954 },
  { id: 'tel-aviv', name: 'Tel Aviv', type: 'city', country: 'Israel', countryCode: 'IL', coordinates: { lat: 32.0853, lng: 34.7818 }, population: 460613 },

  // ============ SOUTHEAST ASIA ============
  { id: 'bangkok', name: 'Bangkok', type: 'city', country: 'Thailand', countryCode: 'TH', coordinates: { lat: 13.7563, lng: 100.5018 }, population: 10539000 },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', type: 'city', country: 'Malaysia', countryCode: 'MY', coordinates: { lat: 3.1390, lng: 101.6869 }, population: 1982000 },
  { id: 'manila', name: 'Manila', type: 'city', country: 'Philippines', countryCode: 'PH', coordinates: { lat: 14.5995, lng: 120.9842 }, population: 1846513 },
  { id: 'jakarta', name: 'Jakarta', type: 'city', country: 'Indonesia', countryCode: 'ID', coordinates: { lat: -6.2088, lng: 106.8456 }, population: 10560000 },
  { id: 'ho-chi-minh', name: 'Ho Chi Minh City', type: 'city', country: 'Vietnam', countryCode: 'VN', coordinates: { lat: 10.8231, lng: 106.6297 }, population: 8993000 },
  { id: 'hanoi', name: 'Hanoi', type: 'city', country: 'Vietnam', countryCode: 'VN', coordinates: { lat: 21.0278, lng: 105.8342 }, population: 8053663 },
];

// Radius options in miles
export const radiusOptions = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 15, label: '15 miles' },
  { value: 20, label: '20 miles' },
  { value: 25, label: '25 miles' },
  { value: 30, label: '30 miles' },
  { value: 40, label: '40 miles' },
  { value: 50, label: '50 miles' },
  { value: 75, label: '75 miles' },
  { value: 100, label: '100 miles' },
];

// Radius options in kilometers
export const radiusOptionsKm = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 15, label: '15 km' },
  { value: 20, label: '20 km' },
  { value: 25, label: '25 km' },
  { value: 30, label: '30 km' },
  { value: 40, label: '40 km' },
  { value: 50, label: '50 km' },
  { value: 75, label: '75 km' },
  { value: 100, label: '100 km' },
  { value: 150, label: '150 km' },
  { value: 200, label: '200 km' },
];

// Get all locations for search
export const allLocations: Location[] = [...countries, ...usStates, ...worldCities];

// Search function for locations
export function searchLocations(query: string): Location[] {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  
  return allLocations
    .filter(loc => 
      loc.name.toLowerCase().includes(lowerQuery) || 
      loc.country.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => {
      // Prioritize exact matches
      const aStarts = a.name.toLowerCase().startsWith(lowerQuery);
      const bStarts = b.name.toLowerCase().startsWith(lowerQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      // Then by population for cities
      if (a.population && b.population) {
        return b.population - a.population;
      }
      
      return a.name.localeCompare(b.name);
    })
    .slice(0, 20); // Limit results
}

// Get cities by country
export function getCitiesByCountry(countryCode: string): Location[] {
  return worldCities.filter(city => city.countryCode === countryCode);
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  unit: 'miles' | 'km' = 'miles'
): number {
  const R = unit === 'miles' ? 3959 : 6371; // Earth's radius
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Convert miles to km
export function milesToKm(miles: number): number {
  return miles * 1.60934;
}

// Convert km to miles
export function kmToMiles(km: number): number {
  return km / 1.60934;
}

// Check if a location is within radius of another
export function isWithinRadius(
  center: Location,
  target: Location,
  radius: number,
  unit: 'miles' | 'km' = 'miles'
): boolean {
  if (!center.coordinates || !target.coordinates) return false;
  
  const distance = calculateDistance(
    center.coordinates.lat,
    center.coordinates.lng,
    target.coordinates.lat,
    target.coordinates.lng,
    unit
  );
  
  return distance <= radius;
}
