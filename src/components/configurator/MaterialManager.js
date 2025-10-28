import * as THREE from "three";

export class MaterialManager {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.cubeTextureloader = new THREE.CubeTextureLoader();
    this.start();
  }

  start() {
    this.envMap = this.cubeTextureloader.load([
      "textures/env2/posx.jpg",
      "textures/env2/negx.jpg",
      "textures/env2/posy.jpg",
      "textures/env2/negy.jpg",
      "textures/env2/posz.jpg",
      "textures/env2/negz.jpg",
    ]);
       
    // this.envMap = this.cubeTextureloader.load([
    //   "textures/env2/posx.jpg",
    //   "textures/env2/negx.jpg",
    //   "textures/env2/posy.jpg",
    //   "textures/env2/negy.jpg",
    //   "textures/env2/posz.jpg",
    //   "textures/env2/negz.jpg",
    // ]);

    this.atlas1 = this.textureLoader.load("textures/atlas-1.jpg");
    this.atlas1.colorSpace = THREE.SRGBColorSpace;
    this.atlas1.wrapS = THREE.RepeatWrapping;
    this.atlas1.wrapT = THREE.RepeatWrapping;

    this.wood1 = this.textureLoader.load("textures/tabletop/2/Color.jpg");
    this.wood1.colorSpace = THREE.SRGBColorSpace;
    this.wood1.wrapS = THREE.RepeatWrapping;
    this.wood1.wrapT = THREE.RepeatWrapping;


    //черный мрамор
    this.mramor = this.textureLoader.load("textures/tabletop/mramor-1-cube.jpg");
    this.mramor.colorSpace = THREE.SRGBColorSpace;
    this.mramor.wrapS = THREE.RepeatWrapping;
    this.mramor.wrapT = THREE.RepeatWrapping;


    this.mramor2 = this.textureLoader.load("textures/tabletop/Marble/Color.jpg");
    this.mramor.colorSpace = THREE.SRGBColorSpace;
    this.mramor.wrapS = THREE.RepeatWrapping;
    this.mramor.wrapT = THREE.RepeatWrapping;


    this.mramorLong2 = this.textureLoader.load("textures/tabletop/mramor-2-long.jpg");
    this.mramor.colorSpace = THREE.SRGBColorSpace;
    this.mramor.wrapS = THREE.RepeatWrapping;
    this.mramor.wrapT = THREE.RepeatWrapping;

    this.woodLong = this.textureLoader.load(
      "textures/tabletop/wood-long-2.jpg"
    );
    this.woodLong.colorSpace = THREE.SRGBColorSpace;
    this.woodLong.wrapS = THREE.RepeatWrapping;
    this.woodLong.wrapT = THREE.RepeatWrapping;
  }

  // текстура длиной 3 * 0.6
    setTexture(width , axis) {
      const texture = this.mramorLong2.clone();
   //   const texture = this.woodLong.clone();


    texture.center.set(0.5, 0.5);

    if (axis === 'z') {
      texture.rotation = Math.PI / 2; // Поворот на 90 градусов
    }

      const repeatX = Number((width / 3).toFixed(2));
  //   console.log("repetX", repeatX);
      //    this.atlas1.repeat.set(repeatX,1);
      texture.repeat.set(repeatX, 1);

      const atlasMaterial = new THREE.MeshPhysicalMaterial({
        map: texture,
    //   envMap: this.envMap,
    //   envMapIntensity: 0.5,
      // metalness: 0.3, // почти не металл
      // clearcoat: 1.0, // добавляет слой лака
      });

      return atlasMaterial;
    }

  // текстура квадрат
  setTexture2(width , axis) {
   // const texture = this.mramor.clone();
    const texture = this.mramor2.clone();

     texture.center.set(0.5, 0.5);

    if (axis === 'z') {
      texture.rotation = Math.PI / 2; // Поворот на 90 градусов
    }


    const repeatX = Number((width / 0.6).toFixed(2));
 //   console.log("repetX", repeatX);
    //    this.atlas1.repeat.set(repeatX,1);
    texture.repeat.set(repeatX, 1);

    const atlasMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      //   envMap: this.envMap,
       //  envMapIntensity: 0.2,
      //  metalness: 0.1, // почти не металл
      roughness: 0.2, // почти гладкий
        clearcoat: 1.0, // добавляет слой лака
    });

    return atlasMaterial;
  }
}
