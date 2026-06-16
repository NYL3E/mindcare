import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Les règles métier testées sont pures (aucun DOM requis).
    environment: "node",
    include: ["src/**/*.test.ts"],
    reporters: ["verbose"],
  },
});
