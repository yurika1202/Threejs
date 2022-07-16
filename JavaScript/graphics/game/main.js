(() => {
  window.isKeyDown = {}; // どこからでも参照できるよう、windowオブジェクトのカスタムプロパティとして設定
  const canvasWidth = 640;
  const canvasHeight = 480;
  const shotMaxCount = 10;
  let util = null;
  let canvas = null;
  let ctx = null;
  let startTime = null;
  let viper = null;
  let shotArray = [];

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
    }
    viper.setShotArray(shotArray);
  }

  function loadCheck() {
    let ready = true;
    ready = ready && viper.ready;
    shotArray.map((v) => {
      ready = ready && v.ready;
    });

    if (ready === true) {
      eventSetting();
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

    viper.update();
    shotArray.map((v) => {
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
