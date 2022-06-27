// WeakMapはexportされていないので、外部からアクセスできない
new wm = new WeakMap();

export class Person {
    constructor(name, age) {
        this._name = name;
        // インスタンス化されたオブジェクトのthisを元にして、
        // Personの中でのみ使用できるオブジェクトを定義
        wm.set(this, {
            name
        });
    }

    hello() {
        console.log(`hello ${wm.get(this).name}`);
    }
}
