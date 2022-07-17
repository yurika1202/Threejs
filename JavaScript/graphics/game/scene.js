class SceneManager {
  constructor() {
    this.scene = {};
    this.activeScene = null;
    this.startTime = null; // アクティブになった時間
    this.frame = null; // アクティブになってからのシーン実行回数
  }

  add(name, updateFunction) {
    this.scene[name] = updateFunction;
  }

  use(name) {
    if (this.scene.hasOwnProperty(name) !== true) {
      return;
    }

    this.activeScene = this.scene[name];
    this.startTime = Date.now();
    this.frame = -1; // シーンをアクティブにしたのでカウンターをリセット
  }

  update() {
    let activeTime = (Date.now() - this.startTime) / 1000; // アクティブになってからの経過時間
    this.activeScene(activeTime);
    ++this.frame;
  }
}
