// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // ✅ Next.js core web vitals rules
  ...nextConfig,

  // ✅ Your custom rule overrides (Errors → Warnings)
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // ✅ Ignore build / generated folders only
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

]);
