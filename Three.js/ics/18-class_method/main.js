/**
 * 時間経過でグループアニメーションを実行する場合、
 * requestAnimationFrame()を随所に使用することは
 * コードの可読性や処理の負荷的観点からよくない。
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
    camera.position.set(0, 0, 500);

    const myGroup = new MyGroup();
    scene.add(myGroup);

    tick();
    function tick() {
        myGroup.update();

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

/**
 * THREE.Object3D：
 * 3D空間でオブジェクトを操作するための一連のプロパティとメソッドを提供する。
 * オブジェクトを子として追加する.addメソッドを介して、グループ化するために使用。
 */
class MyGroup extends THREE.Object3D {
    constructor() {
        super();

        this.sphere = new THREE.Mesh(new THREE.SphereGeometry(40, 20, 40), new THREE.MeshNormalMaterial());
        this.donuts = new THREE.Mesh(new THREE.TorusGeometry(120, 40, 60, 60), new THREE.MeshNormalMaterial());
        this.add(this.sphere);
        this.add(this.donuts);
    }

    // 更新命令
    update() {
        this.sphere.position.x = 200 * Math.sin(Date.now() / 500);
        this.donuts.rotation.y += 0.01;
    }
}