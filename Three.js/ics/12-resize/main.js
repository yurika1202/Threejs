window.addEventListener('DOMContentLoaded', init);

function init() {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
        antialias: true,
    });

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1.0);
    camera.position.set(0, 0, 1000);

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(300, 30, 30),
        new THREE.MeshBasicMaterial({wireframe: true})
    );
    scene.add(mesh);

    tick();
    function tick() {
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }

    // 画面幅に合わせてキャンバスサイズを変更する
    onResize(); // 初期化実行
    window.addEventListener('resize', onResize);
    function onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // レンダラーのサイズ調整
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        // カメラのアスペクト比調整
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}