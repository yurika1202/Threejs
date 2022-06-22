const map = new Map();

const key1 = {};
map.set(key1, "value1");

const key2 = function () {};
map.set(key2, "value2");

// for...ofでmapの値を取得してみる
for (const [k, v] of map) {
  console.log(k, v); // {} "value1" f(){} "value2"
}

// setした値をfor...ofで取得してみる
const s = new Set();
s.add(key1);
s.add(key1);

for (let k of s) {
  console.log(k); // {}
}
// setは重複したキーは持てないので２つ目のkey1のみ返ってくる
