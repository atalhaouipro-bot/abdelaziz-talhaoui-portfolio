// =========================================================
// SUPABASE CONFIGURATION
// =========================================================

const SUPABASE_URL = "https://lyrrjtzwtieltkdgdxho.supabase.co";
const SUPABASE_KEY = "sb_publishable_5bsvJl0y6K0uM8grI4cVnQ_JWhQlJSe";

window.supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
