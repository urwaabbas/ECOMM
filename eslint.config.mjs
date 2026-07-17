import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off" // This turns off the red error for the 'any' keyword
    }
  }, // <-- Added missing comma here
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next properly in Flat Config
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ]
  }
]);

export default eslintConfig;