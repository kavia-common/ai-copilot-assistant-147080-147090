# React JS Frontend

This is the React frontend for the AI Copilot.

## Optional: Supabase
Supabase is not required to run the frontend. If you want to enable optional Supabase features later:

1. Copy `.env.example` to `.env`.
2. Provide the following variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

The app will continue to function normally without these variables; the Supabase client stub simply exports `null` if not configured.
