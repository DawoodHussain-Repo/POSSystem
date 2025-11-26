import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://trohefgrpexsidottrbu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb2hlZmdycGV4c2lkb3R0cmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjgzMjgsImV4cCI6MjA3OTc0NDMyOH0.B411BmNcNF4NPB56isVL1q6wq2bt-EOLWZGNXDXr83k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
