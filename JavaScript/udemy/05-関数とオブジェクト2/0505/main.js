function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.hello = function () {
  console.log("hello " + this.name);
};

// 関数Japaneseは関数personを継承している
function Japanese(name, age, gender) {
  Person.call(this, name, age);
  this.gender = gender;
}
Japanese.prototype = Object.create(Person.prototype);

Japanese.prototype.hello = function () {
  console.log("Konnichiwa " + this.name);
};
Japanese.prototype.bye = function () {
  console.log("Sayonara " + this.name);
};

// 上記コンストラクタ関数をクラスに書き換え
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  hello() {
    console.log("hello " + this.name);
  }
}

// クラスの継承にはextendsとsuperを使用する
class Japanese extends Person {
  constructor(name, age, gender) {
    // personのコンストラクタ関数を呼び出す
    super(name, age);
    this.gender = gender;
  }

  hello() {
    console.log("Konnichiwa " + this.name);
  }
  bye() {
    console.log("Sayonara " + this.name);
  }
}

const taro = new Japanese("Taro", 23, "Male");
