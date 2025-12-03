import type { Email, EmailCategory, User } from './types';


export const BACKEND_BASE_URL =  'https://automation-email-node-services-861179148736.europe-west1.run.app'; // Production URL



export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

export const fetchEmails = async (category: EmailCategory = 'ALL'): Promise<Email[]> => {
  try {
    // Backend endpoint is /api/emails/filter-emails
    const url = category === 'ALL' 
      ? `${API_BASE_URL}/emails/filter-emails` 
      : `${API_BASE_URL}/emails/filter-emails?category=${category}`;
    
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // Backend returns { emails: [...] }, so extract the emails array
    return data.emails || [];
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

export const fetchMe = async (): Promise<User> => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const triggerAutomation = async (enabled: boolean) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/user/trigger-automation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ enabled })
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to update automation setting (${response.status}): ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering automation:', error);
    throw error;
  }
};

export const fetchEmailById = async (id: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/emails/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to fetch email (${response.status}): ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching email by id:', error);
    throw error;
  }
};

export const sendEmail = async (id: string, text?: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/emails/send/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const txt = await response.text().catch(() => '');
      throw new Error(`Failed to send email (${response.status}): ${txt}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
