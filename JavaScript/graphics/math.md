## 弧度法（ラジアン）

- 円周の長さを基準とした角度の表現
- 360 度＝円周率(π)×2（＝約 6.28）
- 円の半径に等しい長さの弧を 1 ラジアンとしたもの、ともいえる（1 ラジアン＝半径）

```
// ラジアン変換
function degToRad(degrees) {
  return (degrees / 360) * (Math.PI / 180);
}

// 最適化
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}
```

## sin と cos

- 半径 1 の円を基準として、ある点 P の座標は(cosθ, sinθ)となる
- sin や cos の値は常に-1 ～ 1 の範囲に収まる
- 半径が 1 でない円で求める場合には、その半径の値をそのまま sin や cos の値に乗算することで縦横それぞれの長さを計算できる

ex. 基準点 A の座標(x, y)から θ の方向へｒ移動した位置 B の座標(x', y')を求める

```
let A = [0.0, 0.0];
let radian = degToRad(theta);
let sin = Math.sin(radian);
let cos = Math.cos(radian);
let B = [
  A[0] + cos * r,
  A[1] + sin * r
];
```
