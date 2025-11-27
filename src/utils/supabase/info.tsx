const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || "http://localhost:3005";
const envAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || "mock_key_for_local_testing";

export const supabaseUrl = envUrl;
export const publicAnonKey = envAnonKey;

export const projectId = (() => {
  try {
    const host = new URL(supabaseUrl).hostname;
    return host.split('.')[0] || '';
  } catch {
    return '';
  }
})();

export const functionsBase = supabaseUrl.includes('supabase.co')
  ? `${supabaseUrl}/functions/v1`
  : supabaseUrl;
