// mobile/config/api.ts

// Change this value depending on your environment.
// For local dev on web, 127.0.0.1 usually works.
// For Expo Go on a phone, use your LAN IP (e.g. 192.168.x.x).
// mobile/config/api.ts

const dev = process.env.NODE_ENV === 'development';



export const API_BASE_URL = 'http://192.168.0.197:8000/api';


/*
export const API_BASE_URL = dev
  ? 'http://127.0.0.1:8000/api' // local dev
  : 'https://api.lifestylepass.com/api'; // production
*/