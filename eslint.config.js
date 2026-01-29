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
            // Custom rule adjustments if needed
        }
    }
];
