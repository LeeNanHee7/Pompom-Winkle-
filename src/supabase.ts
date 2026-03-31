import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kqwdtjfsmgkbfkojpmsy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxd2R0amZzbWdrYmZrb2pwbXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDE1OTAsImV4cCI6MjA5MDQ3NzU5MH0.UnN67ogJHle1LfwBulvzvUQ8SI3ZQkYN-f4q3PzPGuc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
