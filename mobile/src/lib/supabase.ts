import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { PassType } from '../state/ecosystemStore';

const envSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const envSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

const isSupabaseConfigured = Boolean(envSupabaseUrl && envSupabaseAnonKey);

type SupabaseClientType = ReturnType<typeof createClient>;

const createMockSupabase = (): SupabaseClientType => {
  const panic = () => {
    throw new Error(
      'Supabase environment variables missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable cloud sync.',
    );
  };

  return {
    auth: {
      signInWithPassword: panic,
      signOut: async () => ({ data: { session: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: () => ({ select: panic, insert: panic, update: panic, delete: panic }),
  } as unknown as SupabaseClientType;
};

export const supabase = isSupabaseConfigured
  ? createClient(envSupabaseUrl!, envSupabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : createMockSupabase();

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase env vars not set. The app will operate in local-only mode. Provide EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY when ready.',
  );
}

export const shouldSyncWithSupabase = (passType: PassType) => passType !== 'guest';
