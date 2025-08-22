import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co' // This will be replaced by Lovable automatically
const supabaseAnonKey = 'your-anon-key' // This will be replaced by Lovable automatically

export const supabase = createClient(supabaseUrl, supabaseAnonKey)