window.addEventListener('DOMContentLoaded', init);

function init() {
    const width = 960;
    const height = 540;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // レンダラーの影を有効にする
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        width / height
    );
    camera.position.set(20, 20, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 床
    const meshFloor = new THREE.Mesh(
        new THREE.BoxGeometry(2000, 0.1, 2000),
        new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.0 // 素材の粗さ。0.0は鏡面反射を意味する。
        })
    );
    meshFloor.receiveShadow = true; // 床に影をつけれるように設定
    scene.add(meshFloor);

    // オブジェクト
    const meshKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(3, 1, 100, 16),
        new THREE.MeshStandardMaterial({
            color: 0xaa0000,
            roughness: 0.0
        })
    );
    meshKnot.position.set(0, 5, 0);
    meshKnot.castShadow = true; // オブジェクトに影をつける
    scene.add(meshKnot);

    //  照明
    const light = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 4, 1); // 色、強さ、距離、最大角度、半影の割合、減衰量
    light.castShadow = true; // 影を有効にする
    light.shadow.mapSize.width = 2048; // 影の解像度を高くする。設定値は2の累乗であること。
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    tick();
    function tick() {
        renderer.render(scene, camera);

        // 照明の位置
        const t = Date.now() / 2000; // 回転スピード
        const r = 20.0; // オブジェクトとの距離（照らす範囲）
        const lx = r * Math.cos(t);
        const lz = r * Math.sin(t);
        const ly = 20.0 + 5.0 * Math.sin(t / 3.0);
        light.position.set(lx, ly, lz);

        requestAnimationFrame(tick);
    }
}