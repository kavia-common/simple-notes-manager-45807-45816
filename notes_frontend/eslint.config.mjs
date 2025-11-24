import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // TypeScript already checks undefined symbols; avoid false-positives in browser contexts
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
    ignores: ["node_modules/**", "dist/**", "build/**"]
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
    }
  }
];