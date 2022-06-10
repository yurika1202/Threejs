window.addEventListener('DOMContentLoaded', init);

function init() {
    const width = 960;
    const height = 540;
    
    const canvasElement = document.querySelector('#myCanvas');
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
    });
    renderer.setSize(width, height);
    
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
    );
    camera.position.set(0, 0.3, 2);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // 3Dデータの読み込み
    const loader = new THREE.GLTFLoader();
    // パス指定
    loader.load('./model/building_sheep.glb', (gltf) => {
        // 読み込んで3D空間に追加
        const model = gltf.scene;
        scene.add(model);
    })
    
    tick();
    function tick() {
    
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}