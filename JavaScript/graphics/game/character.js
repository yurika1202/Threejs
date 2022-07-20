// 座標管理クラス
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    if (x != null) {
      this.x = x;
    }

    if (y != null) {
      this.y = y;
    }
  }

  // 対象(target)との距離を測る
  distance(target) {
    let x = this.x - target.x;
    let y = this.y - target.y;
    return Math.sqrt(x * x + y * y);
  }

  // ベクトルの長さを返す静的メソッド
  static calcLength(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  // ベクトルを単位化した結果を返す静的メソッド
  static calcNormal(x, y) {
    let len = Position.calcLength(x, y);
    return new Position(x / len, y / len);
  }

  // 外積計算
  cross(target) {
    return this.x * target.y - this.y * target.x;
  }

  // 自身を単位化したベクトルの計算
  normalize() {
    let l = Math.sqrt(this.x * this.x + this.y * this.y);
    if (l === 0) {
      return new Position(0, 0);
    }
    // 自身の座標を大きさで割って単位化する
    let x = this.x / l;
    let y = this.y / l;
    return new Position(x, y);
  }

  // 指定ラジアン分だけ回転
  rotate(radian) {
    let s = Math.sin(radian);
    let c = Math.cos(radian);
    // 2×2の回転行列と乗算
    this.x = this.x * c + this.y * -s;
    this.y = this.x * s + this.y * c;
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
    super(ctx, x, y, w, h, 1, image);
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
    this.life = 1;
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
    if (this.life <= 0) {
      return;
    }
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
              this.shotArray[i].setPower(2);
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
    this.power = 1;
    this.targetArray = [];
  }

  set(x, y, speed, power) {
    this.position.set(x, y);
    this.life = 1;
    this.setSpeed(speed);
    this.setPower(power);
  }

  setSpeed(speed) {
    if (speed != null && speed > 0) {
      this.speed = speed;
    }
  }

  setPower(power) {
    if (power != null && power > 0) {
      this.power = power;
    }
  }

  setTargets(targets) {
    if (
      targets != null &&
      Array.isArray(targets) === true &&
      targets.length > 0
    ) {
      this.targetArray = targets;
    }
  }

  setExplosions(targets) {
    if (
      targets != null &&
      Array.isArray(targets) === true &&
      targets.length > 0
    ) {
      this.explosionArray = targets;
    }
  }

  update() {
    // life設定値が0以下は処理終了
    if (this.life <= 0) {
      return;
    }
    // ショットが画面外へ出たらlife設定値を0にする
    if (
      this.position.y + this.width < 0 ||
      this.position.y - this.width > this.ctx.canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height
    ) {
      this.life = 0;
    }

    // 自身のスピードを乗算して自身の座標に加算
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    // ショットと対象との衝突判定
    this.targetArray.map((v) => {
      // 自身か対象のライフが0以下は処理終了
      if (this.life <= 0 || v.life <= 0) {
        return;
      }

      // positionクラスのdistanceメソッドを使って、自身と対象の距離を測る
      let dist = this.position.distance(v.position);
      // 自身と対象の幅の1/4の距離まで近づいたら衝突とする
      if (dist <= (this.width + v.width) / 4) {
        // 自機キャラクターが対象の場合、登場中は衝突判定を無視する
        if (v instanceof Viper === true) {
          if (v.isComing === true) {
            return;
          }
        }
        v.life -= this.power; // 対象の攻撃力分ライフを減らす
        // 爆発エフェクトを発生
        if (v.life <= 0) {
          for (let i = 0; i < this.explosionArray.length; ++i) {
            if (this.explosionArray[i].life !== true) {
              this.explosionArray[i].set(v.position.x, v.position.y);
              break;
            }
          }
          // 敵キャラの場合はスコアを加算
          if (v instanceof Enemy === true) {
            let score = 100;
            if (v.type === "large") {
              score = 1000;
            }
            gameScore = Math.min(gameScore + score, 99999);
          }
        }
        this.life = 0; // ショットのライフを0にして消滅させる
      }
    });

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
    this.attackTarget = null;
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

  setAttackTarget(target) {
    this.attackTarget = target;
  }

  update() {
    if (this.life <= 0) {
      return;
    }

    switch (this.type) {
      case "default":
      default:
        // フレームが50のときにショットを放つ
        if (this.frame === 100) {
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
      // 左右に揺れながら攻撃する敵
      case "wave":
        if (this.frame % 60 === 0) {
          // 攻撃対象に向かうベクトル値
          let tx = this.attackTarget.position.x - this.position.x;
          let ty = this.attackTarget.position.y - this.position.y;
          let tv = Position.calcNormal(tx, ty); // ベクトルの単位化
          this.fire(tv.x, tv.y, 4.0);
        }
        this.position.x += Math.sin(this.frame / 10); // サイン波
        this.position.y += 2.0; // 一定量
        // 画面下端へ移動しきったらライフを0に設定
        if (this.position.y - this.height > this.ctx.canvas.height) {
          this.life = 0;
        }
        break;
      // 耐久力の強い敵
      case "large":
        if (this.frame % 50 === 0) {
          // 45度ごとに全方位弾を放つ
          for (let i = 0; i < 360; i += 45) {
            let r = (i * Math.PI) / 180;
            let s = Math.sin(r);
            let c = Math.cos(r);
            this.fire(c, s, 3.0);
          }
        }
        this.position.x += Math.sin((this.frame + 90) / 50) * 2.0;
        this.position.y += 1.0;
        if (this.position.y - this.height > this.ctx.canvas.height) {
          this.life = 0;
        }
        break;
    }
    this.draw();
    ++this.frame;
  }

  fire(x = 0.0, y = 1.0, speed = 5.0) {
    for (let i = 0; i < this.shotArray.length; ++i) {
      if (this.shotArray[i].life <= 0) {
        this.shotArray[i].set(this.position.x, this.position.y);
        this.shotArray[i].setSpeed(speed);
        this.shotArray[i].setVector(x, y);
        break;
      }
    }
  }
}

// ボスクラス
class Boss extends Character {
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.mode = "";
    this.frame = 0;
    this.speed = 3;
    this.shotArray = null;
    this.homingArray = null;
    this.attackTarget = null;
  }

  setMode(mode) {
    this.mode = mode;
  }

  setShotArray(shotArray) {
    this.shotArray = shotArray;
  }

  setHomingArray(homingArray) {
    this.homingArray = homingArray;
  }

  setAttackTarget(target) {
    this.attackTarget = target;
  }

  update() {
    if (this.life <= 0) {
      return;
    }

    switch (this.mode) {
      // 出現
      case "invade":
        this.position.y += this.speed;
        if (this.position.y > 100) {
          this.position.y = 100;
          this.mode = "floating";
          this.frame = 0;
        }
        break;
      // 退出
      case "escape":
        this.position.y -= this.speed;
        if (this.position.y < -this.height) {
          this.life = 0;
        }
        break;
      case "floating":
        if (this.frame % 1000 < 500) {
          // 狙い撃ち設定
          if (this.frame % 200 > 140 && this.frame % 10 === 0) {
            // 攻撃対象へのベクトル
            let tx = this.attackTarget.position.x - this.position.x;
            let ty = this.attackTarget.position.y - this.position.y;
            let tv = Position.calcNormal(tx, ty);
            this.fire(tv.x, tv.y, 3.0);
          }
        } else {
          if (this.frame % 50 === 0) {
            homingFire(0, 1, 3.5);
          }
        }

        this.position.x += Math.cos(this.frame / 100) * 2.0;
        break;
      default:
        break;
    }
    this.draw();
    ++this.frame;
  }

  fire(x = 0.0, y = 1.0, speed = 5.0) {
    for (let i = 0; i < this.shotArray.length; ++i) {
      if (this.shotArray[i].life <= 0) {
        this.shotArray[i].set(this.position.x, this.position.y);
        this.shotArray[i].setSpeed(speed);
        this.shotArray[i].setVector(x, y);
        break;
      }
    }
  }

  homingFire(x = 0.0, y = 1.0, speed = 3.0) {
    for (let i = 0; i < this.homingArray.length; ++i) {
      if (this.homingArray[i].life <= 0) {
        this.homingArray[i].set(this.position.x, this.position.y);
        this.homingArray[i].setSpeed(speed);
        this.homingArray[i].setVector(x, y);
        break;
      }
    }
  }
}

class Homing extends Shot {
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, imagePath);
    this.frame = 0; // 一定フレーム経過後には追従をやめるために設定
  }

  set(x, y, speed, power) {
    this.position.set(x, y);
    this.life = 1;
    this.setSpeed(speed);
    this.setPower(power);
    this.frame = 0;
  }

  update() {
    if (this.life <= 0) {
      return;
    }
    if (
      this.position.x + this.width < 0 ||
      this.position.x - this.width > this.ctx.canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height
    ) {
      this.life = 0;
    }

    let target = this.targetArray[0];
    if (this.frame < 100) {
      let vector = new Position(
        target.position.x - this.position.x,
        target.position.y - this.position.y
      );
      let normalizedVector = vector.normalize();
      this.vector = this.vector.normalize();
      let cross = this.vector.cross(normalizedVector);
      let rad = Math.PI / 180.0;
      if (cross > 0.0) {
        this.vector.rotate(rad);
      } else if (cross < 0.0) {
        this.vector.rotate(-rad);
      }
      this.position.x += this.vector.x * this.speed;
      this.position.y += this.vector.y * this.speed;
      // 自身の進行方向からアングルを計算し設定する
      this.angle = Math.atan2(this.vector.y, this.vector.x);

      // ショットと対象との衝突判定を行う
      // ※以下は Shot クラスの衝突判定とまったく同じロジック
      this.targetArray.map((v) => {
        if (this.life <= 0 || v.life <= 0) {
          return;
        }
        let dist = this.position.distance(v.position);
        if (dist <= (this.width + v.width) / 4) {
          if (v instanceof Viper === true) {
            if (v.isComing === true) {
              return;
            }
          }
          v.life -= this.power;
          if (v.life <= 0) {
            for (let i = 0; i < this.explosionArray.length; ++i) {
              if (this.explosionArray[i].life !== true) {
                this.explosionArray[i].set(v.position.x, v.position.y);
                break;
              }
            }
            if (v instanceof Enemy === true) {
              let score = 100;
              if (v.type === "large") {
                score = 1000;
              }
              gameScore = Math.min(gameScore + score, 99999);
            }
          }
          this.life = 0;
        }
      });
      // 座標系の回転を考慮した描画を行う
      this.rotationDraw();
      // 自身のフレームをインクリメントする
      ++this.frame;
    }
  }
}

// 爆発エフェクトクラス
class Explosion {
  constructor(ctx, radius, count, size, timeRange, color = "#ff1166") {
    this.ctx = ctx;
    this.life = false;
    this.color = color;
    this.position = null;
    this.radius = radius; // 爆発の広がり半径
    this.count = count; // 火花の数
    this.startTime = 0; // 爆発開始時間
    this.timeRange = timeRange; // 爆発終了時間
    this.fireBaseSize = size; // 火花1つあたりの最大サイズ
    this.firePosition = [];
    this.fireVector = []; // 火花の進行方向
    this.fireSize = [];
    this.sound = null;
  }

  set(x, y) {
    // 火花の数分ループ
    for (let i = 0; i < this.count; ++i) {
      this.firePosition[i] = new Position(x, y);
      let vr = Math.random() * Math.PI * 2.0; // ランダムなラジアン
      let s = Math.sin(vr);
      let c = Math.cos(vr);
      let mr = Math.random();
      // 進行方向のベクトルの長さをランダムに短くする
      this.fireVector[i] = new Position(c * mr, s * mr);
      // 火花の大きさを0.5以上1.0未満の間でランダムに設定
      this.fireSize[i] = (Math.random() * 0.5 + 0.5) * this.fireBaseSize;
    }
    this.life = true;
    this.startTime = Date.now();

    if (this.sound != null) {
      this.sound.play();
    }
  }

  setSound(sound) {
    this.sound = sound;
  }

  update() {
    if (this.life !== true) {
      return;
    }

    // 火花のスタイル設定
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.5;

    // 進歩度合いに応じて火花を描画
    let time = (Date.now() - this.startTime) / 1000; // 爆発開始からの経過時間
    let ease = simpleEaseIn(1.0 - Math.min(time / this.timeRange, 1.0)); // 終了までの時間で正規化して進歩度合いを算出
    let progress = 1.0 - ease; // 爆発終了までの度合い
    for (let i = 0; i < this.firePosition.length; ++i) {
      let d = this.radius * progress; // 火花の広がる距離（広がり半径 * 進歩率）
      // 広がる分だけ移動した位置（初期位置 + 進行方向 * 広がり距離）
      let x = this.firePosition[i].x + this.fireVector[i].x * d;
      let y = this.firePosition[i].y + this.fireVector[i].y * d;
      // 描画に進歩率を反映させて徐々にちいさくなる演出を加える
      let s = 1.0 - progress;
      // 矩形の描画
      this.ctx.fillRect(
        x - (this.fireSize[i] * s) / 2,
        y - (this.fireSize[i] * s) / 2,
        this.fireSize[i] * s,
        this.fireSize[i] * s
      );
    }
    // 進歩が100%まで進んだらライフを0にする
    if (progress >= 1.0) {
      this.life = false;
    }
  }
}

// 背景クラス
class BackgroundStar {
  constructor(ctx, size, speed, color = "#fff") {
    this.ctx = ctx;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.position = null;
  }

  set(x, y) {
    this.position = new Position(x, y);
  }

  update() {
    this.ctx.fillStyle = this.color;
    this.position.y += this.speed;
    this.ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
    if (this.position.y + this.size > this.ctx.canvas.height) {
      this.position.y = -this.size;
    }
  }
}

// 補間関数（ease-in）
function simpleEaseIn(t) {
  return t * t * t * t;
}
