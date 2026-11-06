import { createClient } from "@supabase/supabase-js";

let cliente = null;

// solo se usa en el backend, la service key nunca llega al navegador
export function db() {
  if (!cliente) {
    cliente = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return cliente;
}
