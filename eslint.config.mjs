import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("plugin:@typescript-eslint/recommended", "next", "next/core-web-vitals", "prettier"),

    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
        },
        rules: {
            "simple-import-sort/imports": "warn",
            "simple-import-sort/exports": "warn",

            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },

    // 3. ignore patterns (unchanged)
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
    },
];

export default eslintConfig;
