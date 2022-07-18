(() => {
  window.isKeyDown = {}; // どこからでも参照できるよう、windowオブジェクトのカスタムプロパティとして設定
  const canvasWidth = 640;
  const canvasHeight = 480;
  const shotMaxCount = 10;
  const enemyMaxCount = 10;
  const enemyShotMaxCount = 50;
  const explosionMaxCount = 10;
  let util = null;
  let canvas = null;
  let ctx = null;
  let startTime = null;
  let viper = null;
  let shotArray = [];
  let singleShotArray = [];
  let enemyArray = [];
  let enemyShotArray = [];
  let explosionArray = [];
  let scene = null;

  window.addEventListener(
    "load",
    () => {
      util = new Canvas2DUtility(document.querySelector("#mainCanvas"));
      canvas = util.canvas;
      ctx = util.context;

      initialize();
      loadCheck();
    },
    false
  );

  // 初期化関数
  function initialize() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // シーンの初期化
    scene = new SceneManager();

    // 爆発エフェクトの初期化
    for (let i = 0; i < explosionMaxCount; ++i) {
      explosionArray[i] = new Explosion(ctx, 50.0, 15, 30.0, 0.25);
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
    }

    // 敵の初期化
    for (let i = 0; i < enemyMaxCount; i++) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, "./img/enemy_small.png");
      enemyArray[i].setShotArray(enemyShotArray);
    }

    // 衝突判定を行うために対象を設定する
    for (let i = 0; i < shotMaxCount; ++i) {
      shotArray[i].setTargets(enemyArray);
      singleShotArray[i * 2].setTargets(enemyArray);
      singleShotArray[i * 2 + 1].setTargets(enemyArray);
      shotArray[i].setExplosions(explosionArray);
      singleShotArray[i * 2].setExplosions(explosionArray);
      singleShotArray[i * 2 + 1].setExplosions(explosionArray);
    }
  }

  function sceneSetting() {
    scene.add("intro", (time) => {
      // 2秒経過後にシーンをinvadeへ移す
      if (time > 2.0) {
        scene.use("invade");
      }
    });

    scene.add("invade", (time) => {
      if (scene.frame === 0) {
        for (let i = 0; i < enemyMaxCount; ++i) {
          // ライフが0の敵があれば配置
          if (enemyArray[i].life <= 0) {
            let e = enemyArray[i];
            e.set(canvasWidth / 2, -e.height, 2, "default");
            e.setVector(0.0, 1.0);
            break;
          }
        }
      }
      // 100フレーム経過後に再度invadeシーンを設定
      if (scene.frame === 100) {
        scene.use("invade");
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
    util.drawRect(0, 0, canvas.width, canvas.height, "#eee");
    let nowTime = (Date.now() - startTime) / 1000;

    scene.update();
    viper.update();
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
})();
