import { createClient } from '@supabase/supabase-js'

const defaultUrl = 'https://elousemrmniyolefleii.supabase.co'
const defaultAnonKey = 'sb_publishable_Ha8FZ3jCiFQOgonUkHmLlQ_CRMuBT8y'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey

const hotData = import.meta.hot?.data
export const supabase = hotData?.supabase || createClient(supabaseUrl, supabaseAnonKey)

if (import.meta.hot) {
  import.meta.hot.dispose(data => {
    data.supabase = supabase
  })
}

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey)
