## オブジェクト

- プリミティブ型以外はすべてオブジェクト型
- インスタンス、クラス、配列、正規表現などなど…
- プロパティの値が同じであっても、インスタンスが異なると同一のものとは判定されない

```
const obj1 = {val: 123};
const obj2 = {val: 123};
console.log(obj1 == obj2); // false
```

- 型注釈はオブジェクトプロパティと値の型のペアを記述する

```
let box: {
  width: number
  height: number
};

box = {width: 1080, height: 720}; // OK
box = {width: "1080", height: 720}; // 文字列を代入しているためNG
box= {width: 1080}; // heightを指定していないためNG
```

- 上記はインラインで型注釈を行っているが、型エイリアス（型に名前をつけること）を使うことも可能

```
type Box = {
  width: number
  height: number
};

let box: Box = {width: 1080, height: 720};
```

### メソッドの場合

```
let calculator: {
  sum(x: number, y: number): number;
};

calculator = {
  sum(x, y) {
    return x + y;
  }
};
```

- 関数構文の書き方でも OK

```
let calculator: {
  sum: (x: number, y: number) => number;
};
```

- コンパイラーオプションの strictFunctionTypes を有効にしている場合は、関数構文はメソッド引数のチェックが双変から共変へと厳格になるので注意

### オブジェクトの型推論

- オブジェクトの値を変数宣言で代入する場合、型注釈を省略できる
- メソッドを持つオブジェクトも型推論が働くが、メソッドの場合は引数の型注釈が必要

### Record

- 連想配列のようなキーとバリューのオブジェクト型を定義する場合、ユーティリティ型の Record を使う方法もある

```
let foo: Record<string, number>;
foo = {a: 1, b: 2};
```

### object 型

- 使用は非推奨！！！
- プロパティ情報がない、どんなオブジェクトへの代入も可能であるため

## readonly プロパティ

- オブジェクトのプロパティを読み取り専用にする
- 値を代入しようとするとコンパイラが警告をだしてくれる

```
let obj: {
  readonly foo: number;
}
obj = {foo: 1};
obj.foo = 2; // error!
```

- オブジェクトが入れ子になっている場合は、その中のオブジェクトのプロパティまでは readonly にはならない＝入れ子のプロパティには代入が可能
- すべてのプロパティに readonly をつけるときには、ユーティリティ型の Readonly を使うのもあり

```
let obj: Readonly<{
  a: number;
  b: number;
  c: number;
}>
```

### const との違い

- const は変数そのものへの代入を禁止するものであり、変数がオブジェクトの場合は代入が許可される

```
const x = {y: 1};
x = {y: 2}; // NG
x.y = 2; // OK
```

- readonly はプロパティへの代入を禁止するものであり、変数自体への代入は許可される

```
let obj: {readonly x: number} = {x: 1};
obj.x = 2; // NG
obj = {x: 2}; // OK
```

- const と readonly を組み合わせると、変数自身とオブジェクトのプロパティの両方を変更不可にできる

```
const obj: {readonly x: number} = {x: 1};
obj.x = 2; // NG
obj = {x: 2}; // NG
```

### オプションプロパティ

- オブジェクトプロパティのオプショナルを型付けする時は、プロパティ名の後ろに`?`をつける

```
let size: {width?: number}
```

- オプションプロパティを持ったオブジェクト型は、そのオプションプロパティを持たなくても代入ができる

```
size = {}; // OK
```

- undefined の代入はできるが、null の代入はできない

### 余剰プロパティチェック

- オブジェクト型に存在しないプロパティを持つオブジェクトの代入を禁止する検査

```
let obj: {x: number};
obj = {x: 1} // OK
obj = {x: 1, y: 2} // NG
```

- 変数代入にはこのチェックは働かない

### インデックス型

- オブジェクトのフィールド名を指定せず、プロパティのみ指定したい場合に使う

```
let obj: {
  [K: string]: number;
}
```

- K は型変数であり、任意のものを指定する（一般的には K や key）
- string はフィールド名の型を表す（string、number、symbol のみ指定可能）
- 値の型が一致していれば、フィールド名が定義されていなくてもプロパティを代入できる

```
let obj: {
  [K: string]: number;
}

obj = {a: 1, b: 2}; // OK
obj.c = 4; // OK
obj["d"] = 5; // OK
```

- コンパイラオプションで`noUncheckedIndexedAccess`を有効にすると、インデックス型においてプロパティ型は指定した型と undefined 型のユニオン型になる＝プロパティが存在しないときに値が undefined であることを型で表すため

### Record を用いたインデックス型

- 以下二つの型注釈は同意味

```
let obj1: {[K: string]: number};
let obj2: Record<string, number>;
```

## オブジェクトの型注釈の違い

- 一般的にはプロパティの型まで指定する

```
let obj: {a: number; b: number};
```

- それとは異なり、ざっくりと「オブジェクトである」ことを型注釈する方法もある

### object 型

- オブジェクト型の値のみ代入できる型＝プリミティブ型が代入できない型

```
let a: object;
a = {x: 1} // OK
a = 1 // プリミティブ型なのでNG
```

### Object 型

- プロパティを持つ値ならなんでも代入可能
- プリミティブ型は自動ボックス化により、オブジェクトのようにプロパティをもてるため、プリミティブ型も代入できる（null や undefined を除く）
- ただし非推奨！

### {}型

- プロパティを持つ値ならなんでも代入可能（null や undefined を除く）

## 分割代入

- オブジェクトからプロパティを取り出す機能
- 通常ドット記法によってプロパティを取り出すが、分割代入は{}内にプロパティを指定することで同名のプロパティを作成できる

```
const item = {price: 100};
const {price} = item;
// const price = item.priceと同意味
```

- コロンの後ろに変数名を指定すると、その名前の変数に代入が可能
- 入れ子の場合は階層分だけ{}で囲む
- =でデフォ値を指定することも可能

### Shorthand property names

- オブジェクトのキーと変数名が同じ時に限り、オブジェクトに値を代入するときにも Shorthand property names を使用できる

```
type Wild = {
  name: string;
  no: number;
  genre: string;
}

const name = "pikachu";
const no = 25;
const genre = "mouse";

const pikachu:Wild = {
  name,
  no,
  genre,
};

// 上記をShorthand property namesを使わないと...
const pikachu: Wild = {
  name: name,
  no: no,
  genre: genre,
};
```

## オプショナルチェーン

- プロパティ値が存在しない場合にもエラー回避してプロパティ参照する方法
- エラーを避けるためには値が null や undefined でないかをチェックする必要がある
- if 文などで条件分岐すると複雑なコードになりがちなのでオプショナルチェーンを使う

```
const book = undefined;
const title = book?.title; // オプショナルチェーン
const title = book === null || book === undefined ? undefined : book.title; // これと同意味

console.log(title); // undefined

// ネストVer.
const authorEmail = book?.author?.email;

// 関数、メソッドVer.（引数の前に記述）
const result = increment?.(1);

// 配列Ver. （[]の前に記述）
const title = books?.[0];

// デフォ値の設定
const title = book?.title ?? "デフォ値";
```

- TS での使用時には、最後のプロパティの型と undefined のユニオン型が得られる

## クラス

- クラスを定義するとクラス名と同じ名前の型が同時に定義され、インスタンスを代入する変数に型注釈するときはクラス名を使用する

```
const person: Person = new Person();
```

- TS ではプロパティの追加・変更はできない
- 非パブリックなプロパティが存在すると、公称型のクラスになる＝互換性をなく代入したりされたりが出来ない

### コンストラクタ

- コンストラクタ引数の型注釈は、関数型注釈と同様にする
- 戻り値には型注釈できない（コンパイラに教える必要がないため）

```
class Person {
  constructor(name: string) {}
}
```

### フィールド

- インスタンスにフィールドを持たせた際、TS ではフィールドの型注釈も必要になる＝クラス宣言時にフィールドを用意しておかないとコンパイルエラーになる

```
class Person {
  name: string;
}
const alice = new Person();
alice.name = "Alice";
```

- 宣言時に型を省略した場合、コンストラクタで値が代入されるとその値で型推論される
- フィールドへの値代入はコンストラクタ内で this を用いてアクセスをする

```
class person {
  name: string;

  constructor(personName: string) {
    this.name = personName;
  }
}
const alice = new Person("Alice");
```

- フィールドの初期値を指定する時は、フィールド名に`=`を繋げて記述する

```
class Point {
  x: number = 0;
  y: number = 0;
}
// 上記の場合、値の型が明白なので型注釈は省略してもよい

// コンストラクタで初期化する場合…
class Point {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}
```

- 静的フィールド（インスタンスではなくクラスのプロパティとして扱う）を宣言する時は static キーワードをつかう
- 静的フィールドにアクセス修飾子や readonly をつけることも可能

```
class SomeClass {
  static field: number = 123;
}
console.log(SomeClass.field); // 123
// 上記のように初期値が設定されている場合は型推論が働くので型注釈の省略が可能
```

### メソッド

- メソッドの引数と戻り値に型注釈ができ、関数宣言時の型注釈と同様
- 静的フィールドと同様、静的メソッドを宣言する際には static キーワードを使う

### readonly

- フィールドに readonly 修飾子をつけると読み取り専用にでき、コンストラクタかフィールド初期化子でのみ値を代入できる
- メソッド内の処理であっても再代入は不可能

```
class Octopus {
  readonly name: string;
  readonly legs = 8;

  constructor() {
    this.name = "たこ";
  }

  setName(newName: string): void {
    this.name = newName; // error
  }
}

const octopus = new Octopus();
octopus.legs = 16; // error
```

### 抽象クラス（abstract）

- 直接インスタンス化(new)できないクラスのことで、スーパークラスとして利用することを保障するもの
