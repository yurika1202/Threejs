/**
 * ジオメトリの結合：
 * 大量のオブジェクトを描画したときの最適化として便利。
 * WebGLの一般的な知識として重要！
 * ただし個別のマテリアル設定やマウスイベントの設定はできないので、
 * インタラクションしないもの、アニメーションしないものに結合テクニックを使用する。
 */

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
    camera.position.set(0, 0, 400);

    const CELL_NUM = 25; // 1辺あたりに配置するオブジェクト個数
    const boxes = []; //結合用のジオメトリを格納する配列

    for (let i = 0; i < CELL_NUM; i++) {
        for (let j = 0; j < CELL_NUM; j++) {
            for (let k = 0; k < CELL_NUM; k++) {
                // 立方体の作成
                const geometryBox = new THREE.BoxGeometry(5, 5, 5);
                // 立方体の座標調整（translateメソッドは1回限りの実行）
                const geometryTranslated = geometryBox.translate(
                    10 * (i - CELL_NUM / 2),
                    10 * (j - CELL_NUM / 2),
                    10 * (k - CELL_NUM / 2)
                );
                
                boxes.push(geometryTranslated);
            }
        }
    }
    
    // ジオメトリのセットを単一のインスタンスにマージしてシーンに追加
    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(boxes);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // stats.jsを使って、フレームレートの数値を表示
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    document.body.appendChild(stats.domElement);

    tick();
    function tick() {
        mesh.rotation.x += Math.PI / 180;
        mesh.rotation.y += Math.PI / 180;

        renderer.render(scene, camera);

        // レンダリング情報を画面に表示
        document.getElementById('info').innerHTML = JSON.stringify(renderer.info.render, '', '    ');
        stats.update();

        requestAnimationFrame(tick);
    }
}