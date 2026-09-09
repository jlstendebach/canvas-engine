import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
    js.configs.recommended,
    ...tseslint.configs.recommended,

    // MARK: - All source and test files
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            ecmaVersion: "latest",
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
                    args: "all",
                    argsIgnorePattern: "^_$",
                    varsIgnorePattern: "^_$",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_$",
                    destructuredArrayIgnorePattern: "^_$"
                }
            ]
        }
    },

    // MARK: - TypeScript files (syntax-only rules)
    {
        files: ["**/*.ts"],
        rules: {
            "no-undef": "off", // False-positives on TypeScript; it can't see type-space
            "@typescript-eslint/typedef": [
                "error",
                {
                    parameter: true, // Explicit types on function parameters
                    arrowParameter: false, // ...but arrow callbacks may infer
                    memberVariableDeclaration: true, // Explicit types on class fields
                    variableDeclaration: false // Locals may infer
                }
            ],
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: false, // Inline callbacks need return types too
                    allowTypedFunctionExpressions: false,
                    allowHigherOrderFunctions: true // Outer return type declares the inner one
                }
            ],
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                {
                    accessibility: "no-public" // `#` is private, `protected` is explicit
                }
            ],
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    fixStyle: "separate-type-imports" // Distinct `import type` line, not inline
                }
            ]
        }
    },

    // MARK: - Source files (type-aware rules)
    //
    // These catch `any` leaking in from unconverted .js imports. Warnings
    // during the migration; promote to errors once every file is TypeScript.
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-call": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn"
        }
    },

    {
        ignores: ["dist/**", "coverage/**", "node_modules/**"]
    }
]);