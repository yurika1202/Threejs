(() => {
  let canvas = null;
  let ctx = null;
  let img = null;
  const canvasSize = 512;

  window.addEventListener("load", () => {
    imgLoader("./img/sample.jpg", (loadedImg) => {
      img = loadedImg;
      init();
      render();
    });
  });

  // 初期化
  function init() {
    canvas = document.body.querySelector("#main_canvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx = canvas.getContext("2d");
  }

  // 描画
  function render() {
    ctx.drawImage(img, 0, 0);
    let imgData = ctx.getImageData(0, 0, canvasSize, canvasSize); // getImageDate(x, y, width, height)
    // フィルター処理
    let outputData = mosaicFilter(imgData, 10);
    // Canvasにピクセル操作結果を書き戻す
    ctx.putImageData(outputData, 0, 0);
  }

  // 画像読み込み
  function imgLoader(path, cb) {
    let target = new Image();
    target.addEventListener("load", () => {
      if (cb != null) {
        cb(target);
      }
    });
    target.src = path;
  }

  // ネガポジ反転
  function invertFilter(imgData) {
    let width = imgData.width;
    let height = imgData.height;
    let data = imgData.data;
    let out = ctx.createImageData(width, height); // 出力用のImageDateオブジェクト
    // 縦(i)横(j)に進んでいくためにループ処理
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        // 該当インデックスを求める
        // i*width = 上から数えて何行目を処理中か
        // RGBA値が1次元配列で直列に格納されているので4を乗算
        let index = (i * width + j) * 4;
        // インデックスを元にRGBAの各要素にアクセスして色を反転（255から減算）
        out.data[index] = 255 - data[index];
        out.data[index + 1] = 255 - data[index + 1];
        out.data[index + 2] = 255 - data[index + 2];
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  // グレースケール（RGB値を均等化して白～灰～黒の明暗のみで構成）
  function grayscaleFilter(imgData) {
    let width = imgData.width;
    let height = imgData.height;
    let data = imgData.data;
    let out = ctx.createImageData(width, height);
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;
        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];
        // RGB値を合算して均等化
        let luminance = (r + g + b) / 3;
        // 書き出し
        out.data[index] = luminance;
        out.data[index + 1] = luminance;
        out.data[index + 2] = luminance;
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  // 2値化（白か黒かの2択）
  function binarizationFilter(imgData) {
    let width = imgData.width;
    let height = imgData.height;
    let data = imgData.data;
    let out = ctx.createImageData(width, height);
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;
        let r = data[index];
        let g = data[index + 1];
        let b = data[index + 2];
        let luminance = (r + g + b) / 3;
        // 均等化した値が閾値（境界値）以上かどうか
        let val = luminance >= 128 ? 255 : 0;
        // 書き出し
        out.data[index] = val;
        out.data[index + 1] = val;
        out.data[index + 2] = val;
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  // エッジ検出（ラプラシアンフィルター：隣接するピクセル同士の差分を可視化）
  function laplacianFilter(imgData) {
    let width = imgData.width;
    let height = imgData.height;
    let data = imgData.data;
    let out = ctx.createImageData(width, height);
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;
        // 対象ピクセルの上下左右の周辺ピクセルのインデックスを取得
        let topIndex = (Math.max(i - 1, 0) * width + j) * 4;
        let bottomIndex = (Math.min(i + 1, height - 1) * width + j) * 4;
        let leftIndex = (i * width + Math.max(j - 1, 0)) * 4;
        let rightIndex = (i * width + Math.min(j + 1, width - 1)) * 4;
        // 上下左右の色は加算、中心は-4を乗算してから加算
        let r = data[topIndex] + data[bottomIndex] + data[leftIndex] + data[rightIndex] + data[index] * -4;
        let g = data[topIndex + 1] + data[bottomIndex + 1] + data[leftIndex + 1] + data[rightIndex + 1] + data[index + 1] * -4;
        let b = data[topIndex + 2] + data[bottomIndex + 2] + data[leftIndex + 2] + data[rightIndex + 2] + data[index + 2] * -4;
        // 絶対値に修正して均等化
        let val = (Math.abs(r) + Math.abs(g) + Math.abs(b)) / 3;
        // 書き出し
        out.data[index] = val;
        out.data[index + 1] = val;
        out.data[index + 2] = val;
        out.data[index + 3] = data[index + 3];
      }
    }
    return out;
  }

  // ノイズ除去（メディアンフィルター：差分を均一化）
  function medianFilter(imgData) {
    let width = imgData.width;
    let height = imgData.height;
    let data = imgData.data;
    let out = ctx.createImageData(width, height);
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;
        let topIndex = (Math.max(i - 1, 0) * width + j) * 4;
        let bottomIndex = (Math.min(i + 1, height - 1) * width + j) * 4;
        let leftIndex = (i * width + Math.max(j - 1, 0)) * 4;
        let rightIndex = (i * width + Math.min(j + 1, width - 1)) * 4;
        // 斜め方向のピクセルのインデックスを取得
        let topLeftIndex = (Math.max(i - 1, 0) * width + Math.max(j - 1, 0)) * 4;
        let bottomLeftIndex = (Math.min(i + 1, height - 1) * width + Math.max(j - 1, 0)) * 4;
        let topRightIndex = (Math.max(i - 1, 0) * width + Math.min(j + 1, width - 1)) * 4;
        let bottomRightIndex = (Math.min(i + 1, height - 1) * width + Math.min(j + 1, width - 1)) * 4; // getLuminance関数から輝度を求めて本来のインデックスと共に配列へ格納
        let luminanceArray = [
          { index: index, luminance: getLuminance(data, index) },
          { index: topIndex, luminance: getLuminance(data, topIndex) },
          { index: bottomIndex, luminance: getLuminance(data, bottomIndex) },
          { index: leftIndex, luminance: getLuminance(data, leftIndex) },
          { index: rightIndex, luminance: getLuminance(data, rightIndex) },
          { index: topLeftIndex, luminance: getLuminance(data, topLeftIndex) },
          {
            index: bottomLeftIndex,
            luminance: getLuminance(data, bottomLeftIndex),
          },
          {
            index: topRightIndex,
            luminance: getLuminance(data, topRightIndex),
          },
          {
            index: bottomRightIndex,
            luminance: getLuminance(data, bottomRightIndex),
          },
        ];
        // 配列内の輝度値を基準にソート
        luminanceArray.sort((a, b) => {
          return a.luminance - b.luminance;
        });
        // 中央値となるインデックスが 4 の要素を取り出す
        let sorted = luminanceArray[4];
        // 書き出し
        out.data[index] = data[sorted.index];
        out.data[index + 1] = data[sorted.index + 1];
        out.data[index + 2] = data[sorted.index + 2];
        out.data[index + 3] = data[sorted.index + 3];
      }
    }
    return out;
  }

  // 輝度の算出
  function getLuminance(data, index) {
    let r = data[index];
    let g = data[index + 1];
    let b = data[index + 2];
    return (r + g + b) / 3;
  }

  // モザイク（同ピクセルに共通の色を書き戻す）
  function mosaicFilter(imgData, blockSize) {
    let width = imgData.width;
    let height = imgData.height;
    let data = imgData.data;
    let out = ctx.createImageData(width, height);
    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let index = (i * width + j) * 4;
        // インデックスをblockSizeを元に切り捨てる
        // ex. blockSize=4のとき、iが0～3のときは0、iが4～7のときは1となる
        let x = Math.floor(j / blockSize) * blockSize;
        let y = Math.floor(i / blockSize) * blockSize;
        let floorIndex = (y * width + x) * 4;
        // 書き出し
        out.data[index] = data[floorIndex];
        out.data[index + 1] = data[floorIndex + 1];
        out.data[index + 2] = data[floorIndex + 2];
        out.data[index + 3] = data[floorIndex + 3];
      }
    }
    return out;
  }
})();
