class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  hello(person) {
    console.log(`${this.name} says hello ${person.name}`);
  }

  introduce() {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old.`);
  }

  shakeHands(person) {
    console.log(`${this.name} shake hands with ${person.name}.`);
  }

  bye(person) {
    console.log(`Goodbye, ${person.name}.`);
  }
}

const bob = new Person("Bob", 23);
const tim = new Person("Tim", 33);

bob.hello(tim);
bob.introduce();
bob.shakeHands(tim);
bob.bye(tim);

// 上記をチェーンメソッドへ書き換える
// インスタンスをメソッドとして返す
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  hello(person) {
    console.log(`${this.name} says hello ${person.name}`);
    return this; // コンストラクタ関数から作成したオブジェクトを返す
  }

  introduce() {
    console.log(`Hi, I'm ${this.name}, ${this.age} years old.`);
    return this;
  }

  shakeHands(person) {
    console.log(`${this.name} shake hands with ${person.name}.`);
    return this;
  }

  bye(person) {
    console.log(`Goodbye, ${person.name}.`);
    return this;
  }
}

bob.hello(tim).introduce().shakeHands(tim).bye(tim);
