### 関数の基本

- 関数は実行可能なオブジェクトである
- デフォ値を設定している場合、null を引数に渡すと null がそのまま渡されるが、undefined を引数に渡すとデフォ値に変換される

#### arguments

- 関数の中でのみ参照できる、自動で生成される変数
- 引数が格納されているオブジェクト（配列ぽい）
- 可変長引数（引数の数が固定でなく、任意の個数の引数を受け取る）の時に使用される
- ES6 からは Rest parameters の使用を推奨
- Rest parameters：仮引数の前に...をつけた仮引数のことで、関数に渡された値が配列として格納されている。

```
function fn(...args) {
    console.log(args); // [1, 2, 3]
}
fn(1, 2, 3);
```

### コールバック関数

- 他の関数に引数として渡される関数

```
function hello(name) {
    console.log('hello' + name);
}

function bye(name) {
    console.log('bye');
}

function fn(cb) {
    cb('Tom');
}

fn(hello); // helloTom
fn(bye); // bye
```

### this

- 呼び出し元のオブジェクトへの参照を保持するキーワード

```
const person = {
    name: 'Tom',
    hello: function() {
        console.log('Hello ' + this.name);
    }
}
person.hello(); // Hello Tom
```

- person というオブジェクトを経由してから hello メソッドへアクセスしている＝呼び出し元は person オブジェクト

#### 参照のコピー

- オブジェクトのメソッドとして実行される場合：this ＝呼び出し元のオブジェクト
- 関数として実行される場合：this ＝グローバルオブジェクト
- [0401 参照](0401/main.js)

#### コールバック関数

- [0402 参照](0402/main.js)

#### bind

- 第 1 引数で this の参照先、第 2 引数で引数を固定した新しい関数を作成できる
- [0403 参照](0403/main.js)
  **this の参照先の固定**

```
function a() {
    console.log('hello' + this.name);
}
const b = a.bind({name: 'Tim'});
b(); // helloTim
```

**引数の固定**

```
function a(name) {
    console.log('hello' + name);
}
const b = a.bind(null, 'Tim');
b('Tom'); // helloTim
```

#### call,apply

- bind：this や引数の参照先を変更。使用時点で実行はしない。
- call,apply：this や引数の参照先を変更。同時に関数を実行する。

```
function a(name) {
    console.log('hello' + this.name);
}
const tim = {name: 'Tim'};

const b = a.bind(tim);
b(); // hello Tim

a.apply(tim); // hello Tim
a.call(tim); // hello Tim
```

- call：第 2 引数以下に関数の引数を定義できる（bind と似てる）
- apply：第 2 引数に配列で引数を定義できる

#### アロー関数

- アロー関数では this がセットされない
- [0404 参照](0404/main.js)
