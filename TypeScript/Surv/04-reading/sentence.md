## never 型

- 値を持たないことを意味する特別な型
- never 型以外は何も代入ができず、またどんな型にも代入できるのが特徴
- 例外が発生する関数の戻り値や無限ループの戻り値、作りえない値が never 型になる

```
function throwError(): never {
  throw new Error();
}

function forever(): never {
  while(true) {}
}

type NumberString = number & string; // = never
```

- void 型は undefined を代入できるが、never 型は値を持てない
- ユニオン型を分岐処理するときにロジックがすべてのパターンを網羅しているかチェックする、網羅性チェックに応用できる

```
type Extension = "js" | "ts" | "json";

function printLang(ext: Extension): void {
  switch(ext) {
    case "js":
      console.log("JavaScript");
      break;
    case "ts":
      console.log("TypeScript");
      break;
    default:
      // 網羅性をチェックしたい値をnever型に代入する
      const exhaustivenessCheck: never = ext;
      break;
  }
}
```

**例外を用いた網羅性チェックはのちほど…**

## 制御フロー型と型ガードによる型の絞り込み

- ユニオン型で型注釈を書いた場合、片方の型でしか定義されていないメソッドやプロパティへアクセスすると型エラーが起きる
- if 文や for ループなどの制御フロー分析で型エラーを解消
- 型ガードとは型チェックのコードのことで、今回の制御フローにおいては変数の型を判定する条件式がそれにあたる
  - typeof
  - instanceof
  - in
  - ユーザー定義

## unknown 型

- 型が何か分からないときに使う型で、どんな値も代入可能
- any 型はどんな型の変数にも代入できるが、unknown 型は具体的な型への代入はできない
- プロパティへのアクセス、メソッドの呼び出しも不可
- 実際に unknown 型の値を使うには型を絞りこむ必要があり、typeof や instanseof などを条件式に含んだ if 文を使用する（＝型ガードでの絞り込み）

```
const val: unknown = "";
if(typeof val === "string") {
  console.log(val.toUpperCase());
}
// 型ガードにより、if文の中ではvalがstring型であることが確定したので、string型メソッドであるtoUpperCase()が使える
```

- any 型の値をより安全にする、型アサーションの制約回避で活躍
