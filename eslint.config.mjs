import js from "@eslint/js";
import security from "eslint-plugin-security";
import compat from "eslint-plugin-compat";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";

import tsParser from "@typescript-eslint/parser";

export default [
    { ignores: ["dist/**"] },
    js.configs.recommended,
    security.configs.recommended,
    compat.configs["flat/recommended"],
    reactPlugin.configs.flat.recommended,
    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.browser,
                ...globals.node
            },
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
            "no-undef": "off", // Disabled in favor of TS compiler validation
            "security/detect-object-injection": "off", // Handled via manual audit for prototype
            "react/prop-types": "off"
        }
    }
];
