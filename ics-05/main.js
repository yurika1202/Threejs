const width = 960;
const height = 540;

const canvasElement = document.querySelector('#myCanvas');
const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
});
renderer.setSize(width, height);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    1,
    10000
);
camera.position.set(0, 0, 1000);

// カメラコントロールの作成
const controls = new THREE.OrbitControls(camera, canvasElement);
// 滑らかなコントロールにする
controls.enableDamping = true;
controls.dampingFactor = 0.2;

const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(300, 300, 300),
    new THREE.MeshNormalMaterial()
);
scene.add(mesh);

tick();
function tick() {
    // カメラコントロールを更新
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}