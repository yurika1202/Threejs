class Canvas2DUtility {
  constructor(canvas) {
    this.canvasElement = canvas;
    this.context2D = canvas.getContext("2d");
  }

  get canvas() {
    return this.canvasElement;
  }
  get context() {
    return this.context2D;
  }

  // 矩形の描画
  drawRect(x, y, width, height, color) {
    if (color != null) {
      this.context2D.fillStyle = color;
    }
    this.context2D.fillRect(x, y, width, height);
  }

  // 線分の描画
  drawLine(x1, y1, x2, y2, color, width = 1) {
    if (color != null) {
      this.context2D.strokeStyle = color;
    }
    this.context2D.lineWidth = width;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.lineTo(x2, y2);
    this.context2D.closePath();
    this.context2D.stroke();
  }

  // 多角形の描画
  drawPolygon(points, color) {
    if (Array.isArray(points) !== true || points.length < 6) {
      return;
    }
    if (color != null) {
      this.context2D.fillStyle = color;
    }
    this.context2D.beginPath();
    this.context2D.moveTo(points[0], points[1]);
    // 各頂点を結ぶパスの設定
    for (let i = 2; i < points.length; i += 2) {
      this.context2D.lineTo(points[i], points[i + 1]);
    }
    this.context2D.closePath();
    this.context2D.fill();
  }

  // ランダムな多角形
  generateRandomInt(range) {
    let random = Math.random();
    return Math.floor(random * range);
  }

  // 円の描画
  drawCircle(x, y, radius, color) {
    if (color != null) {
      this.context2D.fillStyle = color;
    }
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0.0, Math.PI * 2.0); // 360度＝2π
    this.context2D.closePath();
    this.context2D.fill();
  }

  // 円弧の描画
  drawFan(x, y, radius, startRadian, endRadian, color) {
    if (color != null) {
      this.context2D.fillStyle = color;
    }
    this.context2D.beginPath();
    this.context2D.moveTo(x, y);
    this.context2D.arc(x, y, radius, startRadian, endRadian);
    this.context2D.closePath();
    this.context2D.fill();
  }

  // ベジェ曲線（２次）
  drawQuadraticBezier(x1, y1, x2, y2, cx, cy, color, width = 1) {
    if (color != null) {
      this.context2D.strokeStyle = color;
    }
    this.context2D.lineWidth = width;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.quadraticCurveTo(cx, cy, x2, y2);
    this.context2D.closePath();
    this.context2D.stroke();
  }

  // ベジェ曲線（３次）
  drawCubicBezier(x1, y1, x2, y2, cx1, cy1, cx2, cy2, color, width = 1) {
    if (color != null) {
      this.context2D.strokeStyle = color;
    }
    this.context2D.lineWidth = width;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
    this.context2D.closePath();
    this.context2D.stroke();
  }

  // テキスト
  drawText(text, x, y, color, width) {
    if (color != null) {
      this.context2D.fillStyle = color;
    }
    this.context2D.fillText(text, x, y, width);
  }

  // 画像の描画
  imageLoader(path, callback) {
    let target = new Image();
    target.addEventListener(
      "load",
      () => {
        if (callback != null) {
          callback(target);
        }
      },
      false
    );
    target.src = path;
  }
}
