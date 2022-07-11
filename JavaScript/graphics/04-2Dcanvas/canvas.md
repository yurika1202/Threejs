## 矩形（四角形）

- x：塗りつぶす矩形の左上角の X 座標
- y：塗りつぶす矩形の左上角の Y 座標
- w：塗りつぶす矩形の横幅
- h：塗りつぶす矩形の高さ

```
context.fillRect(x, y, w, h);
```

## 線分

- x1：線分の始点の X 座標
- y1：線分の始点の Y 座標
- x2：線分の終点の X 座標
- y2：線分の終点の Y 座標
- color：線を描画する色
- width=1：線幅

```
function drawLine(x1, y1, x2, y2, color, width = 1) {
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}
```

- beginPath：パス設定の開始
- moveTo：パスの始点の設定
- lineTo：直線パスを終点に向けて設定
- closePath：パスを閉じることを明示的に設定
- stroke：設定したパスで線描画をおこなう

## 円

- x：円弧の中心位置の X 座標
- y：円弧の中心位置の Y 座標
- radius：円弧の半径
- startAngle：円弧の始点角度（ラジアン）
- endAngle：円弧の終点角度（ラジアン）
- counterclockwise：円弧を描く向き（既定値は false）

```
ctx.arc(x, y, startAngle, endAngle, false);
```

## ベジェ曲線

**2 次**

- x：線分の始点の X 座標
- y：線分の始点の Y 座標
- x2：線分の終点の X 座標
- y2：線分の終点の Y 座標
- cx：制御点の X 座標
- cy：制御点の Y 座標
- color：線を描画する色
- width=1：線幅

```
function drawQuadraticBezier(x1, y1, x2, y2, cx, cy, color, width = 1)
```

**3 次**

- x：線分の始点の X 座標
- y：線分の始点の Y 座標
- x2：線分の終点の X 座標
- y2：線分の終点の Y 座標
- cx1：始点の制御点の X 座標
- cy1：始点の制御点の Y 座標
- cx2：終点の制御点の X 座標
- cy2：終点の制御点の Y 座標
- color：線を描画する色
- width=1：線幅

```
function drawCubicBezier(x1, y1, x2, y2, cx1, cy1, cx2, cy2, color, width = 1)
```

## テキスト

- text：描画するテキスト
- x：テキストを描画する X 座標
- y：テキストを描画する Y 座標
- color：テキストを描画する色
- width：テキストを描画する幅に上限を設定する際の上限値

```
function drawText(text, x, y, color, width)
```
