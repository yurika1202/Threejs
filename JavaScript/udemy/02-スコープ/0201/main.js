// 関数呼び出す度に数字を1ずつ足していきたい
// -----------------------------------------------

// NG
// 関数呼び出す度にnum=0が適用されるため数字が足されない
function increment() {
  let num = 0;
  num += 1;
  console.log(num);
}
increment(); // 1
increment(); // 1
increment(); // 1

// NG_2
// 数字は足されるが、numがどこからでも値の上書きが可能になってしまっている
let num2 = 0;
function increment() {
  num2 += 1;
  console.log(num2);
}
increment(); // 1
increment(); // 2
increment(); // 3
num2 = 0;
increment(); // 1 ←

// クロージャーを使って、外部からnumの上書きが出来ないようにする
function incrementFactory() {
  let num = 0;

  function increment() {
    num += 1;
    console.log(num);
  }

  return increment; // incrementFactoryにincrement関数を返す
}
const increment = incrementFactory();
increment(); // 1 (returnで関数自体を返しているので関数実行()が必要)
increment(); // 2
increment(); // 3
