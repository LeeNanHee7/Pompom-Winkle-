import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kqwdtjfsmgkbfkojpmsy.supabase.co';
const supabaseAnonKey = 'sb_publishable_NxY5m1-jJAgFb7gLRQgyew_yjZJP3zXu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
