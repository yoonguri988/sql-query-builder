import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 제외할 패턴을 먼저 정의
  {
    ignores: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/__tests__/**",
      ".next/**",
      "node_modules/**",
    ],
  },
  // 기존 Next.js 설정을 확장
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "warn",
    },
  },
];

export default eslintConfig;
