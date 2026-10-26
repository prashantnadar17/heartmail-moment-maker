// Server-only helper. Never import from route components or client bundles.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Publishable-key client for public, RLS-protected reads. Created inside the
 * handler call path so `process.env` is only touched on the server.
 */
export function createPublicSupabase() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables. Connect Lovable Cloud.");
  }

  const fetchWithApiKey: typeof fetch = (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    // Opaque sb_publishable_ keys are not bearer JWTs.
    if (headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };

  return createClient<Database>(url, key, {
    global: { fetch: fetchWithApiKey },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}
