window.addEventListener('load', init);

function init() {
    // ボックス（地球）のサイズ
    const width = 960;
    const height = 540;
    let rot = 0; // 回転

    // シーン
    const scene = new THREE.Scene();

    // カメラ
    const camera = new THREE.PerspectiveCamera(
        45,
        width / height
    );

    // レンダリング
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    }); // canvasの中でレンダリング
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 球体
    const geometry = new THREE.SphereGeometry(300, 30, 30);
    const material = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load("img/earthmap.jpg")
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
    directionalLight.position.set(1, 1, 1); // 光源の座標位置
    scene.add(directionalLight);

    // ポイント光源
    const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
    scene.add(pointLight);
    // 光源のヘルパー（どんな状態かを確認する）
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
    scene.add(pointLightHelper);

    // 星屑
    function createStarField() {
        // 座標値がランダムに入った配列を500個つくる
        const vertices = [];
        for(let i = 0; i < 500; i++) {
            const x = 3000 * (Math.random() - 0.5);
            const y = 3000 * (Math.random() - 0.5);
            const z = 3000 * (Math.random() - 0.5);
            vertices.push(x, y, z);
        }
        // 星屑を作成
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            // 表示位置に先ほど取得したランダムな座標位置を設定
            "position", new THREE.Float32BufferAttribute(vertices, 3)
            );
            const material = new THREE.PointsMaterial({
                size: 8,
                color: 0xffffff,
        });
        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
    }
    createStarField();

    // アニメーション
    function tick() {
        rot += 0.5; // 角度を0.5度ずつ追加
        const radian = (rot * Math.PI) / 180; // ラジアンに変換

        // 角度に応じてカメラの位置も変更する
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 2000 * Math.cos(radian);

        // カメラ位置の固定
        camera.lookAt(new THREE.Vector3(0, 0, -400));

        // 光源をまわす
        pointLight.position.set(
            500 * Math.sin(Date.now() / 1000), // x
            500 * Math.sin(Date.now() / 1000), // y
            500 * Math.cos(Date.now() / 1000) // z
        );
        /*
        かける値を変更すると、ジオメトリとポイント光源の距離が変わる。
        Date.now()を使う意味：継続時間に対して角度を更新させていくため。
        */

        // レンダリング
        renderer.render(scene, camera);
        // フレーム毎に自身を呼び出し、角度とカメラ位置を常に更新・レンダリングする
        requestAnimationFrame(tick); 
    }
    tick();

    // ウィンドウサイズ維持
    function onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // カメラの調整
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        // レンダラーの調整
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
    }
    onResize();
    window.addEventListener('resize', onResize);
}