// 動的な関数を生成する
// -------------------------------------------

function addNumberFactory(num) {
  function addNumber(val) {
    return num + value;
  }
  return addNumber;
}

const add5 = addNumberFactory(5); // numに5が設定されている状態のaddNumber関数を格納
const result = add5(10); // valに10を設定
console.log(result);
// addNumberFactoryに渡す値によって結果が変わる
