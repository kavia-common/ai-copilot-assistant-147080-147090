//
// Supabase client stub for the React frontend.
//
// This module conditionally exports a "client" placeholder if environment
// variables are present. No external SDKs are imported here. In a future
// iteration, replace the stub with a real Supabase JS client.
//
// Usage:
//   import supabase from './services/supabase';
//   if (supabase) {
//     // use the client (future integration)
//   } else {
//     // supabase is not configured; proceed without it
//   }
//

// Determine environment (development vs production) for debug logs
const IS_DEV = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

// Read env vars (Create React App convention)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if configuration is minimally present
const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client = null;
if (isConfigured) {
  // TODO: Replace with real Supabase JS SDK init when integrating.
  client = {
    type: 'supabase-client-stub',
    url: SUPABASE_URL,
    auth: 'anon',
  };
} else if (IS_DEV) {
  // Log only in development to avoid noisy logs in production
  // eslint-disable-next-line no-console
  console.debug('[supabase] Not configured: REACT_APP_SUPABASE_URL and/or REACT_APP_SUPABASE_ANON_KEY missing.');
}

// PUBLIC_INTERFACE
/**
 * Exports a nullable Supabase client stub.
 *
 * Returns:
 * - object: client stub when configured
 * - null: when not configured (app should continue working without Supabase)
 */
const supabase = client;

export default supabase;
