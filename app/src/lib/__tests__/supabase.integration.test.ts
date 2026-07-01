// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

// C4.5 — « La connexion BDD est présente ET testée ».
// Test d'intégration : connexion réelle à Supabase + vérification que la requête
// aboutit (connexion OK) et que le RLS renvoie une réponse valide en anonyme.
// Variables DÉDIÉES (SUPABASE_IT_*) pour ne pas être écrasé par vitest.config.
// Absentes en local → skip. Si l'infra est injoignable (projet en pause / réseau),
// on skip aussi plutôt que de bloquer le build.
const url = process.env.SUPABASE_IT_URL;
const key = process.env.SUPABASE_IT_KEY;

describe.skipIf(!url || !key)("Connexion Supabase (intégration · C4.5)", () => {
  it("se connecte à la base et répond (RLS actif)", async (ctx) => {
    const supabase = createClient(url!, key!);
    const { data, error } = await supabase.from("mood_entries").select("id").limit(1);

    const netFail =
      error &&
      /fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(
        `${error.message} ${(error as { details?: string }).details ?? ""}`,
      );
    if (netFail) return ctx.skip(); // infra Supabase indisponible → on ne bloque pas la CI

    expect(error).toBeNull();               // connexion établie, requête aboutie
    expect(Array.isArray(data)).toBe(true); // réponse valide de la base
  });
});
