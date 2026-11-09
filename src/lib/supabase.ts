import { createClient, Session } from '@supabase/supabase-js';

// Read from env vars or localStorage config
const STORAGE_KEY_URL = 'kida8c_supabase_url';
const STORAGE_KEY_KEY = 'kida8c_supabase_key';
const STORAGE_KEY_SESSION = 'kida8c_demo_session';

export function getSupabaseConfig() {
  const customUrl = localStorage.getItem(STORAGE_KEY_URL);
  const customKey = localStorage.getItem(STORAGE_KEY_KEY);

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.EXPO_PUBLIC_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

  const url = customUrl || envUrl || 'https://YOUR_PROJECT.supabase.co';
  const key = customKey || envKey || 'YOUR_SUPABASE_ANON_KEY';

  const isConfigured = Boolean(
    url &&
    !url.includes('YOUR_PROJECT') &&
    url.startsWith('https://') &&
    key &&
    key !== 'YOUR_SUPABASE_ANON_KEY'
  );

  return { url, key, isConfigured };
}

export function saveSupabaseConfig(url: string, key: string) {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (key) localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  else localStorage.removeItem(STORAGE_KEY_KEY);

  window.location.reload();
}

const config = getSupabaseConfig();

let realClient: ReturnType<typeof createClient> | null = null;
if (config.isConfigured) {
  try {
    realClient = createClient(config.url, config.key);
  } catch (err) {
    console.warn('Could not initialize real Supabase client:', err);
  }
}

type AuthListener = (event: string, session: Session | null) => void;
const authListeners = new Set<AuthListener>();

let demoPendingOtp: { identity: string; code: string; type: 'email' | 'phone' } | null = null;

function notifyListeners(event: string, session: Session | null) {
  authListeners.forEach(listener => listener(event, session));
}

// Wrapper that delegates to real Supabase client if configured, or simulated OTP provider if in preview/demo
export const supabase = {
  isRealConfigured: config.isConfigured,
  configUrl: config.url,

  auth: {
    async getSession(): Promise<{ data: { session: Session | null }; error: any }> {
      if (realClient) {
        return await realClient.auth.getSession();
      }
      const raw = localStorage.getItem(STORAGE_KEY_SESSION);
      if (raw) {
        try {
          const session = JSON.parse(raw);
          return { data: { session }, error: null };
        } catch {
          localStorage.removeItem(STORAGE_KEY_SESSION);
        }
      }
      return { data: { session: null }, error: null };
    },

    onAuthStateChange(callback: AuthListener) {
      if (realClient) {
        const { data } = realClient.auth.onAuthStateChange(callback);
        return { data };
      }

      authListeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            }
          }
        }
      };
    },

    async signInWithOtp(params: { email?: string; phone?: string }): Promise<{ error: any; generatedCode?: string }> {
      if (realClient) {
        return await realClient.auth.signInWithOtp(params as any);
      }

      // Demo OTP generator for sandbox and preview
      const identity = (params.email || params.phone || '').trim();
      if (!identity) {
        return { error: { message: 'Missing email or phone number' } };
      }

      const generatedCode = '888888';
      demoPendingOtp = {
        identity,
        code: generatedCode,
        type: params.email ? 'email' : 'phone'
      };

      return { error: null, generatedCode };
    },

    async verifyOtp(params: { email?: string; phone?: string; token: string; type: string }): Promise<{ error: any; data?: { session: Session | null } }> {
      if (realClient) {
        return await realClient.auth.verifyOtp(params as any);
      }

      const identity = (params.email || params.phone || '').trim();
      const token = params.token.trim();

      // In demo mode, accept the generated code '888888' or '123456' or whatever was sent
      if (token === '888888' || token === '123456' || (demoPendingOtp && demoPendingOtp.code === token)) {
        const fakeSession: Session = {
          access_token: 'demo-token-' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'demo-refresh',
          user: {
            id: 'user-' + Math.random().toString(36).substring(2, 9),
            app_metadata: {},
            user_metadata: {
              name: identity.split('@')[0] || 'KidaCreator'
            },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            email: params.email,
            phone: params.phone,
          } as any
        };

        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(fakeSession));
        demoPendingOtp = null;
        notifyListeners('SIGNED_IN', fakeSession);
        return { error: null, data: { session: fakeSession } };
      }

      return { error: { message: 'Invalid verification code. (Hint for preview: use 888888 or 123456)' } };
    },

    async signOut(): Promise<{ error: any }> {
      if (realClient) {
        return await realClient.auth.signOut();
      }
      localStorage.removeItem(STORAGE_KEY_SESSION);
      notifyListeners('SIGNED_OUT', null);
      return { error: null };
    }
  }
};
