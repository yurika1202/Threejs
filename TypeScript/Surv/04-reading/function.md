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
