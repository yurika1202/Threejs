module.exports = {
  // 設定ファイルがあるディレクトリまでさかのぼる
  root: true,

  // チェック対象のjs/tsコードがどの実行環境で使われるか指定
  env: {
    browser: true, // windowやalertなどのグローバル変数が認識される
    es2021: true, // ES2021までに導入されたグローバル変数が認識される
  },

  // チェック対象のjsがどの構文を使うか指定
  parserOptions: {
    ecmaVersion: "latest", // ECMAScriptの指定 latest＝最新
    sourceType: "module", // jsをスクリプトモードかモジュールモードのどちらで記述するか指定
  },

  // ルールの設定
  //   rules: {
  //     "no-console": "error", // console.logを書いてはいけない
  //     camelcase: ["error", { properties: "never" }], // 指定のプロパティ名以外ではキャメルケースのみ使用可能
  //     semi: ["error", "always"], // 文末にセミコロンをつける
  //   },

  // shareable configの導入（今回はairbnbを使用）
  extends: ["airbnb-base"],

  // ルールの上書き
  rules: {
    "import/prefer-default-export": "off",
    quotes: ["error", "double"],
    "linebreak-style": ["error", "windows"],
  },
};
