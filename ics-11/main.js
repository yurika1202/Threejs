/*
3Dオブジェクトのグループ化（入れ子構造）
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
    camera.position.set(-100, 150, 500);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene.add(new THREE.GridHelper(600));
    scene.add(new THREE.AxesHelper(300)); // 軸の視覚化

    // グループの作成
    const group = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < 10; i++) {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(30, 30, 30), 
            new THREE.MeshNormalMaterial()
        );

        const radian = (i / 10) * Math.PI * 2;
        mesh.position.set(
            200 * Math.cos(radian), // x
            30, // y
            200 * Math.sin(radian) // z
        );

        group.add(mesh);
    }

    tick();
    function tick() {
        group.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}