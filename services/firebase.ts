import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { NewsItem, SupportTicket } from '../types';

// NOTE: In a real environment, these would be populated via process.env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:123456",
};

// Initialize Firebase only if config is valid (conceptually)
const USE_MOCK_DATA = true;

let db: any;

try {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization failed (expected in demo without keys). Using mock data.");
}

// --- MOCK DATA ---
const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'The Great Battle for the Golden Seas',
    excerpt: 'Our fleets engaged in an epic confrontation at sunset. Read the full report of the victory and new territories claimed.',
    date: 'Oct 24, 2023',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596529896791-537449298538?auto=format&fit=crop&q=80&w=800',
    category: 'Battle Report'
  },
  {
    id: '2',
    title: 'New Harbor Discovered at Night',
    excerpt: 'Navigators have charted a safe haven on the eastern isles. Perfect for restocking supplies and trading loot.',
    date: 'Oct 18, 2023',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500043204644-768d20653f32?auto=format&fit=crop&q=80&w=800',
    category: 'Discovery'
  },
  {
    id: '3',
    title: 'Sunset Raids Schedule',
    excerpt: 'The captain has ordered all hands on deck for the upcoming raids. Prepare your gear and sharpen your swords.',
    date: 'Oct 10, 2023',
    thumbnailUrl: 'https://images.unsplash.com/photo-1628172909436-e78a6358364d?auto=format&fit=crop&q=80&w=800',
    category: 'Orders'
  },
];

// --- SERVICE METHODS ---

export const fetchNews = async (): Promise<NewsItem[]> => {
  if (USE_MOCK_DATA || !db) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_NEWS;
  }

  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('date', 'desc'), limit(6));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as NewsItem));
  } catch (error) {
    console.error("Error fetching news:", error);
    return MOCK_NEWS; // Fallback to mock on error
  }
};

export const submitSupportTicket = async (ticket: Omit<SupportTicket, 'createdAt'>): Promise<boolean> => {
  if (USE_MOCK_DATA || !db) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Mock Ticket Submitted:", ticket);
    return true;
  }

  try {
    await addDoc(collection(db, 'support_tickets'), {
      ...ticket,
      createdAt: Date.now()
    });
    return true;
  } catch (error) {
    console.error("Error submitting ticket:", error);
    return false;
  }
};