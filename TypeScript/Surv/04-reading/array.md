## 配列

- Type[]と Array<T>の 2 種類の書き方がある

```
// Type[]
let array: number[];
array = [1, 2, 3];

// Array<T>
let array: Array<number>;
array = [1, 2, 3];
```

- 配列はオブジェクトなので、中身が同じでもインスタンスが異なっていれば比較はできない

### 要素の型

- Type[]型の配列から要素を取り出したとき、その値の型は Type になる

```
const abc: string[] = ["a", "b", "c"];
const character: string = abc[0]; // 型はstring
```

- 存在しない要素にアクセスした場合にエラーを表示させるには、`noUncheckedIndexedAccess`のコンパイラオプションを有効にする

```
const abc: string[] = ["a", "b", "c"];
const character: string |undefined = abc[0];
character.toUpperCase(); // error

// 上記だと文字列型のメソッドが使えないのでif文で条件をつける
const abc: string[] = ["a", "b", "c"];
const character = abc[0];
if(typeof character === "string") {
  character.toUpperCase();
}
```

## readonly

- readonly T[]と ReadonlyArray<T>の 2 種類の書き方がある

```
// readonly T[]
const nums: readonly number[] = [1, 2, 3];

// ReadonlyArray<T>
const nums: ReadonlyArray<number> = [1, 2, 3];
```

- 破壊的操作をする push や pop メソッドがコンパイルエラーになるが、該当メソッドを削除しているわけではないので JS 実行時には該当メソッドは残っている＝読み取り専用としても、配列の書き換えは可能
- 読み取り専用配列を配列に代入するのはコンパイルエラーになるが、どうしても代入したいときには型アサーション（型推論の上書き機能）を使う

```
const readonlyNumbers: readonly number[] = [1, 2, 3];
const writableNumbers: number[] = readonlyNumbers as number[];
```

- 普通の配列を読み取り専用配列に代入することは可能

## 分割代入

```
const oneToFive = [1, 2, 3, 4, 5];
const [one, two, three] = oneToFive;
console.log(one); // 1
```

- 存在しない要素への分割代入は undefined が代入される
- 値の型は T[]の配列は T 型になるが、`noUncheckedIndexedAccess`を有効にしている場合の型は`number |undefined`になる

```
const oneToFive = [1, 2, 3, 4, 5];
const [one, two, three] = oneToFive;
const num: number = one; // error
// oneはnumber |undefinedになり、numberには代入できない
```

- ネストした配列の場合は、ネスト構造を一致する分だけブラケットを重ねる
- 先頭からではなく途中要素を取り出すには、不要要素の数だけカンマを書く
- 配列の残りの部分（残余部分）を取り出すには、残余パターン（...）を用いる

## 配列操作

- 非破壊的操作：配列の変更をともわない
  |メソッド|操作|
  |---|---|
  |concat|2 つ以上の配列を結合した配列を返す|
  |find|提供されたテスト関数を満たす配列内の最初の要素を返す|
  |findIndex|配列内の指定されたテスト関数を満たす最初の要素の位置を返す|
  |lastIndexOf|配列中で与えられた要素が見つかった最後のインデックスを返す|
  |slice|配列の一部を切り出して返す|
  |includes|配列に任意の要素が含まれているかを true か false で返す|
  |indexOf|引数に与えられた内容と同じ内容を持つ最初の配列要素のインデックスを返す|
  |join|全要素を連結した文字列を返す|
  |keys|配列のインデックスを Array Iterator オブジェクトで返す|
  |entries|配列のインデックスと値のペアを Array Iterator オブジェクトで返す|
  |values|配列の値を Array Iterator オブジェクトで返す|
  |forEach|与えられた関数を、配列の各要素に対して一度ずつ実行する|
  |filter|与えられた関数によって実装されたテストに合格したすべての配列からなる新しい配列を返す|
  |flat|すべてのサブ配列の要素を指定した深さで再帰的に結合した新しい配列を返す|
  |flatMap|最初にマッピング関数を使用してそれぞれの要素をマップした後、結果を新しい配列内にフラット化する|
  |map|与えられた関数を配列のすべての要素に対して呼び出し、その結果からなる新しい配列を返す|
  |every|列内のすべての要素が指定された関数で実装されたテストに合格するかどうかをテストする|
  |some|配列の少なくともひとつの要素が、指定された関数で実装されたテストに合格するかどうかをテストする|
  |reduce|配列のそれぞれの要素に対してユーザーが提供した「縮小」コールバック関数を呼び出す|
  |reduceRight|アキュームレーターと配列のそれぞれの値に対して (右から左へ) 関数を適用して、単一の値にする|
- 破壊的操作：配列の内容や要素の順番を変更する操作をともなう
  |メソッド|操作|
  |---|---|
  |push|配列の末尾に要素を追加する|
  |unshift|配列の最初に要素を追加する|
  |pop|配列から最後の要素を取り除き、その要素を返す|
  |shift|配列から最初の要素を取り除き、その要素を返す|
  |splice|要素を取り除いたり、置き換えたり、新しい要素を追加する|
  |sort|配列の要素をソートする|
  |reverse|配列の要素を逆順に並び替える|
  |fill|開始インデックスから終了インデックスまでのすべての要素を、静的な値に変更した配列を返す|
  |copyWithin|サイズを変更せずに、配列の一部を同じ配列内の別の場所にシャローコピーして返す|
- 破壊的操作を行う場合には、スプレッド構文で配列をコピーしてから行うこと

## タプル

- 複数の値を保持することができる型

```
function tuple(): [number, string, boolean] {
  ...
  return [1, "ok", true];
}
```

- タプルを受けた変数は、そのまま中の型がもっているプロパティとメソッドを使用できる
- 範囲外の要素にはアクセスできないので、push などで要素を増やしたとしてもその要素を使うことはできない
- 並列での非同期処理（Promise.all()）を行うときに活躍
