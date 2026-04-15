import js from "@eslint/js";
import security from "eslint-plugin-security";
import compat from "eslint-plugin-compat";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";

export default [
    { ignores: ["dist/**"] },
    js.configs.recommended,
    security.configs.recommended,
    compat.configs["flat/recommended"],
    reactPlugin.configs.flat.recommended,
    {
        languageOptions: {
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
            "no-undef": "error",
            "security/detect-object-injection": "off", // Handled via manual audit for prototype
            "react/prop-types": "off"
        }
    }
];
