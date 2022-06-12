/**
 * パーティクルの作成：THREE.Pointクラスを使用
 */

window.addEventListener('DOMContentLoaded', init);

function init() {
    const width = 960;
    const height = 540;
    // 初期値角度
    let rot = 0;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height);

    // 星屑の作成
    createStarField();
    function createStarField() {
        /**
         * 直方体エリア（一辺3000の距離）の中へランダムに1000個の粒子を配置する。
         */

        // 頂点情報を格納する配列を作成
        const vertices = [];
        // 配置情報
        const SIZE = 3000; // 範囲
        const LENGTH = 1000; // 個数

        // 頂点座標の登録
        for (let i = 0; i < LENGTH; i++) {
            const x = SIZE * (Math.random() - 0.5);
            const y = SIZE * (Math.random() - 0.5);            
            const z = SIZE * (Math.random() - 0.5);            
            
            vertices.push(x, y, z);
        }

        // 頂点からジオメトリーを作成
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        /**
         * Float32Array：32ビット浮動小数点数の配列を表す。
         * BufferAttribute：BufferGeometryに関連付けられた属性のデータを格納する。
         * 今回の場合の引数は（頂点位置、頂点に関連付けの必要がある値の数）
         */

        // ポイントマテリアルの作成
        const material = new THREE.PointsMaterial({
            size: 10,
            color: 0xffffff,
        });

        const mesh = new THREE.Points(geometry, material);
        scene.add(mesh);
    }

    tick();
    function tick() {
        rot += 0.5; // 1度ずつ追加
        const radian = (rot * Math.PI) / 180; // ラジアンに変換
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}