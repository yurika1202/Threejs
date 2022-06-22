// nextメソッドが呼ばれるたびにiが1ずつ増えていくイテレータ
function getIterator(max) {
  let i = 0;

  return {
    next: function () {
      return {
        done: false,
        value: i++,
      };
    },
  };
}
const it = getIterator();
console.log(it.next()); // {done: false, value:0}
console.log(it.next()); // {done: false, value:1}

// 上限値を設定してみる
function getIterator(max) {
  let i = 0;

  return {
    next: function () {
      if (i >= max) {
        return {
          done: true,
        };
      } else {
        return {
          done: false,
          value: i++,
        };
      }
    },
  };
}
const it2 = getIterator(10);
let a = it2.next();
while (!a.done) {
  console.log(a.value);
  a = it2.next();
}
