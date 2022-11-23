/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "prefer-template": "error",
    "prefer-const": "error",
    eqeqeq: "error",
  },
  globals: {
    Eff: "readonly",
    Noise: "readonly",
  },
};
