import type { Email, EmailCategory } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchEmails = async (category: EmailCategory = 'ALL'): Promise<Email[]> => {
  try {
    const url = category === 'ALL' 
      ? `${API_BASE_URL}/emails` 
      : `${API_BASE_URL}/emails?category=${category}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};
