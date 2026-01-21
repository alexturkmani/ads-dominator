/**
 * Location data and utilities for geo-targeting
 * Supports city selection, radius targeting, and location exclusions
 */

export interface Location {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'zip';
  parent?: string; // Parent location ID (e.g., state for city)
  country: string;
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

// Major US States
export const usStates: Location[] = [
  { id: 'us-al', name: 'Alabama', type: 'state', country: 'United States' },
  { id: 'us-ak', name: 'Alaska', type: 'state', country: 'United States' },
  { id: 'us-az', name: 'Arizona', type: 'state', country: 'United States' },
  { id: 'us-ar', name: 'Arkansas', type: 'state', country: 'United States' },
  { id: 'us-ca', name: 'California', type: 'state', country: 'United States' },
  { id: 'us-co', name: 'Colorado', type: 'state', country: 'United States' },
  { id: 'us-ct', name: 'Connecticut', type: 'state', country: 'United States' },
  { id: 'us-de', name: 'Delaware', type: 'state', country: 'United States' },
  { id: 'us-fl', name: 'Florida', type: 'state', country: 'United States' },
  { id: 'us-ga', name: 'Georgia', type: 'state', country: 'United States' },
  { id: 'us-hi', name: 'Hawaii', type: 'state', country: 'United States' },
  { id: 'us-id', name: 'Idaho', type: 'state', country: 'United States' },
  { id: 'us-il', name: 'Illinois', type: 'state', country: 'United States' },
  { id: 'us-in', name: 'Indiana', type: 'state', country: 'United States' },
  { id: 'us-ia', name: 'Iowa', type: 'state', country: 'United States' },
  { id: 'us-ks', name: 'Kansas', type: 'state', country: 'United States' },
  { id: 'us-ky', name: 'Kentucky', type: 'state', country: 'United States' },
  { id: 'us-la', name: 'Louisiana', type: 'state', country: 'United States' },
  { id: 'us-me', name: 'Maine', type: 'state', country: 'United States' },
  { id: 'us-md', name: 'Maryland', type: 'state', country: 'United States' },
  { id: 'us-ma', name: 'Massachusetts', type: 'state', country: 'United States' },
  { id: 'us-mi', name: 'Michigan', type: 'state', country: 'United States' },
  { id: 'us-mn', name: 'Minnesota', type: 'state', country: 'United States' },
  { id: 'us-ms', name: 'Mississippi', type: 'state', country: 'United States' },
  { id: 'us-mo', name: 'Missouri', type: 'state', country: 'United States' },
  { id: 'us-mt', name: 'Montana', type: 'state', country: 'United States' },
  { id: 'us-ne', name: 'Nebraska', type: 'state', country: 'United States' },
  { id: 'us-nv', name: 'Nevada', type: 'state', country: 'United States' },
  { id: 'us-nh', name: 'New Hampshire', type: 'state', country: 'United States' },
  { id: 'us-nj', name: 'New Jersey', type: 'state', country: 'United States' },
  { id: 'us-nm', name: 'New Mexico', type: 'state', country: 'United States' },
  { id: 'us-ny', name: 'New York', type: 'state', country: 'United States' },
  { id: 'us-nc', name: 'North Carolina', type: 'state', country: 'United States' },
  { id: 'us-nd', name: 'North Dakota', type: 'state', country: 'United States' },
  { id: 'us-oh', name: 'Ohio', type: 'state', country: 'United States' },
  { id: 'us-ok', name: 'Oklahoma', type: 'state', country: 'United States' },
  { id: 'us-or', name: 'Oregon', type: 'state', country: 'United States' },
  { id: 'us-pa', name: 'Pennsylvania', type: 'state', country: 'United States' },
  { id: 'us-ri', name: 'Rhode Island', type: 'state', country: 'United States' },
  { id: 'us-sc', name: 'South Carolina', type: 'state', country: 'United States' },
  { id: 'us-sd', name: 'South Dakota', type: 'state', country: 'United States' },
  { id: 'us-tn', name: 'Tennessee', type: 'state', country: 'United States' },
  { id: 'us-tx', name: 'Texas', type: 'state', country: 'United States' },
  { id: 'us-ut', name: 'Utah', type: 'state', country: 'United States' },
  { id: 'us-vt', name: 'Vermont', type: 'state', country: 'United States' },
  { id: 'us-va', name: 'Virginia', type: 'state', country: 'United States' },
  { id: 'us-wa', name: 'Washington', type: 'state', country: 'United States' },
  { id: 'us-wv', name: 'West Virginia', type: 'state', country: 'United States' },
  { id: 'us-wi', name: 'Wisconsin', type: 'state', country: 'United States' },
  { id: 'us-wy', name: 'Wyoming', type: 'state', country: 'United States' },
  { id: 'us-dc', name: 'Washington D.C.', type: 'state', country: 'United States' },
];

// Major US Cities with coordinates
export const usCities: Location[] = [
  // California
  { id: 'los-angeles', name: 'Los Angeles', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 34.0522, lng: -118.2437 }, population: 3979576 },
  { id: 'san-francisco', name: 'San Francisco', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 37.7749, lng: -122.4194 }, population: 883305 },
  { id: 'san-diego', name: 'San Diego', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 32.7157, lng: -117.1611 }, population: 1423851 },
  { id: 'san-jose', name: 'San Jose', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 37.3382, lng: -121.8863 }, population: 1021795 },
  { id: 'sacramento', name: 'Sacramento', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 38.5816, lng: -121.4944 }, population: 524943 },
  { id: 'fresno', name: 'Fresno', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 36.7378, lng: -119.7871 }, population: 542107 },
  { id: 'oakland', name: 'Oakland', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 37.8044, lng: -122.2712 }, population: 433031 },
  { id: 'long-beach', name: 'Long Beach', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 33.7701, lng: -118.1937 }, population: 466742 },
  { id: 'anaheim', name: 'Anaheim', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 33.8366, lng: -117.9143 }, population: 350365 },
  { id: 'irvine', name: 'Irvine', type: 'city', parent: 'us-ca', country: 'United States', coordinates: { lat: 33.6846, lng: -117.8265 }, population: 307670 },
  
  // Texas
  { id: 'houston', name: 'Houston', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 29.7604, lng: -95.3698 }, population: 2320268 },
  { id: 'dallas', name: 'Dallas', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 32.7767, lng: -96.7970 }, population: 1343573 },
  { id: 'austin', name: 'Austin', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 30.2672, lng: -97.7431 }, population: 978908 },
  { id: 'san-antonio', name: 'San Antonio', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 29.4241, lng: -98.4936 }, population: 1547253 },
  { id: 'fort-worth', name: 'Fort Worth', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 32.7555, lng: -97.3308 }, population: 909585 },
  { id: 'el-paso', name: 'El Paso', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 31.7619, lng: -106.4850 }, population: 681728 },
  { id: 'arlington-tx', name: 'Arlington', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 32.7357, lng: -97.1081 }, population: 398854 },
  { id: 'plano', name: 'Plano', type: 'city', parent: 'us-tx', country: 'United States', coordinates: { lat: 33.0198, lng: -96.6989 }, population: 287677 },
  
  // New York
  { id: 'new-york', name: 'New York City', type: 'city', parent: 'us-ny', country: 'United States', coordinates: { lat: 40.7128, lng: -74.0060 }, population: 8336817 },
  { id: 'buffalo', name: 'Buffalo', type: 'city', parent: 'us-ny', country: 'United States', coordinates: { lat: 42.8864, lng: -78.8784 }, population: 278349 },
  { id: 'rochester', name: 'Rochester', type: 'city', parent: 'us-ny', country: 'United States', coordinates: { lat: 43.1566, lng: -77.6088 }, population: 211328 },
  { id: 'albany', name: 'Albany', type: 'city', parent: 'us-ny', country: 'United States', coordinates: { lat: 42.6526, lng: -73.7562 }, population: 99224 },
  
  // Florida
  { id: 'miami', name: 'Miami', type: 'city', parent: 'us-fl', country: 'United States', coordinates: { lat: 25.7617, lng: -80.1918 }, population: 467963 },
  { id: 'orlando', name: 'Orlando', type: 'city', parent: 'us-fl', country: 'United States', coordinates: { lat: 28.5383, lng: -81.3792 }, population: 307573 },
  { id: 'tampa', name: 'Tampa', type: 'city', parent: 'us-fl', country: 'United States', coordinates: { lat: 27.9506, lng: -82.4572 }, population: 399700 },
  { id: 'jacksonville', name: 'Jacksonville', type: 'city', parent: 'us-fl', country: 'United States', coordinates: { lat: 30.3322, lng: -81.6557 }, population: 911507 },
  { id: 'fort-lauderdale', name: 'Fort Lauderdale', type: 'city', parent: 'us-fl', country: 'United States', coordinates: { lat: 26.1224, lng: -80.1373 }, population: 182595 },
  { id: 'st-petersburg', name: 'St. Petersburg', type: 'city', parent: 'us-fl', country: 'United States', coordinates: { lat: 27.7676, lng: -82.6403 }, population: 265098 },
  
  // Illinois
  { id: 'chicago', name: 'Chicago', type: 'city', parent: 'us-il', country: 'United States', coordinates: { lat: 41.8781, lng: -87.6298 }, population: 2746388 },
  { id: 'aurora', name: 'Aurora', type: 'city', parent: 'us-il', country: 'United States', coordinates: { lat: 41.7606, lng: -88.3201 }, population: 200965 },
  { id: 'naperville', name: 'Naperville', type: 'city', parent: 'us-il', country: 'United States', coordinates: { lat: 41.7508, lng: -88.1535 }, population: 149540 },
  
  // Pennsylvania
  { id: 'philadelphia', name: 'Philadelphia', type: 'city', parent: 'us-pa', country: 'United States', coordinates: { lat: 39.9526, lng: -75.1652 }, population: 1584064 },
  { id: 'pittsburgh', name: 'Pittsburgh', type: 'city', parent: 'us-pa', country: 'United States', coordinates: { lat: 40.4406, lng: -79.9959 }, population: 302971 },
  
  // Arizona
  { id: 'phoenix', name: 'Phoenix', type: 'city', parent: 'us-az', country: 'United States', coordinates: { lat: 33.4484, lng: -112.0740 }, population: 1680992 },
  { id: 'tucson', name: 'Tucson', type: 'city', parent: 'us-az', country: 'United States', coordinates: { lat: 32.2226, lng: -110.9747 }, population: 548073 },
  { id: 'mesa', name: 'Mesa', type: 'city', parent: 'us-az', country: 'United States', coordinates: { lat: 33.4152, lng: -111.8315 }, population: 518012 },
  { id: 'scottsdale', name: 'Scottsdale', type: 'city', parent: 'us-az', country: 'United States', coordinates: { lat: 33.4942, lng: -111.9261 }, population: 258069 },
  
  // Ohio
  { id: 'columbus', name: 'Columbus', type: 'city', parent: 'us-oh', country: 'United States', coordinates: { lat: 39.9612, lng: -82.9988 }, population: 898553 },
  { id: 'cleveland', name: 'Cleveland', type: 'city', parent: 'us-oh', country: 'United States', coordinates: { lat: 41.4993, lng: -81.6944 }, population: 381009 },
  { id: 'cincinnati', name: 'Cincinnati', type: 'city', parent: 'us-oh', country: 'United States', coordinates: { lat: 39.1031, lng: -84.5120 }, population: 309317 },
  
  // Georgia
  { id: 'atlanta', name: 'Atlanta', type: 'city', parent: 'us-ga', country: 'United States', coordinates: { lat: 33.7490, lng: -84.3880 }, population: 498715 },
  { id: 'savannah', name: 'Savannah', type: 'city', parent: 'us-ga', country: 'United States', coordinates: { lat: 32.0809, lng: -81.0912 }, population: 147780 },
  
  // North Carolina
  { id: 'charlotte', name: 'Charlotte', type: 'city', parent: 'us-nc', country: 'United States', coordinates: { lat: 35.2271, lng: -80.8431 }, population: 874579 },
  { id: 'raleigh', name: 'Raleigh', type: 'city', parent: 'us-nc', country: 'United States', coordinates: { lat: 35.7796, lng: -78.6382 }, population: 474069 },
  { id: 'durham', name: 'Durham', type: 'city', parent: 'us-nc', country: 'United States', coordinates: { lat: 35.9940, lng: -78.8986 }, population: 283506 },
  
  // Michigan
  { id: 'detroit', name: 'Detroit', type: 'city', parent: 'us-mi', country: 'United States', coordinates: { lat: 42.3314, lng: -83.0458 }, population: 639111 },
  { id: 'grand-rapids', name: 'Grand Rapids', type: 'city', parent: 'us-mi', country: 'United States', coordinates: { lat: 42.9634, lng: -85.6681 }, population: 198917 },
  
  // Washington
  { id: 'seattle', name: 'Seattle', type: 'city', parent: 'us-wa', country: 'United States', coordinates: { lat: 47.6062, lng: -122.3321 }, population: 753675 },
  { id: 'tacoma', name: 'Tacoma', type: 'city', parent: 'us-wa', country: 'United States', coordinates: { lat: 47.2529, lng: -122.4443 }, population: 219346 },
  { id: 'spokane', name: 'Spokane', type: 'city', parent: 'us-wa', country: 'United States', coordinates: { lat: 47.6588, lng: -117.4260 }, population: 222081 },
  
  // Colorado
  { id: 'denver', name: 'Denver', type: 'city', parent: 'us-co', country: 'United States', coordinates: { lat: 39.7392, lng: -104.9903 }, population: 727211 },
  { id: 'colorado-springs', name: 'Colorado Springs', type: 'city', parent: 'us-co', country: 'United States', coordinates: { lat: 38.8339, lng: -104.8214 }, population: 478961 },
  { id: 'aurora-co', name: 'Aurora', type: 'city', parent: 'us-co', country: 'United States', coordinates: { lat: 39.7294, lng: -104.8319 }, population: 386261 },
  
  // Massachusetts
  { id: 'boston', name: 'Boston', type: 'city', parent: 'us-ma', country: 'United States', coordinates: { lat: 42.3601, lng: -71.0589 }, population: 692600 },
  { id: 'worcester', name: 'Worcester', type: 'city', parent: 'us-ma', country: 'United States', coordinates: { lat: 42.2626, lng: -71.8023 }, population: 206518 },
  { id: 'cambridge', name: 'Cambridge', type: 'city', parent: 'us-ma', country: 'United States', coordinates: { lat: 42.3736, lng: -71.1097 }, population: 118403 },
  
  // Tennessee
  { id: 'nashville', name: 'Nashville', type: 'city', parent: 'us-tn', country: 'United States', coordinates: { lat: 36.1627, lng: -86.7816 }, population: 689447 },
  { id: 'memphis', name: 'Memphis', type: 'city', parent: 'us-tn', country: 'United States', coordinates: { lat: 35.1495, lng: -90.0490 }, population: 651073 },
  { id: 'knoxville', name: 'Knoxville', type: 'city', parent: 'us-tn', country: 'United States', coordinates: { lat: 35.9606, lng: -83.9207 }, population: 190740 },
  
  // Minnesota
  { id: 'minneapolis', name: 'Minneapolis', type: 'city', parent: 'us-mn', country: 'United States', coordinates: { lat: 44.9778, lng: -93.2650 }, population: 429954 },
  { id: 'st-paul', name: 'St. Paul', type: 'city', parent: 'us-mn', country: 'United States', coordinates: { lat: 44.9537, lng: -93.0900 }, population: 311527 },
  
  // Oregon
  { id: 'portland', name: 'Portland', type: 'city', parent: 'us-or', country: 'United States', coordinates: { lat: 45.5152, lng: -122.6784 }, population: 654741 },
  { id: 'salem', name: 'Salem', type: 'city', parent: 'us-or', country: 'United States', coordinates: { lat: 44.9429, lng: -123.0351 }, population: 177432 },
  
  // Nevada
  { id: 'las-vegas', name: 'Las Vegas', type: 'city', parent: 'us-nv', country: 'United States', coordinates: { lat: 36.1699, lng: -115.1398 }, population: 651319 },
  { id: 'henderson', name: 'Henderson', type: 'city', parent: 'us-nv', country: 'United States', coordinates: { lat: 36.0395, lng: -114.9817 }, population: 320189 },
  { id: 'reno', name: 'Reno', type: 'city', parent: 'us-nv', country: 'United States', coordinates: { lat: 39.5296, lng: -119.8138 }, population: 264165 },
  
  // Missouri
  { id: 'kansas-city-mo', name: 'Kansas City', type: 'city', parent: 'us-mo', country: 'United States', coordinates: { lat: 39.0997, lng: -94.5786 }, population: 508090 },
  { id: 'st-louis', name: 'St. Louis', type: 'city', parent: 'us-mo', country: 'United States', coordinates: { lat: 38.6270, lng: -90.1994 }, population: 301578 },
  
  // Maryland
  { id: 'baltimore', name: 'Baltimore', type: 'city', parent: 'us-md', country: 'United States', coordinates: { lat: 39.2904, lng: -76.6122 }, population: 585708 },
  
  // Wisconsin
  { id: 'milwaukee', name: 'Milwaukee', type: 'city', parent: 'us-wi', country: 'United States', coordinates: { lat: 43.0389, lng: -87.9065 }, population: 577222 },
  { id: 'madison', name: 'Madison', type: 'city', parent: 'us-wi', country: 'United States', coordinates: { lat: 43.0731, lng: -89.4012 }, population: 269840 },
  
  // Indiana
  { id: 'indianapolis', name: 'Indianapolis', type: 'city', parent: 'us-in', country: 'United States', coordinates: { lat: 39.7684, lng: -86.1581 }, population: 876384 },
  { id: 'fort-wayne', name: 'Fort Wayne', type: 'city', parent: 'us-in', country: 'United States', coordinates: { lat: 41.0793, lng: -85.1394 }, population: 263886 },
  
  // Louisiana
  { id: 'new-orleans', name: 'New Orleans', type: 'city', parent: 'us-la', country: 'United States', coordinates: { lat: 29.9511, lng: -90.0715 }, population: 383997 },
  { id: 'baton-rouge', name: 'Baton Rouge', type: 'city', parent: 'us-la', country: 'United States', coordinates: { lat: 30.4515, lng: -91.1871 }, population: 227470 },
  
  // Kentucky
  { id: 'louisville', name: 'Louisville', type: 'city', parent: 'us-ky', country: 'United States', coordinates: { lat: 38.2527, lng: -85.7585 }, population: 633045 },
  { id: 'lexington', name: 'Lexington', type: 'city', parent: 'us-ky', country: 'United States', coordinates: { lat: 38.0406, lng: -84.5037 }, population: 322570 },
  
  // Virginia
  { id: 'virginia-beach', name: 'Virginia Beach', type: 'city', parent: 'us-va', country: 'United States', coordinates: { lat: 36.8529, lng: -75.9780 }, population: 459470 },
  { id: 'norfolk', name: 'Norfolk', type: 'city', parent: 'us-va', country: 'United States', coordinates: { lat: 36.8508, lng: -76.2859 }, population: 244703 },
  { id: 'richmond', name: 'Richmond', type: 'city', parent: 'us-va', country: 'United States', coordinates: { lat: 37.5407, lng: -77.4360 }, population: 230436 },
  
  // Oklahoma
  { id: 'oklahoma-city', name: 'Oklahoma City', type: 'city', parent: 'us-ok', country: 'United States', coordinates: { lat: 35.4676, lng: -97.5164 }, population: 681054 },
  { id: 'tulsa', name: 'Tulsa', type: 'city', parent: 'us-ok', country: 'United States', coordinates: { lat: 36.1540, lng: -95.9928 }, population: 401190 },
  
  // Utah
  { id: 'salt-lake-city', name: 'Salt Lake City', type: 'city', parent: 'us-ut', country: 'United States', coordinates: { lat: 40.7608, lng: -111.8910 }, population: 200567 },
  { id: 'west-valley-city', name: 'West Valley City', type: 'city', parent: 'us-ut', country: 'United States', coordinates: { lat: 40.6916, lng: -112.0011 }, population: 140230 },
  
  // New Mexico
  { id: 'albuquerque', name: 'Albuquerque', type: 'city', parent: 'us-nm', country: 'United States', coordinates: { lat: 35.0844, lng: -106.6504 }, population: 560513 },
  { id: 'santa-fe', name: 'Santa Fe', type: 'city', parent: 'us-nm', country: 'United States', coordinates: { lat: 35.6870, lng: -105.9378 }, population: 87505 },
];

// Countries
export const countries: Location[] = [
  { id: 'us', name: 'United States', type: 'country', country: 'United States' },
  { id: 'ca', name: 'Canada', type: 'country', country: 'Canada' },
  { id: 'uk', name: 'United Kingdom', type: 'country', country: 'United Kingdom' },
  { id: 'au', name: 'Australia', type: 'country', country: 'Australia' },
  { id: 'de', name: 'Germany', type: 'country', country: 'Germany' },
  { id: 'fr', name: 'France', type: 'country', country: 'France' },
  { id: 'es', name: 'Spain', type: 'country', country: 'Spain' },
  { id: 'it', name: 'Italy', type: 'country', country: 'Italy' },
  { id: 'nl', name: 'Netherlands', type: 'country', country: 'Netherlands' },
  { id: 'ie', name: 'Ireland', type: 'country', country: 'Ireland' },
  { id: 'nz', name: 'New Zealand', type: 'country', country: 'New Zealand' },
];

// Radius options
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

// Get all locations for search
export const allLocations: Location[] = [...countries, ...usStates, ...usCities];

// Search function for locations
export function searchLocations(query: string): Location[] {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  
  return allLocations
    .filter(loc => loc.name.toLowerCase().includes(lowerQuery))
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

// Get cities in a state
export function getCitiesInState(stateId: string): Location[] {
  return usCities.filter(city => city.parent === stateId);
}

// Get state by city
export function getStateByCity(cityId: string): Location | undefined {
  const city = usCities.find(c => c.id === cityId);
  if (!city?.parent) return undefined;
  return usStates.find(s => s.id === city.parent);
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

// Check if a location is within radius of another
export function isWithinRadius(
  center: Location,
  target: Location,
  radiusMiles: number
): boolean {
  if (!center.coordinates || !target.coordinates) return false;
  
  const distance = calculateDistance(
    center.coordinates.lat,
    center.coordinates.lng,
    target.coordinates.lat,
    target.coordinates.lng,
    'miles'
  );
  
  return distance <= radiusMiles;
}
