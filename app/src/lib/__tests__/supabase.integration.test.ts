// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

// C4.5 — « La connexion BDD est présente ET testée ».
// Test d'intégration : connexion réelle à Supabase + vérification que la requête
// aboutit (connexion OK) et que le RLS renvoie une réponse valide en anonyme.
// Utilise des variables DÉDIÉES (SUPABASE_IT_*) pour ne pas être écrasé par les
// valeurs factices de vitest.config (test.env). Fournies en CI via GitHub Secrets ;
// absentes en local → le test est skippé proprement.
const url = process.env.SUPABASE_IT_URL;
const key = process.env.SUPABASE_IT_KEY;

describe.skipIf(!url || !key)("Connexion Supabase (intégration · C4.5)", () => {
  it("se connecte à la base et répond sans erreur (RLS actif)", async () => {
    const supabase = createClient(url!, key!);
    const { data, error } = await supabase
      .from("mood_entries")
      .select("id")
      .limit(1);

    expect(error).toBeNull();              // la requête aboutit → connexion établie
    expect(Array.isArray(data)).toBe(true); // réponse valide de la base
  });
});
