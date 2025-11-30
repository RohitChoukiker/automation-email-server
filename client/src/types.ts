export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  defaultTone?: string;
  autoSend?: boolean;
  automationEnabled?: boolean;
  followupDays?: number;
  createdAt?: string;
  updatedAt?: string;
}


export type EmailCategory = 'ALL' | 'PRIMARY' | 'PROMOTIONS' | 'SOCIAL' | 'UPDATES';

export interface Email {
  id: string;
  subject: string;
  sender: string;
  content: string;
  category: EmailCategory;
  date: string; // ISO string or simple date text
  isRead?: boolean;
  snippet?: string;
}