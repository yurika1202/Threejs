window.addEventListener('DOMContentLoaded', init);

const width = 960;
const height = 540;

function init() {
    // レンダラー
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    renderer.setSize(width, height);

    // シーン
    const scene = new THREE.Scene();

    // カメラ
    const camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        1,
        10000
    );
    camera.position.set(0, 0, 1000);

    // 球体
    const geometry = new THREE.SphereGeometry(300, 30, 30);
    // const material = new THREE.MeshStandardMaterial({color: 0xFF0000});

    // 画像をマテリアルで使う
    // const loader = new THREE.TextureLoader();
    // const texture = loader.load('../practice-02/img/earthmap.jpg');
    // const material = new THREE.MeshStandardMaterial({
    //     map: texture
    // });
    const material = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('../practice-02/img/earthmap.jpg')
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 平行光源（指定した方向からライトを適用させる）
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1); // ライトの座標位置。全部0に指定すると真っ暗！
    scene.add(directionalLight)

    // 環境光（空間全体を照らす）
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight)

    // ループイベント
    tick();
    function tick() {
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);

        requestAnimationFrame(tick);
    }
}