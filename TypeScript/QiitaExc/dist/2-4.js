"use strict";
function giveId(obj) {
  const id = "本当はランダムがいいけどここではただの文字列";
  return {
    ...obj,
    id,
  };
}
// 使用例
const obj1 = giveId({ foo: 123 });
const obj2 = giveId({
  num: 0,
  hoge: true,
});
// エラー例
// const obj3: {
//   id: string;
//   piyo: string;
// } = giveId({
//   foo: "bar",
// });
