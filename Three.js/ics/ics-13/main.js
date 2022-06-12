/**
 * オブジェクト交差（マウスホバー時やクリック時）を調べるには、
 * レイキャスト機能を使う。
 * レイキャスト：ある地点から特定の方向に向けて透明な線を引き、
 * ぶつかった対象物を検出する。
 */

window.addEventListener('DOMContentLoaded', init);

function init() {
    const width = 960;
    const height = 540;
    const canvas = document.querySelector('#myCanvas');

    // マウス座標管理用のベクトル
    const mouse = new THREE.Vector2();

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, 1000);

    
    // マウス交差を調べるものを配列に格納
    const meshList = [];
    for (let i = 0; i < 200; i++) {
        const geometry = new THREE.BoxBufferGeometry(50, 50, 50);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 800; // 掛けているのは最大値
        mesh.position.y = (Math.random() - 0.5) * 800;
        mesh.position.z = (Math.random() - 0.5) * 800;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        scene.add(mesh);

        meshList.push(mesh);
    }

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // レイキャストの作成
    const raycaster = new THREE.Raycaster();

    // マウスイベントの登録
    canvas.addEventListener('mousemove', handleMouseMove);
    tick();

    // マウスを動かしたときのイベント
    function handleMouseMove(event) {
        const element = event.currentTarget; // イベントが登録されている要素を格納（＝canvas）
        // canvas上の座標位置
        const x = event.clientX - element.offsetLeft; // canvas内でのマウスのX座標 - canvasのビューポート左端からの距離
        const y = event.clientY - element.offsetTop;
        // canvasのサイズ
        const w = element.offsetWidth;
        const h = element.offsetHeight;

        // -1〜+1の範囲で現在のマウス座標を登録する
        mouse.x = (x / w) * 2 - 1;
        mouse.y = -(y / h) * 2 + 1;
    }

    function tick() {
        // レイキャスト生成（引数：座標、カメラ）
        raycaster.setFromCamera(mouse, camera);
        // 光線との交差をチェック
        const intersects = raycaster.intersectObjects(meshList);

        /**
         * map()：与えられた関数の配列のすべての要素に対して呼び出し、
         * その結果からなる新しい配列を生成する。
         */
        meshList.map((mesh) => {
            // 交差物が1つ以上あり、それが最前面だったら色を変える
            if (intersects.length > 0 && mesh === intersects[0].object) {
                mesh.material.color.setHex(0xff0000);
            } else {
                mesh.material.color.setHex(0xffffff);
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}