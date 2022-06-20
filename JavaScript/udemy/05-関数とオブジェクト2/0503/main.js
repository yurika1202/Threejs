function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.hello = function () {
  console.log("hello " + this.name);
};

// 上記Personコンストラクタ関数を流用したい！
function Japanese(name, age, gender) {
  Person.call(this, name, age); // このthisはJapanese関数コンテキストのthis、このthisがPersonに渡されていく
}
// PersonのprototypeがJapaneseのprototypeの中に含まれるprototypeとなる
Japanese.prototype = Object.create(Person.prototype);
const taro = new Japanese("Taro", 23);
console.log(taro); // Japanese{name:Taro. age:23} __proto__にhelloメソッド
taro.hello(); // hello Taro

Japanese.prototype.hello = function () {
  console.log("Konnichiwa " + this.name);
};

Japanese.prototype.bye = function () {
  console.log("Sayonara " + this.name);
};

taro.bye();
