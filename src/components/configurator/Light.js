import * as THREE from "three";
import { CameraHelper } from "three";

export class Light {
  constructor() {
    this.ambientLight = new THREE.AmbientLight("white", 1);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
   // this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.left = -5;
    this.directionalLight.shadow.camera.right = 5;
    this.directionalLight.shadow.camera.top = 5;
    this.directionalLight.shadow.camera.bottom = -5;
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 10;
   this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.bias = -0.001;
   this.directionalLight.shadow.normalBias = 0.001;
    this.directionalLight.shadow.radius = 0.5;

    // // 2️⃣ — огромная карта теней
    // this.directionalLight.shadow.mapSize.width = 4096; // можно даже 8192, если видеопамяти хватает
    // this.directionalLight.shadow.mapSize.height = 4096;

    // // 3️⃣ — очень тонкий bias
    // this.directionalLight.shadow.bias = -0.0001;
    // this.directionalLight.shadow.normalBias = 0.002;

    // // 4️⃣ — мягкость (только для PCFSoftShadowMap)
    // this.directionalLight.shadow.radius = 2;

    this.directionalLight.position.set(3, 5, 2);
    this.directionalLight.target.position.set(2, 0, 0);

    this.directionalLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      0.5
    );

    this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    this.directionalLight2.position.set(1, 1, 3);

    this.directionalLightHelper2 = new THREE.DirectionalLightHelper(
      this.directionalLight2,
      0.5
    );

    this.spotLight = new THREE.SpotLight(0xffffff, 2);
    this.spotLight.position.set(2, 2, 3);
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.6;
    this.spotLight.decay = 0.2;
    this.spotLight.distance = 5;
    this.spotLight.castShadow = false;

    this.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.5);

    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);

    this.shadowCameraHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );

    this.pointLight = new THREE.PointLight(0xffffff, 1, 100, 0.5);
    this.pointLight.position.set(2, 1.2, 0.3); // Позиция в пространстве
    this.pointlightHelper = new THREE.PointLightHelper(this.pointLight, 0.5);
  }

  addToScene(scene) {
    scene.add(this.ambientLight);
    scene.add(this.directionalLight);
    //     scene.add(this.directionalLightHelper);
    // scene.add(this.directionalLight2);
    // scene.add(this.directionalLightHelper2);
    //  scene.add(this.spotLight);
    // scene.add(this.spotLightHelper);
    // scene.add(this.shadowCameraHelper);
    //  scene.add(this.pointLight);
    // scene.add(this.pointlightHelper);
  }
}
