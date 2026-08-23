import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
const expectedSupabaseHost = "rucwlpzrumxejvhwazat.supabase.co";

function isExpectedSupabaseUrl(value: string | undefined) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === expectedSupabaseHost;
  } catch {
    return false;
  }
}

function isPublishableKey(value: string | undefined) {
  return Boolean(value?.startsWith("sb_publishable_"));
}

export const isSupabaseConfigured = Boolean(
  isExpectedSupabaseUrl(supabaseUrl) && isPublishableKey(supabasePublishableKey),
);

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (
    !isExpectedSupabaseUrl(supabaseUrl) ||
    !supabaseUrl ||
    !isPublishableKey(supabasePublishableKey) ||
    !supabasePublishableKey
  ) {
    throw new Error(
      "Supabase saknar NEXT_PUBLIC_SUPABASE_URL eller NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  browserClient ??= createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      // Auth is intentionally disabled until its cookie/session and RLS model is
      // implemented. This prevents implicit long-lived token storage in Web Storage.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return browserClient;
}

export async function verifySupabaseConnection(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (
    !isExpectedSupabaseUrl(supabaseUrl) ||
    !supabaseUrl ||
    !isPublishableKey(supabasePublishableKey) ||
    !supabasePublishableKey
  ) {
    return {
      ok: false,
      message: "Lägg in den publika Supabase-nyckeln för att slutföra kopplingen.",
    };
  }

  try {
    getSupabaseBrowserClient();
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabasePublishableKey },
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: `Supabase svarade med status ${response.status}. Kontrollera nyckeln.`,
      };
    }

    return {
      ok: true,
      message:
        "Supabase Auth health svarade. Databas, RLS och Auth-policyer är ännu inte verifierade.",
    };
  } catch {
    return {
      ok: false,
      message: "Anslutningen kunde inte nå Supabase. Försök igen.",
    };
  }
}
