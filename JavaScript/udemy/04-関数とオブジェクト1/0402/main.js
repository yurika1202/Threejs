window.name = "John";

const person = {
  name: "Tom",
  hello: function () {
    console.log("Hello " + this.name);
  },
};

// コールバック関数の作成
function fn(ref) {
  ref();
}
// コールバック関数の引数にhelloメソッドを指定
fn(person.hello); // HelloJohn
// メソッドを他の変数に代入していることと同じ意味になる
// つまりrefにはperson.helloが参照している先の関数が渡されている
// 関数の実行＝グローバルオブジェクトを参照
