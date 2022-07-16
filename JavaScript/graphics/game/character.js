// 座標管理クラス
class Position {
  constructor(x, y) {
    this.x = null;
    this.y = null;
    this.set(x, y);
  }

  set(x, y) {
    if (x != null) {
      this.x = x;
    }

    if (y != null) {
      this.y = y;
    }
  }
}

// キャラクターベースクラス（座標、キャラクターサイズ、生存フラグ、描画）
class Character {
  constructor(ctx, x, y, w, h, life, imagePath) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.width = w;
    this.height = h;
    this.life = life;

    // 画像の読み込み
    this.ready = false; // 読み込みフラグ
    this.image = new Image();
    this.image.addEventListener(
      "load",
      () => {
        this.ready = true;
      },
      false
    );
    this.image.src = imagePath;
  }

  draw() {
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    this.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }
}

// viper管理クラス
class Viper extends Character {
  constructor(ctx, x, y, w, h, image) {
    super(ctx, x, y, w, h, 0, image);
    this.speed = 3;
    this.isComing = false;
    this.comingStart = null;
    this.comingStartPosition = null;
    this.comingEndPosition = null;
    this.shotArray = null;
    this.shotCheckCounter = 0; // ショットの射出間隔
    this.shotInterval = 10; // ショットの生成間隔（10フレーム毎に1つのショット）
  }

  setComing(startX, startY, endX, endY) {
    this.isComing = true;
    this.comingStart = Date.now();
    this.position.set(startX, startY);
    this.comingStartPosition = new Position(startX, startY);
    this.comingEndPosition = new Position(endX, endY);
  }

  setShotArray(shotArray) {
    this.shotArray = shotArray;
  }

  update() {
    let justTime = Date.now();

    if (this.isComing === true) {
      // 登場シーン
      let comingTime = (justTime - this.comingStart) / 1000;
      let y = this.comingStartPosition.y - comingTime * 50;

      if (y <= this.comingEndPosition.y) {
        this.isComing = false;
        y = this.comingEndPosition.y;
      }
      this.position.set(this.position.x, y);

      // 登場中のチカチカ描画
      if (justTime % 100 < 50) {
        this.ctx.globalAlpha = 0.5;
      }
    } else {
      // 押されたキーによって挙動を変える
      if (window.isKeyDown.key_ArrowLeft === true) {
        this.position.x -= this.speed;
      }
      if (window.isKeyDown.key_ArrowRight === true) {
        this.position.x += this.speed;
      }
      if (window.isKeyDown.key_ArrowUp === true) {
        this.position.y -= this.speed;
      }
      if (window.isKeyDown.key_ArrowDown === true) {
        this.position.y += this.speed;
      }

      // 画面の外にはみ出ないように制限
      let canvasWidth = this.ctx.canvas.width;
      let canvasHeight = this.ctx.canvas.height;
      let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
      let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
      this.position.set(tx, ty);

      // Zキーでショット生成
      if (window.isKeyDown.key_z === true) {
        if (this.shotCheckCounter >= 0) {
          for (let i = 0; i < this.shotArray.length; ++i) {
            // ショットが生成されていない時だけショット作成
            if (this.shotArray[i].life <= 0) {
              this.shotArray[i].set(this.position.x, this.position.y);
              // カウントをマイナス値に設定し、連続してショットが生成されないようにする
              this.shotCheckCounter = -this.shotInterval;
              break; // 即ループ終了するための合図
            }
          }
        }
      }
      // 毎フレームごとに1加算され0以上の数値に戻る＝ショットが生成できるようになる
      ++this.shotCheckCounter;
    }

    // 登場シーン以外でも描画
    this.draw();

    this.ctx.globalAlpha = 1.0;
  }
}

// ショットクラス
class Shot extends Character {
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 7;
    this.vector = new Position(0.0, -1.0);
  }

  set(x, y) {
    this.position.set(x, y);
    this.life = 1;
  }

  update() {
    // life設定値が0以下は処理終了
    if (this.life <= 0) {
      return;
    }
    // ショットが画面外へ出たらlife設定値を0にする
    if (this.position.y + this.height < 0) {
      this.life = 0;
    }

    // 自身のスピードを乗算して自身の座標に加算
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.draw();
  }

  setVector(x, y) {
    this.vector.set(x, y);
  }
}
