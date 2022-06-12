// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', init);

// サイズを指定
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, +1000);

    // いろんなジオメトリ
    // const geometry = new THREE.BoxGeometry(200, 200, 200);
    // const geometry = new THREE.CircleGeometry(200, 50, 0, 10);
    // const geometry = new THREE.ConeGeometry(200, 500);
    // const geometry = new THREE.CylinderGeometry(300, 200, 300);
    // const geometry = new THREE.DodecahedronGeometry(300);
    // const geometry = new THREE.OctahedronGeometry(300);
    // const geometry = new THREE.PlaneGeometry(300, 300);
    // const geometry = new THREE.RingGeometry(200, 300);
    // const geometry = new THREE.TetrahedronGeometry(300);
    // const geometry = new THREE.TorusGeometry(200, 100, 200, 100);
    const geometry = new THREE.TorusKnotGeometry(100, 50, 100, 100);

    /*
    width:横幅
    height:高さ
    depth:奥行
    radius:半径（Sphereでは球体の半径、ConeとCylinderでは底辺の半径）
    segments:分割数（増やせばより滑らかになる）
    */
    const material = new THREE.MeshNormalMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // アニメーション
    tick();
    function tick() {
        // mesh.rotation.y += 0.01;
        renderer.render(scene, camera);

        requestAnimationFrame(tick);
    }
}