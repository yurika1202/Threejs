const targetObj = { a: 0 };

const handler = {
  // set：トラップ。プロパティの設定が可能。
  // https://qiita.com/irico/items/86a03db80bb081f59519
  set: function (target, prop, value, receiver) {
    console.log(`[set]: ${prop}`);
    target[prop] = value;
    // 実用：値の追加ができないようにする
    throw new Error("cannot add prop.");
  },
  get: function (target, prop, receiver) {
    console.log(`[get]: ${prop}`);
    // return target[prop];

    // 実用：値がない場合にデフォ値を渡す
    if (target.hasOwnProperty(prop)) {
      return target[prop];
    } else {
      return "-1";
    }
  },
  deleteProperty: function (target, prop) {
    console.log(`[delete]: ${prop}`);
    delete [prop];
  },
};
const pxy = new Proxy(targetObj, handler);
// pxy.a = 1;
pxy.a;
pxy.b;
console.log(pxy.b);
delete pxy.a;
