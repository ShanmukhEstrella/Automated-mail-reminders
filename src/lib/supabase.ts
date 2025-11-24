import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Email {
  id: string;
  subject: string;
  content: string;
  sender: string;
  is_important: boolean;
  importance_reason: string | null;
  status: 'pending' | 'replied' | 'reminded';
  created_at: string;
  reminder_sent_at: string | null;
  replied_at: string | null;
}

export interface Reminder {
  id: string;
  email_id: string;
  message: string;
  sent_at: string;
  created_at: string;
}
