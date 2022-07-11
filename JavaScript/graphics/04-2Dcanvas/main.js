const canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
(() => {
  window.addEventListener(
    "load",
    () => {
      init();
      render();
    },
    false
  );

  // canvasやコンテキストの初期化
  function init() {}

  // 描画
  function render() {
    // 矩形
    drawRect(50, 50, 100, 100, "#000");

    // 線分
    drawLine(100, 100, 200, 200, "#ff0000");

    // 多角形
    let points = [
      50,
      200, //左上
      150,
      200, // 右上
      50,
      400, // 左下
      150,
      400, // 右下
    ];
    drawPolygon(points, "#119900");

    // ランダム座標の多角形
    const pointCount = 5;
    let randomPoints = [];
    for (let i = 0; i < pointCount; i++) {
      randomPoints.push(generateRandomInt(300), generateRandomInt(300));
    }
    drawPolygon(randomPoints, "#119900");

    // 円
    drawCircle(300, 200, 50, "#000");

    // 円弧
    let startRadian = Math.random() * Math.PI * 2.0;
    let endRadian = Math.random() * Math.PI * 2.0;
    drawFan(200, 200, 100, startRadian, endRadian, "#110099");

    // ベジェ曲線
    drawQuadraticBezier(50, 500, 50, 800, 200, 750, "#000");
    drawCubicBezier(300, 500, 300, 800, 400, 550, 600, 600, "#000");

    // テキスト
    ctx.font = "bold 30px cursive"; // フォントスタイルの設定
    ctx.textBaseline = "alphabetic"; // ベースラインの設定
    ctx.textAlign = "start"; // 文字寄せの設定
    ctx.shadowBlur = 5; // 以下ドロップシャドウ
    ctx.shadowColor = "#666";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    drawText("グラフィックスプログラミング", 300, 100, "#ff00aa", 150);
  }

  // 矩形の描画
  function drawRect(x, y, width, height, color) {
    if (color != null) {
      ctx.fillStyle = color;
    }
    ctx.fillRect(x, y, width, height);
  }

  // 線分の描画
  function drawLine(x1, y1, x2, y2, color, width = 1) {
    if (color != null) {
      ctx.strokeStyle = color;
    }
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

  // 多角形の描画
  function drawPolygon(points, color) {
    if (Array.isArray(points) !== true || points.length < 6) {
      return;
    }
    if (color != null) {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    // 各頂点を結ぶパスの設定
    for (let i = 2; i < points.length; i += 2) {
      ctx.lineTo(points[i], points[i + 1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ランダムな多角形
  function generateRandomInt(range) {
    let random = Math.random();
    return Math.floor(random * range);
  }

  // 円の描画
  function drawCircle(x, y, radius, color) {
    if (color != null) {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0.0, Math.PI * 2.0); // 360度＝2π
    ctx.closePath();
    ctx.fill();
  }

  // 円弧の描画
  function drawFan(x, y, radius, startRadian, endRadian, color) {
    if (color != null) {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, startRadian, endRadian);
    ctx.closePath();
    ctx.fill();
  }

  // ベジェ曲線（２次）
  function drawQuadraticBezier(x1, y1, x2, y2, cx, cy, color, width = 1) {
    if (color != null) {
      ctx.strokeStyle = color;
    }
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

  // ベジェ曲線（３次）
  function drawCubicBezier(
    x1,
    y1,
    x2,
    y2,
    cx1,
    cy1,
    cx2,
    cy2,
    color,
    width = 1
  ) {
    if (color != null) {
      ctx.strokeStyle = color;
    }
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
    ctx.closePath();
    ctx.stroke();
  }

  // テキスト
  function drawText(text, x, y, color, width) {
    if (color != null) {
      ctx.fillStyle = color;
    }
    ctx.fillText(text, x, y, width);
  }
})();
