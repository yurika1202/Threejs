// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', init);

// サイズを指定
const width = 960;
const height = 540;

// 角度の初期化
let rot = 0;

// マウス座標の初期化
let mouseX = 0;

function init() {
    // レンダラー
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    renderer.setSize(width, height);

    // シーン
    const scene = new THREE.Scene();

    // カメラ
    const camera = new THREE.PerspectiveCamera(45, width / height);

    // いろんなジオメトリ
    const geometry = new THREE.TorusKnotGeometry(100, 50, 100, 100);
    const material = new THREE.MeshNormalMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // マウスが動いている時にX座標を取得
    document.addEventListener('mousemove', (e) => {
        mouseX = e.pageX;
    })

    // アニメーション
    tick();
    function tick() {
        // オブジェクトを中心にカメラを回転させる
        // rot += 0.5; // 毎フレーム角度を0.5度ずつ加える
        // const radian = rot * Math.PI / 180; // ラジアン変換
        // camera.position.x = 1000 * Math.sin(radian); // 円周の半径 * Math.sin(角度 * Math.PI / 180);
        // camera.position.z = 1000 * Math.cos(radian);
        // camera.lookAt(new THREE.Vector3(0, 0, 0)); // カメラが常に(0,0,0)の座標を見るように指定

        // マウスの座標に合わせてカメラを回転させる
        const targetRot = (mouseX / window.innerWidth) * 360; // マウスのX座標がステージの何%位置か見て、360度を掛けて角度へ変換
        rot += (targetRot - rot) * 0.02; // 角度=角度+(目標値 - 現在地)*減速値
        const radian = rot * Math.PI / 180; // ラジアン変換
        camera.position.x = 1000 * Math.sin(radian); // 円周の半径 * Math.sin(角度 * Math.PI / 180);
        camera.position.z = 1000 * Math.cos(radian);
        camera.lookAt(new THREE.Vector3(0, 0, 0)); // カメラが常に(0,0,0)の座標を見るように指定
        mesh.rotation.y += 0.01; // オブジェクトは常に回転
        /*
        減速値？
        何秒で変化させるかを指定する値。この式はイージングの公式。
        */

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}