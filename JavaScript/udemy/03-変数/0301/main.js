const a = {
  prop: 0,
};
let { prop } = a;
prop = 1;
console.log(a, prop); // {prop:0} 1

// 関数と絡める
// -----------------------------
// 特定のプロパティを使用する場合は引数にオブジェクトを直接指定することで、
// 渡された時点で分割代入で展開されてpropという変数が使用できる状態になる
function fn({ prop }) {
  prop = 1;
  console.log(a, prop);
}
fn(a); // {prop:0} 1

// オブジェクトが高階層の場合
// コピー元のオブジェクトにも影響がでる
const c = {
  prop1: {
    prop2: 0,
  },
};
let { prop1 } = c; // prop1のオブジェクトへの参照が格納される
prop1.prop2 = 1;
console.log(c, prop1); // {prop1:{prop2:1}} {prop2:1}
