import js from "@eslint/js";
import security from "eslint-plugin-security";
import compat from "eslint-plugin-compat";
import globals from "globals";

export default [
    js.configs.recommended,
    security.configs.recommended,
    compat.configs["flat/recommended"],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            sourceType: "module"
        },
        rules: {
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
            "no-undef": "error",
            "security/detect-object-injection": "off" // Handled via manual audit for prototype
        }
    }
];
