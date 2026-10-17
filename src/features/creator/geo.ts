/**
 * Rough distance between two Indian places, for "campaigns near you". City-centre
 * coordinates only, so treat the result as "about N km", never as a route distance.
 */

const CITIES: Record<string, [number, number]> = {
  chennai: [13.0827, 80.2707],
  bengaluru: [12.9716, 77.5946],
  mumbai: [19.076, 72.8777],
  delhi: [28.6139, 77.209],
  hyderabad: [17.385, 78.4867],
  kolkata: [22.5726, 88.3639],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  lucknow: [26.8467, 80.9462],
  chandigarh: [30.7333, 76.7794],
  gurugram: [28.4595, 77.0266],
  noida: [28.5355, 77.391],
  coimbatore: [11.0168, 76.9558],
  madurai: [9.9252, 78.1198],
  tiruchirappalli: [10.7905, 78.7047],
  salem: [11.6643, 78.146],
  vellore: [12.9165, 79.1325],
  puducherry: [11.9416, 79.8083],
  kochi: [9.9312, 76.2673],
  thiruvananthapuram: [8.5241, 76.9366],
  mysuru: [12.2958, 76.6394],
  mangaluru: [12.9141, 74.856],
  visakhapatnam: [17.6868, 83.2185],
  vijayawada: [16.5062, 80.648],
  goa: [15.4909, 73.8278],
  indore: [22.7196, 75.8577],
  bhopal: [23.2599, 77.4126],
  nagpur: [21.1458, 79.0882],
  surat: [21.1702, 72.8311],
  bhubaneswar: [20.2961, 85.8245],
  guwahati: [26.1445, 91.7362],
  patna: [25.5941, 85.1376],
};

const ALIASES: Record<string, string> = {
  bangalore: 'bengaluru',
  bombay: 'mumbai',
  madras: 'chennai',
  'new delhi': 'delhi',
  calcutta: 'kolkata',
  pondicherry: 'puducherry',
  trichy: 'tiruchirappalli',
  vizag: 'visakhapatnam',
  mysore: 'mysuru',
  mangalore: 'mangaluru',
  cochin: 'kochi',
  trivandrum: 'thiruvananthapuram',
  gurgaon: 'gurugram',
  panaji: 'goa',
};

/** "Chennai, Tamil Nadu" / "Chennai • 15 km" → "chennai"; null when the city is unknown. */
export function cityKey(place: string | undefined): string | null {
  if (!place) return null;
  const head = place.split(/[,•(|-]/)[0].trim().toLowerCase();
  const key = ALIASES[head] ?? head;
  return CITIES[key] ? key : null;
}

/** Campaigns open to creators anywhere. */
export function isAnywhere(place: string | undefined): boolean {
  return /^(any|anywhere|pan[\s-]?india|all india|india|remote|online)\b/i.test((place ?? '').trim());
}

export function distanceKm(from: string | undefined, to: string | undefined): number | null {
  const a = cityKey(from);
  const b = cityKey(to);
  if (!a || !b) return null;
  if (a === b) return 0;
  const [lat1, lon1] = CITIES[a];
  const [lat2, lon2] = CITIES[b];
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
}

/** "In your city", "About 290 km away", "Open across India" or the place itself. */
export function distanceLabel(km: number | null, place: string, anywhere: boolean): string {
  if (anywhere) return 'Open across India';
  if (km === null) return place;
  if (km < 40) return 'In your city';
  return `About ${km < 100 ? km : Math.round(km / 10) * 10} km away`;
}
