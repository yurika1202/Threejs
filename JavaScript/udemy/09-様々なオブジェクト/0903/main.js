const wm = new WeakMap();

let o = {};
wm.set(o, 'value1');

console.log(wm.get(o)); // value1

// オブジェクトを削除すると、二度と参照できない
o = null; // 削除
o = {};
console.log(wm.get(o)); // undefined

// hasメソッド：oというキーがWeakMaoに存在するか
console.log(wm.has(o)); // true

// deleteメソッド：oのキーと値を意図的に削除
console.log(wm.delete(o));
console.log(wm.get(o)); // undefined
