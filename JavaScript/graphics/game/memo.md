## setTimeout と setInterval

- 一定時間をおいて処理を実行するためのタイマー機能を持った関数で、どちらも第一引数には指定時間経過後に呼び出す関数を、第二引数にはタイマー時間を指定する
- setTimeout：一度だけ実行
- setInterval：繰り返し実行

## Canvas2D での回転表現

- 回転表現は Canvas 上の座標全体を回転させる rotate メソッドを使うが、左上角が原点となっているので直感的ではない回転が実行される
- 原点を意識して処理をするためには、Canvas 上の座標を平行移動させる translate メソッドを併用する
- Canvas の座標を触っているとき、描画はされていないことに注意
- これらは根本的に座標を変化させてしまうので、save メソッド（メソッドが呼び出された時の状態を保存）と restore メソッド（save で積み上げられたスタックをひとつずつ取り出して復元する）を使って座標操作を元の状態へ戻す

## Math.PI \* 1.5 ＝ 度数法の 270 度

- 半径 1 の円の円周は 2π であり、度数法の 360 度＝弧度法の 2π となる
- 270 度は 360 度の 3/4 なので、2π の 3/4 となる

## 衝突判定

### 点と矩形の場合

- 点 P(x, y)と矩形 R(left(x), top(y), width, height)があるとする
- まず X のみに焦点をあて、現在地がスタート地から衝突地点までの間に含まれているかどうかを判定（START <= X <= END）
- START は矩形の left、END は矩形の left + width にあたる

```
let isCollection = (P.x >= R.left) && (P.x <= R.left + R.width);
```

- Y についても同様に考えることができ、以下のようになる

```
let isCollection = (
  (P.x >= R.left) &&
  (P.x <= R.left + R.width) &&
  (P.y >= R.top) &&
  (P.y <= R.top + R.height)
)
```

### 矩形と矩形の場合

- 矩形 R(left(x), top(y), width, height)と矩形 S(left(x), top(y), width, height)があるとする
- この場合もまずは X のみに焦点をあて、矩形 S の START から END の間に矩形 R の START か END のいずれかが含まれているかを判定（矩形 R の START 点と END 点のどちらかが矩形 S の中に入っていれば衝突判定）

```
let isCollection = (
  (R.left >= S.left && R.left <= S.left + S.width) ||
  (R.left + R.width >= S.left && R.width <= S.left + S.width)
)
```

- ||（論理和）を使うのは、矩形 R の START（左端）か矩形 R の END（右端）のどちらかが矩形 S の範囲に含まれるかどうかを調べているから
- Y も同様に考えると以下のようになる

```
let isCollection = (
  (R.left >= S.left && R.left <= S.left + S.width) ||
  (R.left + R.width >= S.left && R.width <= S.left + S.width)
) && (
  (R.top >= S.top && R.top <= S.top + S.height) ||
  (R.top + R.height >= S.top && R.height <= S.top + S.height)
)
```

### 円と円の場合（ベクトルを利用）

- 矩形との衝突判定の場合、画像の大きさをそのままキャラクターの大きさとしていたら直感に反する結果になったり、矩形が回転していたら上手く衝突判定が行えないのでベクトルを利用する
- 2 点の座標を始点と終点と考えベクトルとして距離を測る（＝円の半径）
- 2 つの円の半径を加算して合計を求め、求めた半径の合計値と 2 点間の距離を比較する
- 半径の合計 > 2 点間の距離が成り立てば、2 つの円は重なっているということになる

### ease-in から ease-out

- ゲーム内で定義した ease-in 関数において、ease-out で実装したいとき新たに関数を作成する必要はない

```
function easeIn(t) {
  return t * t * t * t;
}

// ease-outで実装
let ease = easeIn(1.0 - 任意の値);
```

- ease-in が 0.0 から 1.0 へ値が遷移すると考えたとき、1.0 から 0.0 へ遷移するように変えれば ease-out の動きになる
- つまり 1.0 から減算することで可能
