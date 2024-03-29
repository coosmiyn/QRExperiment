module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": "off",
    "max-len": "off",
    "indent": "warn",
    "semi": "warn",
    "spaced-comment": "off",
    "no-multi-spaces": "off",
    "@typescript-eslint/no-var-requires": "off",
    "object-curly-spacing": "off",
    "no-trailing-spaces": "off",
    "brace-style": "off",

  },
};
