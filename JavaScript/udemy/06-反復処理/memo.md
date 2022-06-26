### ループ文

- ループ文にはブロックスコープが適用される

### for...in

- 列挙可能プロパティーに対して順不同で反復処理を実行する
- プロトタイプチェーン内も列挙対象となる
- 自身のプロパティのみ列挙したい場合は、Object.hasOwnProperty()を使用
- Symbol で定義したプロパティは列挙対象外

```
const obj = {
	prop1: 'value1',
	prop2: 'value2',
	prop3: 'value3',
}

for(let key in obj) {
	console.log(key, obj[key]);
}
// key=プロパティ、obj[key]=値
```

### for...of

- イテレーターを持ちオブジェクトの反復操作を行う
- イテレーター：反復操作可能オブジェクト（String,Array,Map,Set...）

### Map と Set

- データを管理するための入れ物（＝コレクション）

```
const map = new Map();
const key1 = {}

map.set(key1, 'value1');
console.log(map.get(key1)); // value1
```

- オブジェクト以外にも関数、数値などでもおｋ

```
map.delete(key1);
console.log(map.get(key1)); // undefined
```

- delete で削除
- for...of での反復処理は [0601 参照](0601/main.js)

### イテレーター

- 反復操作を行う際に使用するオブジェクトで、決められたルールに則って記述する

```
function getIterator() {
	// returnで返却されているオブジェクトがイテレーター
	return {
		// nextメソッドを保持している必要があり、オブジェクトを返す
		next: function() {
			return {
				done: true / false, // ループを継続するかどうか
				value: 値 // 返却する値
			}
		}
	}
}
```

- [0602 参照](0602/main.js)

### ジェネレーター

- イテレーターを生成するための特殊な関数

```
function* gen() {
	if(ループ継続) {
		yield 値; // done:false, value:値
	} else {
		return 値; // done:true, value:値
	}
}
```

### スプレッド演算子

- 反復可能や列挙可能オブジェクトの展開を行う

```
let a = [...array]
```

- 関数の引数に用いることで、可変長の引数を配列に修正して渡すことができる

```
function sum(...args) {
	let ret = 0;
	for(let v of args) {
		ret += v;
	}
	return ret;
}
const result = sum(1,2,3);
console.log(result); // 6
```
