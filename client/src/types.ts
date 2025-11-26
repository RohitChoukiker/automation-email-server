export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  category: EmailCategory;
  isRead: boolean;
}

export type EmailCategory =
  | 'ALL'
  | 'LEAD'
  | 'SALES'
  | 'PARTNERSHIP'
  | 'INVESTOR'
  | 'SUPPORT'
  | 'BUG_REPORT'
  | 'FEATURE_REQUEST'
  | 'BILLING'
  | 'MEETING'
  | 'FOLLOWUP'
  | 'QUESTION'
  | 'HIRING'
  | 'NEWSLETTER'
  | 'PERSONAL'
  | 'SPAM'
  | 'URGENT'
  | 'ORDER'
  | 'PAYMENT'
  | 'AI_ANSWER'
  | 'OTHER';

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
