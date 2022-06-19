window.name = "John";

// thisの参照先はグローバルオブジェクト = John
const a = () => console.log("Bye " + this.name);

const person = {
  name: "Tom",
  hello() {
    console.log("Hello " + this.name);
    // thisの参照先はpersonオブジェクト = Tom
    const a = () => console.log("Bye " + this.name);
    a();
  },
};
person.hello();

function b() {
  const a = () => console.log("Bye " + this.name);
  a();
}
b(); // ByeJohn
