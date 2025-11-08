import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats-js";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";


import { envMap } from "./materials";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { gsap } from "gsap";

export class SceneSetup {
  constructor(container) {
    this.kitchenStore = useKitchenSizesStore()
    this.container = container;
    this.scene = new THREE.Scene();
    this.updateMouseEvent = false
    this.scene.background = new THREE.Color(0xf2f2f2);

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight,  0.1,  100);
    this.camera.position.set(5, 4, 7);
    this.targetPosition = new THREE.Vector3(2, 1, 0);
    this.camera.lookAt(this.targetPosition);

    //this.axis = new THREE.AxesHelper(3)
    //this.scene.add(this.axios)
        this.scene.fog = new THREE.Fog(0xf2f2f2, 8, 15);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //  this.renderer.shadowMap.type = THREE.VSMShadowMap;

    //his.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //this.renderer.toneMappingExposure = 1.2;
   // this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none";
    document.body.appendChild(this.labelRenderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 2;
    this.controls.maxDistance = 7;
   // this.controls.minPolarAngle = THREE.MathUtils.degToRad(30);
   // this.controls.maxPolarAngle = THREE.MathUtils.degToRad(90);

    // Ограничение горизонтального поворота (в радианах)
    // Например, от -45° до 45° вокруг целевой точки
   // this.controls.minAzimuthAngle =  THREE.MathUtils.degToRad(-80);
  //  this.controls.maxAzimuthAngle = THREE.MathUtils.degToRad(85);
    this.controls.enablePan = true
    this.controls.target.copy(this.targetPosition);
    this.controls.update();

    // --- 📊 Инициализация FPS-монитора ---
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: FPS, 1: ms, 2: mb, 3+: custom
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.left = "0px";
    this.stats.dom.style.top = "0px";
    this.stats.dom.style.transform = "scale(1.5)";
    this.stats.dom.style.transformOrigin = "left top"
    document.body.appendChild(this.stats.dom);
    // --------------------------------------

    this.needsRender = true;
    this.needMouseEvent = false

    this.controls.addEventListener("change", () => {
      this.needsRender = true;
    });

    window.addEventListener("resize", () => this.onWindowResize());

    this.startRenderLoop();
    
  }

  startRenderLoop() {
    const loop = () => {
      this.stats.begin(); // 🔹 Начало замера FPS
      if (this.needsRender) {
        this.render();
        this.needsRender = false;
      }
      this.needMouseEvent = true

      this.stats.end(); // 🔹 Конец замера FPS
      requestAnimationFrame(loop);
    };
    loop();
  }

  requestRender() {
    this.needsRender = true;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.requestRender();
  }

  moveCameraTo(targetPosition, targetLookAt, duration = 2, onComplete = null) {
    gsap.to(this.camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        this.requestRender();
      }
    });

    const lookAt = {
      x: this.controls.target.x,
      y: this.controls.target.y,
      z: this.controls.target.z
    };

    gsap.to(lookAt, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        this.controls.target.set(lookAt.x, lookAt.y, lookAt.z);
        this.controls.update();
        this.requestRender();
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }
}
