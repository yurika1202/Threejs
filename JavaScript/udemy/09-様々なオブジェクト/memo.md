### Proxy

- プロパティの操作に独自の処理を追加することができる

```
new Proxy(ターゲットオブジェクト, オブジェクト操作時に実行されるメソッドが格納されているオブジェクト)
```

- [参照：0901](0901/main.js)

### Reflect

- JS エンジン内部の汎用的な関数を呼び出すメソッドが格納されているオブジェクト
- Proxy と合わせて使われる
- [参照：0902](0902/main.js)

- Proxy のハンドラから渡ってくる引数は、Reflect でも使用できる
- ex.Reflect の第三引数に get の receiver を指定して参照先を proxy オブジェクトに束縛するなど...

### WeakMap

- 弱い参照でオブジェクトを保持するコレクション
- キーは必ずオブジェクトを設定する必要がある
- オブジェクトと値を対で管理することができる
- キーで使用しているオブジェクトが削除されると、WeakMap に格納されているキーと値のペアも自動的に削除される＝ガベージコレクション
- for...of などの反復処理は使えない（＝ Map を使う）
- [参照：0903](0903/main.js)

**プライベート変数**

- アンダースコアからはじまる変数はプライベート変数と暗黙的に明示されている＝外部からアクセスされたくない
- インスタンス化されたオブジェクトごとに this の参照先が変わる
- [参照：0904](0904/person.js)

### JSON

- JSON は文字列
- JSON.parse：JSON -> Object
- JSON.stringify：Object -> JSON

### Storage

- ブラウザの保存領域にデータを格納するためのオブジェクト＝ localStorage

```
localStorage.setItem('key', 'value');
const result = localStorage.getItem('key');
console.log(result); // value
```

- 開発者ツール -> Application -> LocalStorage で確認できる

### 配列

```
arry.push(6); // 配列の末尾に値を格納
arry.pop(); // 配列の末尾の値を削除
arry.shift(); // 配列の先頭の値を削除
arry.unshift(); // 配列の先頭に値を格納
arry.splice(0, 3); // 指定した長さ分の値を切り取る
arry.splice(0, 3, 1, 2); // 第三引数以降は切り取った箇所に代入する値
const arry2 = [0, ...arry, 6, 7, 8]; // 配列の結合
```
