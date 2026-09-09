import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser
            }
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_"
                }
            ]
        }
    },
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "warn",
            "@typescript-eslint/explicit-member-accessibility": [
                "warn",
                {
                    accessibility: "no-public" // Don't force "public" keyword
                }
            ],
            "@typescript-eslint/typedef": [
                "error",
                {
                    parameter: true
                }
            ]
        }
    },
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**"]
    }
]);