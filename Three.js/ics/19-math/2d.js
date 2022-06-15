window.addEventListener("DOMContentLoaded", init);

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, 300);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 50, 50), new THREE.MeshNormalMaterial());
  scene.add(sphere);
  const point = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  scene.add(point);

  // 角度
  let degree = 0;
  // 半径
  const radius = 80;

  tick();
  function tick() {
    degree += 0.5;
    const radian = (degree * Math.PI) / 180;

    // 反時計回り
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    // 時計回り
    // const x = radius * Math.cos(radian);
    // const y = radius * Math.sin(radian);

    point.position.set(x, y, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}

/**
 * 2次元の座標計算
 * ------------------------------------------
 * 三角関数を使って、角度と半径をもとに座標を求める。
 * ・X 座標（水平）＝半径 * COSθ
 * ・Y 座標（垂直）＝半径 * SINθ
 *
 * ラジアン変換
 * const radian = degree * Math.PI / 180;
 *
 * X座標
 * const x = radius * Math.cos(radian);
 *
 * Y座標
 * const y = radius * Math.sin(radian);
 *
 * フレーム毎に角度`degree`を増やせば円を描く位置情報を取得できる。
 */
