
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  thumbnailUrl: string;
  category: string;
}

export interface SupportTicket {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
