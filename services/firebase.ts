
import { NewsItem, SupportTicket } from '../types';

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key] || '';
    }
    return '';
  } catch (e) {
    return '';
  }
};

export const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY') || "demo-key",
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || "demo.firebaseapp.com",
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || "demo-project",
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || "demo.appspot.com",
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || "123456789",
  appId: getEnvVar('VITE_FIREBASE_APP_ID') || "1:123456789:web:123456",
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  return [];
};

export const submitSupportTicket = async (ticket: Omit<SupportTicket, 'createdAt'>): Promise<boolean> => {
  console.log("Legacy firebase call:", ticket);
  return true;
};
