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

  // 仰角
  let latitude = 0;
  // 方位角
  let longitude = 0;
  // 半径
  const radius = 50;

  tick();
  function tick() {
    longitude += 2;

    // 仰角のラジアン
    const phi = (latitude * Math.PI) / 180;
    // 方位角のラジアン(-180することで時計回り)
    const theta = (longitude * Math.PI) / 180;

    const x = radius * Math.cos(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(phi) * Math.sin(theta);

    point.position.set(x, y, z);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}

/**
 * 3次元の座標計算
 * -------------------------------
 * θ ＝仰角（緯度：latitude）
 * θ'＝方位角（経度：longitude）
 * X 座標＝半径 * COSθ * COSθ'
 * Y 座標＝半径 * SINθ
 * Z 座標＝半径 * COSθ * SINθ'
 *
 * const translateGeoCoords = (latitude, longitude, radius) => {
 * // 仰角のラジアン
 * const phi = latitude * Math.PI / 180;
 * // 方位角のラジアン
 * const theta = (longitude - 180) * Math.PI / 180;
 *
 * const x = -1 * radius * Math.cos(phi) * Math.cos(theta);
 * const y = radius * Math.sin(phi);
 * const z = radius * Math.cos(phi) * Math.sin(theta);
 *
 * return new THREE.Vector3(x, y, z);
 * }
 */
