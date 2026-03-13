import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './secrets';
import { toast } from 'react-toastify';

if (!supabaseUrl || !supabaseAnonKey){
	toast.warn("Supabase credentials are missing. Please add them to your secrets file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

