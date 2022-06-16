module.exports = {
  root: true,

  // tsとjsどちらもリントできるよう、パーサーを指定
  parser: "@typescript-eslint/parser",

  // 第三者が作成したルールの追加
  // @typescript-eslint"はTypeScriptESLintの独自ルール
  plugins: ["@typescript-eslint"],

  env: {
    browser: true,
    es2021: true,
  },

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // TypeScriptESLint独自オプション
    project: "./tsconfig.eslint.json", // プロジェクトルートの絶対パス
    tsconfigRootDir: __dirname, // ESLint実行時に使うコンパイラ設定ファイルをtsconfigRootDirからの相対パスで指定
  },

  // チェック対象外にするファイルやディレクトリの指定
  ignorePatterns: ["dist"],

  // shareable configを使用するための設定
  extends: [
    "airbnb-base", // js向けルール
    "airbnb-typescript/base", // js向けルールを拡張してTypeScriptESLintのルールにも広げたもの
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // TypeScriptESLintが提供する推奨ルールセット
  ],

  rules: {
    "import/prefer-default-export": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "linebreak-style": ["error", "windows"],
  },
};
