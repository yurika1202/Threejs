// returnの値がオブジェクトの場合
function F(a, b) {
  this.a = a;
  this.b = b;
  return {};
}
const instance = new F(1, 2);
console.log(instance); // {}

// returnの値がオブジェクト以外の場合
function F(a, b) {
  this.a = a;
  this.b = b;
  return 1; // またはreturnなしでも同じ挙動
}
const instance2 = new F(1, 2);
console.log(instance2); // F{a:1, b:2}

// returnの値がオブジェクト以外 + prototypeがある場合
function F(a, b) {
  this.a = a;
  this.b = b;
  return 1; // またはreturnなしでも同じ挙動
}
F.prototype.c = function () {};
const instance3 = new F(1, 2);
console.log(instance3); // F{a:1, b:2} __proto__にcが格納
// returnがオブジェクトの場合はメソッドも存在しない

// new演算子と同じ動きをする関数をつくってみる
function newOpe(C, ...args) {
  // 渡されたコンストラクタ関数のprototypeをコピーして空のオブジェクトを作成
  const _this = Object.create(C.prototype);
  // 空のオブジェクトのthisをCのthisにする
  const result = C.apply(_this, args); // args＝Cを実行するときの引数を配列で渡す
  console.log(typeof result);
  if (typeof result === "object" && result !== null) {
    return result;
  }
  return _this;
}
const instance4 = newOpe(F, 1, 2);
console.log(instance4); // F{a:1, b:2} __proto__にcメソッドが格納
