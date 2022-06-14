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

    // 地面
    scene.add(new THREE.GridHelper(600));
    scene.add(new THREE.AxesHelper(300));

    // グループの作成
    const group = new MyGroup();
    scene.add(group);

    tick();
    function tick() {
        group.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

// クラスの作成（extendでグループクラスを継承）
class MyGroup extends THREE.Group {
    constructor() {
        /**
         * コンストラクタの処理順は親→子なので、
         * thisを扱う場合には必ず先に親クラスのコンストラクタ処理を行う。
         * ＝super()の呼び出し
         */
        super();

        const length = 10;
        for (let i = 0; i < length; i++) {
            const geometry = new THREE.SphereGeometry(30, 30, 30);
            const material = new THREE.MeshNormalMaterial();
            const mesh = new THREE.Mesh(geometry, material);

            const radian = (i / length) * Math.PI * 2;
            mesh.position.set(
                200 * Math.cos(radian),
                30, 200 * Math.sin(radian)
            );

            // 親クラスに追加
            this.add(mesh);
        }
    }
}