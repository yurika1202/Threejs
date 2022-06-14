import * as THREE from "./build/three.module.js";
import {FlyControls} from "./jsm/controls/FlyControls.js";
import {Lensflare, LensflareElement} from "./jsm/objects/Lensflare.js";

window.addEventListener('DOMContentLoaded', init);

let camera, scene, renderer;
let controls;
const width = window.innerWidth;
const height = window.innerHeight;

// 現在の経過時間を追跡する
const clock = new THREE.Clock();

function init() {
    camera = new THREE.PerspectiveCamera(40, width / height, 1, 15000);
    camera.position.set(0, 0, 250);
    
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
        antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding; // 画面を全体的に明るく

    const geometry = new THREE.BoxGeometry(250, 250, 250);

    // MeshPhongMaterial：鏡面ハイライトのある光沢表面の素材
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff, // 光沢と輝きの色
        shininess: 50, // ハイライトの強さ
    });

    for (let i = 0; i < 2500; i++) {
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
        mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
        mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        scene.add(mesh);
    }

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.03);
    scene.add(dirLight);

    // レンズフレアのテクスチャ作成
    const textureLoader = new THREE.TextureLoader();
    const textureFlare = textureLoader.load('./textures/LensFlare.png');

    // オリジナルのポイントライト作成
    addLight(0.08, 0.3, 0.9, 0, 0, -1000) // 色相、彩度、輝度、座標
    function addLight(h, s, l, x, y, z) {
        const light = new THREE.PointLight(0xffffff, 1.5, 2000); // 色、輝度、最大距離
        light.color.setHSL(h, s, l); // HSL値から色の追加設定
        light.position.set(x, y, z);
        scene.add(light);

        // レンズフレアの作成
        const lensFlare = new Lensflare();
        lensFlare.addElement(
            new LensflareElement(textureFlare, 700, 0, light.color), // テクスチャ、サイズ、光源からの距離、色
        );
        scene.add(lensFlare);
    }

    /**
     * FlyControls()：3D空間でカメラを任意に変換できる。
     * 例えば特定のターゲットに焦点を合わせるなど。
     */
    controls = new FlyControls(camera, renderer.domElement); // カメラ、イベント処理する要素
    controls.movementSpeed = 2500; // クリック時のZ軸移動のスピード
    controls.rollSpeed = Math.PI / 20; // カーソル追従スピード

    tick();
    onResize();
    window.addEventListener('resize', onResize);
}

function tick() {
    const delta = clock.getDelta(); // 経過時間を取得
    controls.update(delta); // コントロールを更新
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
