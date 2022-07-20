(() => {
  window.isKeyDown = {}; // どこからでも参照できるよう、windowオブジェクトのカスタムプロパティとして設定
  window.gameScore = 0;
  const canvasWidth = 640;
  const canvasHeight = 480;
  const shotMaxCount = 10;
  const enemyShotMaxCount = 50;
  const enemySmallMaxCount = 20;
  const enemyLargeMaxCount = 5;
  const explosionMaxCount = 10;
  const backgroundStarMaxCount = 100;
  const backgroundStarMaxSize = 3;
  const backgroundStarMaxSpeed = 4;
  let util = null;
  let canvas = null;
  let ctx = null;
  let startTime = null;
  let viper = null;
  let boss = null;
  let shotArray = [];
  let singleShotArray = [];
  let enemyArray = [];
  let enemyShotArray = [];
  let homingArray = [];
  let explosionArray = [];
  let backgroundStarArray = [];
  let scene = null;
  let restart = false;
  let sound = null;

  window.addEventListener(
    "load",
    () => {
      util = new Canvas2DUtility(document.querySelector("#mainCanvas"));
      canvas = util.canvas;
      ctx = util.context;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      let button = document.body.querySelector("#startBtn");

      button.addEventListener(
        "click",
        () => {
          button.disabled = true;
          sound = new Sound();
          sound.load("./sound/explosion.mp3", (error) => {
            if (error != null) {
              alert("ファイルの読み込みエラーです");
              return;
            }
          });
        },
        false
      );
      initialize();
      loadCheck();
    },
    false
  );

  // 初期化関数
  function initialize() {
    // シーンの初期化
    scene = new SceneManager();

    // 爆発エフェクトの初期化
    for (let i = 0; i < explosionMaxCount; ++i) {
      explosionArray[i] = new Explosion(ctx, 100.0, 15, 40.0, 1.0);
      explosionArray[i].setSound(sound);
    }

    // 自機の初期化
    viper = new Viper(ctx, 0, 0, 64, 64, "./img/viper.png");
    viper.setComing(
      // 登場演出スタート時の座標
      canvasWidth / 2,
      canvasHeight + 50,
      // 登場演出終了時の座標
      canvasWidth / 2,
      canvasHeight - 100
    );

    // ショットの初期化
    for (let i = 0; i < shotMaxCount; ++i) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, "./img/viper_shot.png");
      singleShotArray[i * 2] = new Shot(
        ctx,
        0,
        0,
        32,
        32,
        "./img/viper_single_shot.png"
      );
      singleShotArray[i * 2 + 1] = new Shot(
        ctx,
        0,
        0,
        32,
        32,
        "./img/viper_single_shot.png"
      );
    }
    viper.setShotArray(shotArray, singleShotArray);

    // 敵のショットの初期化
    for (let i = 0; i < enemyShotMaxCount; ++i) {
      enemyShotArray[i] = new Shot(ctx, 0, 0, 32, 32, "./img/enemy_shot.png");
      enemyShotArray[i].setTargets([viper]);
      enemyShotArray[i].setExplosions(explosionArray);
    }

    // 敵の初期化（小）
    for (let i = 0; i < enemySmallMaxCount; i++) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, "./img/enemy_small.png");
      enemyArray[i].setShotArray(enemyShotArray);
      enemyArray[i].setAttackTarget(viper);
    }

    // 敵の初期化（大）
    for (let i = 0; i < enemyLargeMaxCount; i++) {
      enemyArray[enemySmallMaxCount + i] = new Enemy(
        ctx,
        0,
        0,
        64,
        64,
        "./img/enemy_large.png"
      );
      enemyArray[enemySmallMaxCount + i].setShotArray(enemyShotArray);
      enemyArray[enemySmallMaxCount + i].setAttackTarget(viper);
    }

    // ボスの初期化
    boss = new Boss(ctx, 0, 0, 128, 128, "./img/boss.png");
    boss.setShotArray(enemyShotArray);
    boss.setHomingArray(homingArray);
    boss.setAttackTarget(viper);
    let concatEnemyArray = enemyArray.concat([boss]);

    // 衝突判定を行うために対象を設定する
    for (let i = 0; i < shotMaxCount; ++i) {
      shotArray[i].setTargets(concatEnemyArray);
      singleShotArray[i * 2].setTargets(concatEnemyArray);
      singleShotArray[i * 2 + 1].setTargets(concatEnemyArray);
      shotArray[i].setExplosions(explosionArray);
      singleShotArray[i * 2].setExplosions(explosionArray);
      singleShotArray[i * 2 + 1].setExplosions(explosionArray);
    }

    // 流れる星の背景の初期化
    for (let i = 0; i < backgroundStarMaxCount; i++) {
      let size = 1 + Math.random() * (backgroundStarMaxSize - 1);
      let speed = 1 + Math.random() * (backgroundStarMaxSpeed - 1);
      backgroundStarArray[i] = new BackgroundStar(ctx, size, speed);
      let x = Math.random() * canvasWidth;
      let y = Math.random() * canvasHeight;
      backgroundStarArray[i].set(x, y);
    }
  }

  function sceneSetting() {
    scene.add("intro", (time) => {
      // 2秒経過後にシーンをinvadeへ移す
      if (time > 3.0) {
        scene.use("invade_default_type");
      }
    });

    scene.add("invade_default_type", (time) => {
      if (scene.frame % 30 === 0) {
        for (let i = 0; i < enemySmallMaxCount; ++i) {
          // ライフが0の敵があれば配置
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            if (scene.frame % 60 === 0) {
              e.set(-e.width, 30, 2, "default");
              e.setVectorFromAngle(degreeToRadians(30));
            } else {
              e.set(canvasWidth + e.width, 30, 2, "default");
              e.setVectorFromAngle(degreeToRadians(150));
            }
            break;
          }
        }
      }
      // 270フレーム経過後に次のシーンへ
      if (scene.frame === 270) {
        scene.use("blank");
      }
      // 自機のライフが0の場合はゲームオーバーシーンを設定
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });

    scene.add("blank", (time) => {
      if (scene.frame === 150) {
        scene.use("invade_wave_move_type");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });

    scene.add("invade_wave_move_type", (time) => {
      if (scene.frame % 50 === 0) {
        for (let i = 0; i < enemySmallMaxCount; ++i) {
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            // フレームが200以下の時は左へ、200以上の時は右へ
            if (scene.frame <= 200) {
              e.set(canvasWidth * 0.2, -e.height, 2, "wave");
            } else {
              e.set(canvasWidth * 0.8, -e.height, 2, "wave");
            }
            break;
          }
        }
      }
      if (scene.frame === 450) {
        scene.use("invade_large_type");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });

    scene.add("invade_large_type", (time) => {
      if (scene.frame === 100) {
        // ライフが 0 の敵（大）がいれば配置
        let i = enemySmallMaxCount + enemyLargeMaxCount;
        for (let j = enemySmallMaxCount; j < i; ++j) {
          if (enemyArray[j].life <= 0) {
            let e = enemyArray[j];
            e.set(canvasWidth / 2, -e.height, 50, "large");
            break;
          }
        }
      }
      if (scene.frame === 500) {
        scene.use("invade_boss");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
      }
    });

    scene.add("invade_boss", (time) => {
      if (scene.frame === 0) {
        boss.set(canvasWidth / 2, -boss.height, 250);
        // ボスモードはinvadeから開始
        boss.setMode("invade");
      }
      if (viper.life <= 0) {
        scene.use("gameover");
        // ゲームオーバー表示中にボスを退避させる
        boss.setMode("escape");
      }
      if (boss.life <= 0) {
        scene.use("intro");
      }
    });

    scene.add("gameover", (time) => {
      let textWidth = canvasWidth / 2;
      let loopWidth = canvasWidth + textWidth;
      let x = canvasWidth - ((scene.frame * 2) % loopWidth); // テキスト位置

      ctx.font = "bold 72px sans-serif";
      util.drawText("GAME OVER", x, canvasHeight / 2, "#ff0000", textWidth);

      if (restart === true) {
        restart = false;
        gameScore = 0;
        viper.setComing(
          canvasWidth / 2,
          canvasHeight + 50,
          canvasWidth / 2,
          canvasHeight - 100
        );
        scene.use("intro");
      }
    });

    scene.use("intro"); // 最初に使うシーンの設定
  }

  function loadCheck() {
    let ready = true;
    ready = ready && viper.ready;
    shotArray.map((v) => {
      ready = ready && v.ready;
    });
    singleShotArray.map((v) => {
      ready = ready && v.ready;
    });
    enemyArray.map((v) => {
      ready = ready && v.ready;
    });
    enemyShotArray.map((v) => {
      ready = ready && v.ready;
    });

    if (ready === true) {
      eventSetting();
      sceneSetting();
      startTime = Date.now();
      render();
    } else {
      // ロード未完了の場合は再度0.1秒ごとに呼び出す
      setTimeout(loadCheck, 100);
    }
  }

  // 描画処理
  function render() {
    ctx.globalAlpha = 1.0;
    util.drawRect(0, 0, canvas.width, canvas.height, "#111122");
    let nowTime = (Date.now() - startTime) / 1000;

    ctx.font = "bold 24px monospace";
    util.drawText(zeroPadding(gameScore, 5), 30, 50, "#111");

    scene.update();
    backgroundStarArray.map((v) => {
      v.update();
    });
    viper.update();
    boss.update();
    shotArray.map((v) => {
      v.update();
    });
    singleShotArray.map((v) => {
      v.update();
    });
    enemyArray.map((v) => {
      v.update();
    });
    enemyShotArray.map((v) => {
      v.update();
    });
    explosionArray.map((v) => {
      v.update();
    });

    requestAnimationFrame(render);
  }

  // イベント設定
  function eventSetting() {
    // キー操作でキャラクターを動かす
    window.addEventListener(
      "keydown",
      (event) => {
        isKeyDown[`key_${event.key}`] = true; // window.isKeyDown[(プロパティ名)イベントが生じたキーの種類を表す文字列]
        // ゲームオーバーから再スタートする設定
        if (event.key === "Enter") {
          if (viper.life <= 0) {
            restart = true;
          }
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      (event) => {
        isKeyDown[`key_${event.key}`] = false;
      },
      false
    );
  }

  // 文字列を任意の桁で返す関数
  function zeroPadding(number, count) {
    let zeroArray = new Array(count);
    let zeroString = zeroArray.join("0") + number;
    return zeroString.slice(-count);
  }

  // ラジアン生成関数
  function degreeToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
})();
