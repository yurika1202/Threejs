// returnの値がオブジェクト以外の場合
function F(a, b) {
  this.a = a;
  this.b = b;
}
F.prototype.c = function () {};
const instance = new F(1, 2);
console.log(instance instanceof F); // true

// returnの値がオブジェクトの場合
function F(a, b) {
  this.a = a;
  this.b = b;
  return { a: 1 };
}
F.prototype.c = function () {};
const instance2 = new F(1, 2);
console.log(instance2 instanceof F); // false

// instanseofが内部でしていること
console.log(instance.__proto__ === F.prototype);

// 実際の使用例
function fn(arg) {
  if (arg instanceof Array) {
    arg.push("value");
  } else {
    arg["key"] = "value";
  }
  console.log(arg);
}
fn([]); // ['value']
fn({}); // {key: 'value'}
