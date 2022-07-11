## プリミティブ型

- JS の 2 つあるデータ型のうちのひとつ
- イミュータブル特性：値を直接変更できない
- プロパティをもたない

### 種類

- 論理型（boolean）：true または false の真偽値
- 数値型（number）：0 や 0.1 のような数値
- 文字列型（string）："Hello"などの文字列
- undefined 型：値が未定義であることを表す＝値が代入されていないため、値がない
- null 型：値がないことを表す＝代入すべき値が存在しないため、値がない（非推奨）
- シンボル型（symbol）：一意で不変の値
- bigint 型：number 型では扱えない大きな整数型
  **上記以外（配列や正規表現など）はすべてオブジェクト**

## 型強制

- JS は型が異なる 2 つの値を処理する時に、暗黙的に別の型へ変換される＝型強制

## ボックス化

- プリミティブからオブジェクトへの変換のこと
- JS では自動で変換してくれるので、プリミティブ型のままフィールドを参照したりメソッドを呼び出すことができる

### ラッパーオブジェクト

- JS の自動ボックス化で変換先となるオブジェクトのこと
  | プリミティブ型 | ラッパーオブジェクト |
  | ---- | ---- |
  | boolean | Boolean |
  | number | Number |
  | string | String |
  | symbol | Symbol |
  | bigint | BigInt |
- TS ではラッパーオブジェクトの型も定義されており、ラッパーオブジェクト型の変数にプリミティブ型の値を代入することも可能

```
const bool: Boolean = false;
```

- ただし、ラッパーオブジェクト型はプリミティブ型に代入できない
- 演算子は使えない
- つまり、型注釈にはプリミティブ型を使用すべし！

## リテラル型

- プリミティブ型の特定の値だけを代入可能にする型のこと

```
let x: 1;
x = 1: // OK
x = 100; // NG
```

- 一般的にマジックナンバーやステートの表現に用いられ、ユニオン型（「いずれかの型」を表現するもの）と組み合わせることが多い

```
let num: 1 | 2 | 3 = 1;
```

### リテラル型として表現できるもの

- 論理型の true と false
- 数値型の値
- 文字列型の文字列

## any 型

- どんな型でも代入を許す型であり、コンパイラーも型チェックを行わない
- 型を省略し型推論ができない場合は、TS は暗黙的に any 型として扱う（引数の型注釈の省略など）
- 暗黙 any を規制するオプションとして`noImplicitAny`があり、tsconfig.json において true を設定することで暗黙 any にエラーを出してくれる
- 「がんばらない TypeScript」を実施するために any はとてもよき（乱用はだめ、ぜったい）

## 列挙型（enum）

- 定数のセットに意味を持たせたコード表現ができる
- 列挙型と同じ名前のオブジェクトが定義され、メンバーがオブジェクトのプロパティとなる

```
enum 列挙型名 {
  メンバー
}

enum Position {
  Top,
  Right,
  Bottom,
  Left,
}

let position: Position; // 型として使う場合
```

- 値は上から 0 の連番
- メンバーに値を代入した場合は、それに続けて連番になる
- 型安全上の問題があるため、代替案も検討すること（ユニオン型やオブジェクトリテラル）

## ユニオン型

- 「いずれかの型」を表現するもので、2 つ以上の型をパイプ記号（|）で繋げて記述する

```
let number: number | undefined:
```

```
type ErrorCode =
  | 400
  | 401
  | 403;
```

- 配列でユニオン型を使用するときは、()が必要になるので注意！

```
type List = (string | number)[];
```

- 型判定をする時には TS の絞り込みを行う時は、たいてい if 文を使用する

```
const maybeUserId: string | null = localStorage.getItem("userId");
if (type of maybeUserId === "string") {
  const userId: string = maybeUserId;
}
```

### 判別可能なユニオン型

- ユニオンに属するオブジェクトの型を区別するためのしるしがついた特別なもの
- 前記の型判別が複雑になる場合に使用すると可読性と保守性が改善される

```
// 通常のユニオン型での絞り込み
type UploadStatus = InProgress | Success | Failure;
type InProgress = { done: boolean; progress: number };
type Success = { done: boolean };
type Failure = { done: boolean; error: Error };

// 判別可能なユニオン型での絞り込み
type UploadStatus = InProgress | Success | Failure;
type InProgress = { type: "InProgress"; progress: number };
type Success = { type: "Success" };
type Failure = { type: "Failure"; error: Error };
```

- type というディスクリミネータが追加され、型がリテラル型になる

```
function printStatus(status: UploadStatus) {
  if (status.type === "InProgress") {
    console.log(`アップロード中:${status.progress}%`);

(parameter) status: InProgress
  } else if (status.type === "Success") {
    console.log("アップロード成功", status);

(parameter) status: Success
  } else if (status.type === "Failure") {
    console.log(`アップロード失敗:${status.error.message}`);

(parameter) status: Failure
  } else {
    console.log("不正なステータス: ", status);
  }
}
```

- ディスクリミネータに使える型は、リテラル型（文字列、数値、論理値）と null と undefined

## インターセクション型

- ユニオン型と相対するもので、ユニオン型が「どれか」ならばインターセクション型は「どれも」を指す
- 合成したいオブジェクト同士を`&`で列挙する

```
type TwoDimensionalPoint = {
  x: number;
  y: number;
};

type Z = {
  z: number;
};

type ThreeDimensionalPoint = TwoDimensionalPoint & Z;

const p: ThreeDimensionalPoint = {
  x: 0,
  y: 1,
  z: 2,
}
```

## 型エイリアス

- 名前のついた型のことで、type キーワード使って名前を付与する
- 同じ型を再利用したいときに使用すると可読性・保守性が向上する

```
// StringOrNumberという名前のついた型
type StringOrNumber = string | number;
```

## 型アサーション「as」

- 型推論の上書きのことで、コンパイラに型を伝えることが可能（無理矢理感のある変更は不可能）

```
// as構文の場合（どちらかというとこっちが一般的）
const value: string | number = "this is a string";
const strLength: number = (value as string).length;

// アングルブランケット構文の場合
const value: string | number = "this is a string";
const strLength: number = (<string>value).length;
```

- バグを産む可能性が出てしまうため。型アサーションが必要になった時には型ガードやユーザ定義型ガードでの解決を先に試みること
- 型アノテーションは「この変数に代入できるのはこの型だよ」と伝えるもので、型アサーションは「この型だとおもってるかもだけど、こっちの型が正しいよ」と伝えるもの

## const アサーション

- オブジェクトリテラルの末尾に`as const`を記述すると、プロパティが readonly でリテラルタイプ指定したものと同等の扱いになる

```
const pikachu = {
  name: "pikachu",
  no: 25,
  genre: "mouse",
} as const;

pikachu.name = "raichu"; // error
```

| readonly                                   | as const                                     |
| ------------------------------------------ | -------------------------------------------- |
| プロパティ毎                               | オブジェクト全体                             |
| 入れ子オブジェクトのプロパティは変更できる | 入れ子オブジェクトのプロパティも変更できない |

## definite assignment assertion

- 変数やプロパティが確実に初期化されていることを TS コンパイラに伝える演算子
- 変数宣言の変数名やプロパティ名の後ろに`!`を記述する

```
let num!: number;
```

- 非 Null アサーションを使用する場合は、変数のあとに`!`を記述する

```
let num: number;
initNum();
console.log(num! * 2);
function initNum() {
  num = 2;
}
```

- アサーションの使用はできるだけ避ける

**初期化エラー**

- コンパイラオプション`strictNullChecks`が true のとき
  - 初期化されていない変数を参照した場合
  - 変数の初期化が関数内で行われている場合
- コンパイラオプション`strictNullChecks`と`strictPropertyInitialization`が true のとき
  - クラスのプロパティが、コンストラクタ以外のメソッドで初期化されている場合

## typeof 演算子

**JS**

- 値の型を調べる際に使う演算子で、if 文や switch と併用すると条件と合致したときにその変数をその型として扱えるようになる

```
// unknown型とされた変数nが、typeof演算子によってstring型と判別される例
const n: unknown = "";
if(typeof n === "string") {
  n.toUpperCase;
}
```

- null の演算結果は object になるので注意

```
// 値がオブジェクトか判定する際の最適実装例
function isObject(val) {
  return val !== null && typeof val === "object";
}
```

**TS**

- 変数から型を抽出する型演算子

```
const point = {x: 135, y: 35};
type Point = typeof point;

// 下記と同意味
type Point = {
  x: number;
  y: number;
}
```
