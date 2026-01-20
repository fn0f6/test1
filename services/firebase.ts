

import { NewsItem, SupportTicket } from '../types';

// Use type assertion to access Vite environment variables to resolve property 'env' does not exist on type 'ImportMeta'
export const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:123456789:web:123456",
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  return [];
};

export const submitSupportTicket = async (ticket: Omit<SupportTicket, 'createdAt'>): Promise<boolean> => {
  console.log("Legacy firebase call:", ticket);
  return true;
};
