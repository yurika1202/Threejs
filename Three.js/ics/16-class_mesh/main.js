window.addEventListener('DOMContentLoaded', init);

function init() {
    const width = 960;
    const height = 540;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(-100, 150, 500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const mesh = new Donuts();
    scene.add(mesh);

    tick();
    function tick() {
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

// クラスの作成（extendでメッシュクラスを継承）
class Donuts extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.TorusGeometry(120, 40, 60, 50);
        const material = new THREE.MeshNormalMaterial();

        // superを使ってメッシュクラスのコンストラクター関数を実行
        super(geometry, material);
    }
}