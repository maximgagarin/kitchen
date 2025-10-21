import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { addOutline } from "./addOutline";

export class LoaderModels2 {
  constructor(scene) {
    this.loader = new GLTFLoader();
    this.cache = {};
    this.scene = scene.scene;
    this.sceneMain = scene;
  }
  start() {
    const path = [
      { name: 'arrow', path: '/models/arrow.glb' },
    ];

    path.forEach((item) => {
      this.loader.load(item.path, (glb) => {
        let object = glb.scene;
        // object.updateMatrixWorld(true);
        // const box = new THREE.Box3().setFromObject(object);
        // const center = new THREE.Vector3();
        // box.getCenter(center);
        // object.position.sub(center);

        const group = new THREE.Group();
        group.add(object);
        // object.traverse((child) => {
        //     if (child.isMesh) {
        //       addOutline(child)
        //     }
        //   });


            //включить тень
  
   



        group.visible = false;

        this.scene.add(group);
        // 🔥 Прожарка
      //  console.log(this.sceneMain.renderer);
        this.sceneMain.renderer.render(this.scene, this.sceneMain.camera);
        this.cache[item.name] = group;
        console.log(`Модель ${item.name} загружена и "прожарена"`);
      });
    });
  }

  get(name) {
    return this.cache[name] ? this.cache[name].clone() : null;
  }
}
