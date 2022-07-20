class Sound {
  constructor() {
    this.ctx = new AudioContext();
    this.source = null;
  }

  load(audioPath, callback) {
    fetch(audioPath)
      .then((response) => {
        // レスポンスからAudioBuffer生成のためのデータを取得
        return response.arrayBuffer();
      })
      .then((buffer) => {
        // AudioBufferの生成
        return this.ctx.decodeAudioData(buffer);
      })
      .then((decodeAudio) => {
        this.source = decodeAudio;
        callback();
      })
      .catch(() => {
        callback("error!");
      });
  }

  play() {
    let node = new AudioBufferSourceNode(this.ctx, { buffer: this.source });
    node.connect(this.ctx.destination);
    node.addEventListener(
      "ended",
      () => {
        node.stop();
        node.disconnect();
        node = null;
      },
      false
    );
    node.start();
  }
}
