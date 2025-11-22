export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  category: EmailCategory;
  isRead: boolean;
}

export type EmailCategory = 'ALL' | 'URGENT' | 'MEETING' | 'ORDER' | 'PAYMENT' | 'AI_ANSWER' | 'OTHER';

export interface User {
  email: string;
  name: string;
  picture?: string;
}
