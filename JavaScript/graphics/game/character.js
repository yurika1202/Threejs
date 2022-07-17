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
    this.vector = new Position(0.0, -1.0);
    this.width = w;
    this.height = h;
    this.life = life;
    this.angle = (270 * Math.PI) / 180;

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

  setVector(x, y) {
    // 自身の vector プロパティに設定する
    this.vector.set(x, y);
  }

  setVectorFromAngle(angle) {
    this.angle = angle;
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    this.vector.set(cos, sin);
  }

  rotationDraw() {
    this.ctx.save(); // 回転処理前の状態を保存
    this.ctx.translate(this.position.x, this.position.y); // 座標位置を自身の位置まで移動
    this.ctx.rotate(this.angle - Math.PI * 1.5); // 座標を回転（270度の位置を基準にするためMath.PI * 1.5を引く）

    // キャラクターの中心点を取得
    let offsetX = this.width / 2;
    let offsetY = this.height / 2;
    this.ctx.drawImage(
      this.image,
      // すでに全体の座標はtranslateで移動させているのでキャラ分のみ移動
      -offsetX,
      -offsetY,
      this.width,
      this.height
    );
    this.ctx.restore(); // 回転処理前の状態へ戻す
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
    this.singleShotArray = null;
  }

  setComing(startX, startY, endX, endY) {
    this.isComing = true;
    this.comingStart = Date.now();
    this.position.set(startX, startY);
    this.comingStartPosition = new Position(startX, startY);
    this.comingEndPosition = new Position(endX, endY);
  }

  setShotArray(shotArray, singleShotArray) {
    this.shotArray = shotArray;
    this.singleShotArray = singleShotArray;
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
          // ショットが生成されていない時だけショット作成
          for (let i = 0; i < this.shotArray.length; ++i) {
            if (this.shotArray[i].life <= 0) {
              this.shotArray[i].set(this.position.x, this.position.y);
              // カウントをマイナス値に設定し、連続してショットが生成されないようにする
              this.shotCheckCounter = -this.shotInterval;
              break; // 即ループ終了するための合図
            }
          }
          // シングルショットが生成されていなければ作成
          // 2個1セットで、左右へ進行方向を振り分ける
          for (let i = 0; i < this.singleShotArray.length; i += 2) {
            if (
              this.singleShotArray[i].life <= 0 &&
              this.singleShotArray[i + 1].life <= 0
            ) {
              let radCW = (280 * Math.PI) / 180; // 時計回りに10度
              let radCCW = (260 * Math.PI) / 180; // 反時計回りに10度
              this.singleShotArray[i].set(this.position.x, this.position.y);
              this.singleShotArray[i].setVectorFromAngle(radCW); // 右向き
              this.singleShotArray[i + 1].set(this.position.x, this.position.y);
              this.singleShotArray[i + 1].setVectorFromAngle(radCCW); // 左向き
              this.shotCheckCounter = -this.shotInterval;
              break;
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
  }

  set(x, y, speed) {
    this.position.set(x, y);
    this.life = 1;
    this.setSpeed(speed);
  }

  setSpeed(speed) {
    if (speed != null && speed > 0) {
      this.speed = speed;
    }
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
    this.rotationDraw();
  }
}

// 敵キャラクタークラス
class Enemy extends Character {
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.type = "default";
    this.frame = 0;
    this.speed = 3;
    this.shotArray = null;
  }

  set(x, y, life = 1, type = "default") {
    this.position.set(x, y);
    this.life = life;
    this.type = type;
    this.frame = 0;
  }

  setShotArray(shotArray) {
    this.shotArray = shotArray;
  }

  setSpeed(speed) {
    if (speed != null && speed > 0) {
      this.speed = speed;
    }
  }

  update() {
    if (this.life <= 0) {
      return;
    }

    switch (this.type) {
      case "default":
      default:
        // フレームが50のときにショットを放つ
        if (this.frame === 50) {
          this.fire();
        }
        // 敵を進行方向に沿って移動させる
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;
        // 画面下端へ移動しきったらライフを0に設定
        if (this.position.y - this.height > this.ctx.canvas.height) {
          this.life = 0;
        }
        break;
    }
    this.draw();
    ++this.frame;
  }

  fire(x = 0.0, y = 1.0) {
    for (let i = 0; i < this.shotArray.length; ++i) {
      if (this.shotArray[i].life <= 0) {
        this.shotArray[i].set(this.position.x, this.position.y);
        this.shotArray[i].setSpeed(5.0);
        this.shotArray[i].setVector(x, y);
        break;
      }
    }
  }
}
