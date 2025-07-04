// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://acybcneijroytxwmmgdx.supabase.co' // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeWJjbmVpanJveXR4d21tZ2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjA0NzAsImV4cCI6MjA2NTk5NjQ3MH0.nuiFlRr-xT0A0JL4X9N6uY2RA0lwyFp-4Vclxsgn8hk' // Replace with your Supabase public API key

export const supabase = createClient(supabaseUrl, supabaseKey)