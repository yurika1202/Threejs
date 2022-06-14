/*
フォグ：遠くのものが霞んで見えるような状態にする効果のこと。
Three.jsではカメラの開始距離から終点距離を設定することで、
その間に存在するオブジェクトが指定した色によって霞んで表示される。
*/

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

    const scene = new THREE.Scene();

    // フォグ
    scene.fog = new THREE.Fog(0x000000, 50, 2000); // 色、適用最小距離、適用最大距離

    const camera = new THREE.PerspectiveCamera(
        45,
        width / height,
    );
    camera.position.set(0, 0, 1000);

    /*
    THREE.Group()：オブジェクトのグループ操作を構文的に明確にする
    */
    const group = new THREE.Group(); // グループを作成
    scene.add(group);

    const geometry = new THREE.BoxBufferGeometry(50, 50, 50);
    const material = new THREE.MeshStandardMaterial();

    for (let i = 0; i < 1000; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 2000;
        mesh.position.y = (Math.random() - 0.5) * 2000;
        mesh.position.z = (Math.random() - 0.5) * 2000;
        /*
        Math.random() - 0.5：本来0.0以上1.0未満の値をランダムに返すMath.random()を、
        -0.5以上0.5未満のランダムな値を返すようにしている。
        つまり正負の割合がほぼ半々になる。
        ちなみに掛けているのは最大値で、2000までの範囲内で乱数を返す。
        */
       mesh.rotation.x = Math.random() * 2 * Math.PI;
       mesh.rotation.y = Math.random() * 2 * Math.PI;
       mesh.rotation.z = Math.random() * 2 * Math.PI;
       group.add(mesh);
    }

    scene.add(new THREE.DirectionalLight(0xff0000, 2)); // 平行光源
    scene.add(new THREE.AmbientLight(0x00ffff)); // 環境光源

    tick();
    function tick() {
        group.rotateY(0.01);
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }

}