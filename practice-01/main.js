let scene, camera, renderer, cube;

function init() {
    // シーン
    scene = new THREE.Scene();
    
    // カメラ
    camera = new THREE.PerspectiveCamera(
        75, // カメラの離れ具合
        window.innerWidth / window.innerHeight, // アスペクト比
        0.1, // 視錐台の近さ？
        1000 // 視錐台の遠さ？
    );
    camera.position.z = 5; // カメラの位置
    
    // レンダリング
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // 出力先を設定
    document.body.appendChild(renderer.domElement);
    
    // ボックスを作成
    const geometry = new THREE.BoxGeometry(2, 2, 2); // ボックスサイズ
    // const material = new THREE.MeshBasicMaterial({color: 0x0000ff}); // ボックスカラー
    const texture = new THREE.TextureLoader().load("./img/concrete.png");
    const material = new THREE.MeshBasicMaterial({map: texture});
    cube = new THREE.Mesh(geometry, material); // ボックスを作成
    scene.add(cube); // シーンに追加
}

// アニメーション
function animate() {
    requestAnimationFrame(animate); // 自身を何度も呼んでアニメーションを描画
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera); // シーンとカメラを使ってレンダラーする＝ボックスを表現
}

// ウィンドウサイズ維持
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

init();
animate();