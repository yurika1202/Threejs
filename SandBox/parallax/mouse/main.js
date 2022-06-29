// 参考：https://www.fieldcorp.jp/journal/article/tsukuru/4620/

class ParallaxMouseMove {
  constructor(targets, val) {
    this.targets = targets;
    // ウィンドウ中心座標
    this.windowCenterX = window.innerWidth / 2;
    this.windowCenterY = window.innerHeight / 2;
    // パララックス移動距離（値が増えれば移動距離は狭まる）
    this.parallaxVal = val;
  }

  parallax() {
    this.targets.forEach(target => {
      target.addEventListener('mousemove', event => {
        // パララックス座標 = (ウィンドウ中心座標からのマウス位置) - パララックス移動距離
        const x = (this.windowCenterX - event.pageX) / this.parallaxVal;
        const y = (this.windowCenterY - event.pageY) / this.parallaxVal;
        // transform値変更
        target.style.transform = `translate(${-x}px, ${-y}px`;
      });
    });
  }
}
// ターゲット取得
const parallaxTargets = document.querySelectorAll('.parallaxBox');
const parallaxMouseMove = new ParallaxMouseMove(parallaxTargets, 10);
parallaxTargets.forEach(parallaxTarget => {
  parallaxMouseMove.parallax();
});
