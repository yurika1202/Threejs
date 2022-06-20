window.name = "John";

const person = {
  name: "Tom",
  hello: function () {
    console.log("Hello " + this.name);
  },
};
// 変数refにメソッドを格納
// thisの参照先がpersonオブジェクトではなく、グローバルオブジェクトへ変わる
const ref = person.hello;
ref(); // Hello John

// パターン2
function a() {
  console.log("Hello " + this.name);
}
const person2 = {
  name: "Tom",
  hello: function () {
    console.log("Hello " + this.name);
    a();
  },
};
person2.hello(); // HelloTom（helloメソッド） HelloJohn（関数a）
