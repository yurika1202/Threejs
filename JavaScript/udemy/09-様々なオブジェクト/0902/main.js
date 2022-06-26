class C {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

// インスタンス化
const obj1 = Reflect.construct(C, [1, 2]); // const obj1 = new C(1, 2);

// プロパティ所持の確認
// メリットはコールバック関数などに直接渡せる（関数として扱える）
console.log(Reflect.has(obj1, "c")); // console.log('c' in obj1);

// 静的メソッド（インスタンス化なしで使用できるメソッド）の扱い
// ES6からはObjectは非推奨、Reflectの方が利便性が高い
Reflect.defineProperty; // Object.defineProperty

const bob = {
  name: "Bob",
  _hello: function () {
    console.log(`hello ${this.name}`);
  },
};

const tom = {
  name: "Tom",
  _hello: function () {
    console.log(`hello ${this.name}`);
  },
  get hello() {
    return this._hello();
  },
};
tom.hello;
// Reflectに書き直すと…
Reflect.get(tom, "hello"); // hello Tom
// 第三引数のreceiverはbindのように参照先を束縛する
Reflect.get(tom, "hello", bob); // hello Bob
