import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  // Alias "@" -> "src" (comme tsconfig) pour les imports des composants testés.
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // globals: true expose `expect` global, requis par @testing-library/jest-dom.
    globals: true,
    environment: "jsdom",
    // Variables factices : le client Supabase est instancié à l'import des composants
    // (createClient exige une URL/clé) — évite un throw au chargement pendant les tests.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    },
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    reporters: ["verbose"],
  },
});
