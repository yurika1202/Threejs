// 即時関数で変数・関数のスコープを区別する
// -------------------------------------------
const a = (function () {
  let privateVal = 0;
  let publicVal = 10;

  function privateFn() {
    console.log("private");
  }
  function publicFn() {
    console.log("public");
  }

  return {
    publicVal,
    publicFn,
  };
})();

console.log(a.privateVal); // error
console.log(a.publicVal); // ok

a.privateFn(); // error
a.publicFn(); // ok

// クロージャーを使って、publicFn()を通してのみprivateValを触れるようにする
// ------------------------------------------------------------------------
const b = (function () {
  let privateVal = 0;

  function publicFn() {
    console.log(privateVal++); // publicFnのレキシカルスコープにprivateValが格納される
  }

  return {
    publicFn,
  };
})();

b.publicFn(); // 0
b.publicFn(); // 1
b.publicFn(); // 2
