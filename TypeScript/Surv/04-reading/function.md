## 関数

- 関数宣言の引数と戻り値に型注釈をつけることができる

```
function increment(num: number): number {
  return num + 1;
}
```

- 引数の型注釈を省略した場合は、暗黙的に any 型になる
- 戻り値の型注釈を省略した場合は、コードから型推論される（return は複数あり、違う型を返している場合はユニオン型）
- 関数式の場合も同様の書き方だが、関数型の変数に関数式を代入する場合の引数は、型注釈を省略しても型推論がはたらく

```
type UseString = (val: string) => void;
let useString: UseString;
useString = function(val) {}; // val: string
```

- アロー関数の場合も同様の書き方だが、簡潔文体では型注釈はかけない

## 関数の型の宣言

- 関数の実装を示さずに関数のインターフェイスを定義することで、型エイリアスを用いる

```
type 型の名前 = (引数名: 引数の型) => 戻り値の型;
type Increment = (num: number) => number;
```

- アロー関数と関数式で使える
- 関数の実装側の引数と戻り値の型注釈は省略可能

```
// アロー関数
const increment: Increment = (num) => num + 1;

// 関数式
const increment: Increment = function(num) {
  return num + 1;
};
```

- 上記はアロー関数構文で関数の型宣言をしているが、メソッド構文でも可（一般的にはシンプルなアロー関数構文が好まれる）

```
type Increment = {
  (num: number): number;
};
```

- typeof 型演算子を使って、関数から型を導くこともできる

```
// 関数の実装
function increment(num: number): number {
  return num + 1;
}

// 関数の型を宣言
type Increment = typeof increment;
```

## void 型

- 戻り値がない関数の戻り値を型注釈するのに使用する特別な型

```
function print(message: string): void {
  console.log(message);
}
```

- 通常関数の戻り値注釈にのみ使うが、変数の型注釈に void 型を使った場合は undefined 型の変数に代入することはできない（undefined 型の変数を void 型へ代入は可能）
- void 型＝ undefined 型だが、戻り値型が undefined 型の場合は`return undefined`が必要になる
- 戻り値に undefined を含む関数の場合はユニオン型を使う

## オプション引数

- 渡す引数を省略できるようになる機能で、`?`を引数名の後ろにかく
- 普通の引数と一緒に記述する場合は最後にオプション引数を記述する

```
function 関数名(引数名?: 型) {}

function hello(person?: string) {
  hello();
}
```

- オプション引数の型は、型と undefined のユニオン型（上記コードだと引数 person の型は`string | undefined`となる）
- ユニオン型との違いは、呼び出す側で引数を省略できるかどうか
- 引数を使用する時はデフォルト値を代入するか処理を代入する必要がある

```
// デフォルト値（if文）
function hello(person?: string) {
  if (typeof person === "undefined") {
    person = "anonymous";
  }
  return "Hello " + person.toUpperCase();
}

// デフォルト値（Null合体代入演算子）
function hello(person?: string) {
  person ??= "anonymous";
  return "Hello " + person.toUpperCase();
}

// デフォルト値（デフォルト引数）※推奨
function hello(person: string = "anonymous") {
  return "Hello " + person.toUpperCase();
}

// 処理を代入
function hello(person?: string) {
  if(typeof person === "undefined") {
    return "Hello ANONYMOUS";
  }
  return "Hello " + person.toUpperCase();
}
```

## 残余引数

- 引数の数が決まってない時に使用する構文で、配列の型を記述する

```
function fn(...params: number[]) {}
```

## 分割代入

- 引数の右にオブジェクト型の型注釈を記述する

```
function foo({a, b}: {a: number, b: number}) {}

// 配列の場合
function bar([num1]: number[]) {}

// 配列のタプル型の場合
function bar([num1, num2]: [number, number]) {}
```

- 分割代入引数に対応するオブジェクトプロパティや配列要素がない場合、JS では undefined が代入されるが TS はコンパイルエラーになるので注意
- デフォルト引数も設定可能で、プロパティ既定値からプロパティ型が予想できる場合は型注釈を省略できる

```
function foo({a = 0}: {a?: number | string}) {}

// 引数全体のデフォ値指定は型注釈のあとに記述
function foo({a}: {a?: number} = {a: 0}) {}

// 各プロパティの既定値と引数全体の既定値を指定する場合
type Obj = {a?: number; b?: number};
function foo({a = 0, b = 0}: Obj = {}) {}
```

- 分割代入引数名と同じ変数が定義してあれば、オブジェクトリテラルのプロパティ名を省略して変数だけを渡すことができる

## Options Object パターン

- 複数の位置引数を受け取る代わりに、ひとつのオブジェクトを引数に受け取るように設計された関数

```
function fn(options) {
  console.log(options.x, options.y, options.z);
}
fn({x: 1, y: 2, z: 3});
// 1 2 3

// 分割代入を応用、型注釈も付与すると…
function fn({x, y, z}): {x: number, y: number, z: number} {
  console.log(x, y, z);
}
```

- メリット
  1. 引数の値が何を指すのか分かりやすい
  2. 引数追加時に既存コードを壊さない
  3. デフォ引数を省略できる

## オーバーロード関数

- 異なる引数や戻り値のパターンがいくつかある関数のことで、ひとつの関数に異なる関数シグネチャを複数もつ

```
// 関数シグネチャ
function hello(person: string): void;
function hello(persons: string[]): void;

// 関数実装
function hello(person: string | string[]): void {
  if (typeof person === "string") {
    console.log(`Hello ${person}`);
  } else {
    console.log(`Hello ${person.join(",")}`);
  }
}
```

- 関数シグネチャ部分はパターン数だけ書き、関数ボディは書けない
- 実装部分は全パターンを網羅する関数を書く
- アロー関数では使えないので、関数呼び出しシグネチャまたは関数型とインターセクション型で型注釈をする
- 関数シグネチャは詳しい順にかく
- 引数の数が違うだけの場合はオプション引数を使用する
- 引数の型だけが異なる場合はユニオン型を使用する
- 引数の型と戻り値の型に一定の対応関係がある場合は、ジェネリクスを使用する
