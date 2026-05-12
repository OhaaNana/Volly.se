import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["frontend/**", "Backend/**", "node_modules/**", "dist/**"],
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
    },
  },
  prettierConfig,
];
