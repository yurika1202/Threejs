(() => {
  const canvasWidth = 640;
  const canvasHeight = 480;
  let util = null;
  let canvas = null;
  let ctx = null;
  let image = null;
  let startTime = null;
  let viperX = canvasWidth / 2;
  let viperY = canvasHeight / 2;
  let isComing = false;
  let comingStart = null;

  window.addEventListener(
    "load",
    () => {
      util = new Canvas2DUtility(document.querySelector("#mainCanvas"));
      canvas = util.canvas;
      ctx = util.context;

      util.imageLoader("./img/viper.png", (loadedImage) => {
        image = loadedImage;
        initialize();
        eventSetting();
        startTime = Date.now();
        render();
      });
    },
    false
  );

  function initialize() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    isComing = true;
    comingStart = Date.now();
    viperY = canvasHeight;
  }

  function render() {
    ctx.globalAlpha = 1.0;
    util.drawRect(0, 0, canvas.width, canvas.height, "#eee");

    let nowTime = (Date.now() - startTime) / 1000;
    if (isComing === true) {
      let justTime = Date.now();
      let comingTime = (justTime - comingStart) / 1000;
      viperY = canvasHeight - comingTime * 50;

      if (viperY <= canvasHeight - 100) {
        isComing = false;
        viperY = canvasHeight - 100;
      }

      if (justTime % 100 < 50) {
        ctx.globalAlpha = 0.5;
      }
    }

    ctx.drawImage(image, viperX, viperY);
    requestAnimationFrame(render);
  }

  function eventSetting() {
    window.addEventListener(
      "keydown",
      (e) => {
        if (isComing === true) {
          return;
        }

        switch (e.key) {
          case "ArrowLeft":
            viperX -= 10;
            console.log("ok");
            break;
          case "ArrowRight":
            viperX += 10;
            break;
          case "ArrowUp":
            viperY -= 10;
            break;
          case "ArrowDown":
            viperY += 10;
            break;
        }
      },
      false
    );
  }
})();
