## process オブジェクト

- 情報の取得と操作をする API
- コマンドラインから引数を与えるとき、argv プロパティを使用すると文字列の配列として渡せる
  - 不要なものが含まれてる
  - 文字列の配列なので真偽値を受け取りたい時など不便  
    ＝ パースしてから値を任意の形に整形  
    ＝ commander パッケージを使用

## CommonJS モジュール

- Node/js 環境で利用されている JS モジュール化の仕組み
- module 変数を使って変数や関数などをエクスポートする
- プロパティの値のみがエクスポート対象
- require 関数を使ってインポートする
- 引数に渡すファイルパスは拡張子の省略が可能
- npm でインストールしたパッケージ名も指定可能（node_modules ディレクトリ内）

```
// my-module.js
module.export = {
  foo: "foo"
};

// インポート側
const myModule = require('./my-module');
console.log(myModule.foo); // "foo"
```

## fs モジュール

- Node.js でファイルの読み書きを行うための関数を提供するモジュールで、非同期形式と同期形式がある
  - 非同期形式の場合（一般的にこっちを使用）  
    コールバック関数を受けとり、第一引数はエラーオブジェクトで残りは処理の返り値となる
  - 同期形式の場合  
    エラー時には例外が投げられるので try...catch 構文を使う

```
const fs = require('fs');

// 非同期
fs.readFile('sample.md, (err, file) => {
  if(err) {
    console.error(err);
  } else {
    console.log(file);
  }
});

// 同期
try {
  const file = fs.readFileSync('sample.md');
} catch(err) {
  ...
}
```

### readFile 関数

- fs モジュールの関数で、ファイルの読み込みを行う
- Buffer インスタンスとして返ってくるので人間には読めないので、第二引数でファイルのエンコードを指定しておく

### marked パッケージ

- Markdown を HTML へ変換するライブラリ
- gfm オプションを使うと GitHub における Markdown の仕様に合わせて変換してくれる（デフォで true）
- アプリケーション側でデフォルト設定を持っておけば、marked の挙動が変わった時にも影響範囲を狭めることができる

## ユニットテスト

- プログラムが構成する小さな単位が個々の機能を正しく果たしているかを検証するテスト
- テスティングフレームワークの Mocha はグローバルに it（内部エラーをテスト失敗として扱う）や describe などの関数が定義されている
