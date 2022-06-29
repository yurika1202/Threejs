### 同期処理と非同期処理

- メインスレッド：JS の実行とレンダリングを行う、多忙
- FPS：1 秒あたりの画面（フレーム）更新頻度
- 同期処理：メインスレッドでコードが順番に実行される  
  ＝時間のかかる処理があったとしても、すべてが終わってから次の処理を実行する
- 非同期処理：一時的にメインスレッドから処理が切り離される  
  ＝一つ一つの処理を待たずに、同時に複数の処理動かす
  **非同期 API**
- setTimeout
- Promise
- queueMicrotask ...

### タスクキューとコールスタック

- タスクキュー：実行待ちの非同期処理の行列＝非同期処理の実行順を管理
- キューの仕組みを「先入れ先出し」という＝ FIFO

### Promise

- 非同期処理をより簡単に、可読性が上がるように書けるようにしたもの

```
new Promise (function(resolve, reject) {
    resolve("hello");
    reject("bye");
}).then (function(date) {
    console.log(date); // -> hello
}).catch (function(date) {
    console.log(date); // -> bye
}).finally (
    console.log("共通の終了処理");
);
```

つまり…

```
new Promise(
    同期処理
) .then (
    非同期処理（resolveを待つ）
) .catch (
    非同期処理（rejectを待つ）
) .finally (
    非同期処理（then、またはcatchを待つ）
);
```

- finally に引数を渡すことはできない

### プロミスチェーン

- Promise を使って非同期処理を順次実行すること
- then メソッドチェーンを繋ぐ場合にはコールバック関数に Promise のインスタンスを返してあげること

### Promise の並列処理

- all：反復可能オブジェクトを引数に取り、すべての処理が完了したのちに次の then へ処理が移る
- race：反復可能オブジェクトの中のどれかひとつの処理が完了された時点で次の then へ処理が移る
- allsettled： promise のステータスが渡される

### Macrotasks と Microtasks

- マクロタスク：これまでタスクキューと呼んでいたもの（setTimeout、setInterval、requestAnimationFrame...）
- マイクロタスク：タスクキューとは別に存在する、非同期処理の待ち行列＝ジョブキュー（Promise、queueMicrotask、MutationObserver...）
- それぞれ順番がまわってきたら、マクロタスクはすべてのジョブを実行するが、マイクロタスクはひとつずつしか実行しない

### await/async

- Promise を直感的に記述できるようにしたもの
- 通常の非同期は処理開始するとそれを待たずに次の処理を行うが、async/await は「前の非同期の処理が終わったら次の処理を実行」を実現する
- Async：Promise を返却する関数宣言を行う
- Await：Promise を返却する関数の非同期処理が完了するまで待つ

```
async function displayMessage() {
    const response = await fetch('./...');
    const date = await response.json();
    ...
}
```

1. await をつけて fetch 関数を呼んで通信が終わるのを待ち、その結果を response 変数へ返す
2. await をつけて response.json 関数を呼んで変換処理を待ち、その結果を date 変数へ返す
3. その以降の処理を行う（DOM 操作など）

### fetch

- サーバー上からデータを取得したりできる
- Promise のオブジェクトを返す

### 例外処理

- エラーが発生した際に飛ぶ特別な処理

```

try {
throw new Error(); // これが投げられると catch へ処理が移る
} catch(e) {
// エラーハンドリング
} finally {
// 終了処理
}

```

```

```
