window.name = "John";

const person = {
  name: "Tom",
  hello: function () {
    console.log("Hello " + this.name);
  },
};

// bindでpersonオブジェクトへの参照を固定
const helloTom = person.hello.bind(person);

function fn(ref) {
  ref();
}

fn(helloTom); // HelloTom
