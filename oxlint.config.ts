import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react, antiSlop],
  ignorePatterns: [...core.ignorePatterns, "**/.agents"],
  overrides: [
    {
      files: ["src/components/ui/*.tsx", "src/components/ui/**/*.tsx"],
      rules: {
        "unicorn/prefer-export-from": "off",
      },
    },
  ],
  rules: {
    "eslint/func-style": "off",
    "eslint/no-use-before-define": "off",
    "react/function-component-definition": "off",
  },
});
