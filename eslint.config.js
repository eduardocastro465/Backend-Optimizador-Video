import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node  // ← cambiado de browser a node
    }
  },
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",  // parámetros con _ se ignoran
          varsIgnorePattern: "^_"   // variables con _ se ignoran
        }
      ],
      "@typescript-eslint/no-namespace": "off"  // necesario para extender tipos de Express
    }
  }
]);