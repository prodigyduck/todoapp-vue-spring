{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80,
  "endOfLine": "lf",
  "arrowParens": "always",
  "bracketSpacing": {
    "objects": "never",
    "arrays": "never"
  },
  "overrides": [
    {
      "files": ["*.vue", "*.ts"],
      "rules": {
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "vue/max-attributes-per-line": 15
      }
    }
  ]
}