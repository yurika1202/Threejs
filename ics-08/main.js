window.addEventListener('DOMContentLoaded', init);

function init() {
    const width = 960;
    const height = 540;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // レンダラーの影を有効にする
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

    // const camera = new THREE.PerspectiveCamera(
    //     90, // fov（視野角）遠近感強＝大きく、遠近感弱＝小さく
    //     width / height,
    //     1,
    //     1000
    // );

    const camera = new THREE.OrthographicCamera(
        -480, // left
        +480, // right 
        270, // top
        -270, // bottom
        1, // near（レンダリング区間の開始距離）
        1000 // far（レンダリング区間の修了距離）
    );

    /*
    { }はブロック文であり、今回ラベルは省略されている。
    複数の文をJS的に1つにまとめるために使う。
    ブロックスコープを持っているため、ブロック外に同じ変数名が存在したとしてもエラーにはならない。
    */

    // 光源
    {
        const spotLight = new THREE.SpotLight(0xffffff, 4, 2000, Math.PI / 5, 0.2, 1.5); // 色、強さ、距離、角度、半影、減衰
        spotLight.position.set(500, 300, 500);
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        scene.add(spotLight);
    }

    // 地面
    {
        const texture = new THREE.TextureLoader().load('./img/floor.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // 水平・垂直方向にリピート
        texture.repeat.set(10, 10); // 10x10マス
        texture.magFilter = THREE.NearestFilter; // 最も近い距離にあるテクスチャ要素の値を返す（アンチエイリアスの削除）
    

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.0, // 粗さ
                metalness: 0.6, // 金属性
            })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
    }

    // オブジェクト
    {
        const material = new THREE.MeshStandardMaterial({
            color: 0x22dd22,
            roughness: 0.1,
            metalness: 0.2,
        });
        const geometry = new THREE.BoxGeometry(45, 45, 45);

        // オブジェクトの複製とランダム配置
        for(let i = 0; i < 60; i++) {
            const box = new THREE.Mesh(geometry, material);
            box.position.x = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
            box.position.y = 25;
            box.position.z = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
            // 影
            box.receiveShadow = true; // 陰
            box.castShadow = true; // 影
            scene.add(box);
        }
    }

    tick();
    function tick() {
        // 角度に応じてカメラ位置を設定
        camera.position.x = 500 * Math.sin(Date.now() / 3000);
        camera.position.y = 250;
        camera.position.z = 500 * Math.cos(Date.now() / 3000);
        // 原点をみる
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}