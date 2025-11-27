const envUrl = "http://localhost:3006";
const envAnonKey = "mock_key_for_local_testing";

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

export const functionsBase = supabaseUrl;
