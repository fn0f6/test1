import { NewsItem, SupportTicket } from '../types';

// Safe access to Vite environment variables
const env = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: env.VITE_FIREBASE_APP_ID || "1:123456789:web:123456",
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  return [];
};

export const submitSupportTicket = async (ticket: Omit<SupportTicket, 'createdAt'>): Promise<boolean> => {
  console.log("Legacy firebase call:", ticket);
  return true;
};
