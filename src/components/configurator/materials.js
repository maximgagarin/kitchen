import * as THREE from "three";

let textureLoader = new THREE.TextureLoader();
const loader = new THREE.CubeTextureLoader();

export const envMap2 = loader.load([
  'textures/env1/dark-s_nx.jpg',
  'textures/env1/dark-s_ny.jpg',
  'textures/env1/dark-s_nz.jpg',
  'textures/env1/dark-s_px.jpg',
  'textures/env1/dark-s_py.jpg',
  'textures/env1/dark-s_pz.jpg',
]);

export const envMap = loader.load([
  'textures/env2/posx.jpg',
  'textures/env2/negx.jpg',
  'textures/env2/posy.jpg',
  'textures/env2/negy.jpg',
  'textures/env2/posz.jpg',
  'textures/env2/negz.jpg',
]);



export let glass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,           // Цвет — белый
  metalness: 0,              // Не металл
  roughness: 0,              // Гладкая поверхность

  transparent: true,         // Прозрачный материал
  opacity: 0.3,               // Прозрачность

 // envMap: envMap,            // Карта окружения
  envMapIntensity: 1.5,      // Яркость отражений (увеличь для большего эффекта)

  reflectivity: 1.0,         // Сильные отражения (важно для стекла без transmission)
  clearcoat: 1.0,            // Лак
  clearcoatRoughness: 0.0,   // Гладкий лак

  ior: 1.45,                 // Преломление (не так заметно без transmission, но можно оставить)
});

const marbleTexture = textureLoader.load('textures/tabletop/13.jpg'); 
const atlas1 = textureLoader.load('textures/atlas-1.jpg'); 

atlas1.colorSpace = THREE.SRGBColorSpace


atlas1.wrapS = THREE.RepeatWrapping;
atlas1.wrapT = THREE.RepeatWrapping;

//  atlas1.wrapS = THREE.RepeatWrapping; // обрезаем, не повторяем
//  atlas1.wrapT = THREE.RepeatWrapping;
// atlas1.offset.set(0.5, 1);
   atlas1.repeat.set(0.5,1);




marbleTexture.colorSpace = THREE.SRGBColorSpace
marbleTexture.repeat.set(5, 1);
marbleTexture.wrapS = THREE.RepeatWrapping;
//marbleTexture.wrapT = THREE.RepeatWrapping;




export let tableTopMaterial = new THREE.MeshPhysicalMaterial({
  map: marbleTexture,
   envMap: envMap,  
    envMapIntensity: 0.2,
 metalness: 0.1, // почти не металл
  roughness: 0.3,  // почти гладкий
  clearcoat: 1.0,          // добавляет слой лака
});

export let atlasMaterial = new THREE.MeshPhysicalMaterial({
  map: atlas1,
  //envMap: envMap,  
  //envMapIntensity: 0.2,
 //metalness: 0.1, // почти не металл
 // roughness: 0.3,  // почти гладкий
  //clearcoat: 1.0,          // добавляет слой лака
});




// //плитка
// const diffuseMap = textureLoader.load('textures/Tiles1/Color.jpg'); // Цвет
// const normalMap = textureLoader.load('textures/Tiles1/NormalGL.jpg'); // Нормали
// const displacementMap = textureLoader.load('textures/Tiles1/Displacement.jpg');
// diffuseMap.colorSpace = THREE.SRGBColorSpace

// diffuseMap.wrapS = THREE.RepeatWrapping;
// diffuseMap.wrapT = THREE.RepeatWrapping;
// diffuseMap.repeat.set(3, 3); // Количество повторений текстуры по ширине и высоте

// normalMap.wrapS = THREE.RepeatWrapping;
// normalMap.wrapT = THREE.RepeatWrapping;
// normalMap.repeat.set(3, 3);

//дерево
const diffuseMap2 = textureLoader.load('textures/wood/2.jpg'); // Цвет
const normalMap2 = textureLoader.load('textures/wood/Normal.jpg'); // Нормали
const displacementMap2 = textureLoader.load('textures/wood/Displacement.jpg');
diffuseMap2.colorSpace = THREE.SRGBColorSpace

 diffuseMap2.wrapS = THREE.RepeatWrapping;
 diffuseMap2.wrapT = THREE.RepeatWrapping;
diffuseMap2.repeat.set(4, 4); // Количество повторений текстуры по ширине и высоте

normalMap2.wrapS = THREE.RepeatWrapping;
normalMap2.wrapT = THREE.RepeatWrapping;
normalMap2.repeat.set(4, 4);

// //фасад
// const facade = textureLoader.load('textures/wood/Color.jpg'); // Цвет
// facade.colorSpace = THREE.SRGBColorSpace

export const material = new THREE.MeshStandardMaterial({ color: "red" });

export const floorMaterial = new THREE.MeshPhysicalMaterial({
    map: diffuseMap2,

    normalMap: normalMap2,
    //aoMap: metalAO,
    // displacementMap: displacementMap,
     displacementScale: 0.9,
   // metalness: 0.3,  // Металл
    roughness: 0.1,  // Гладкая поверхность
   clearcoat: 1.0,  // Покрытие (эффект лака)
    clearcoatRoughness: 0.9 // Гладкость покрытия
  });

export const wallsMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  // transparent: true, // Включаем прозрачность
  opacity: 0.9, // Полупрозрачный материал (50%)
  //alphaTest: 0.5, // Опционально: для устранения артефактов
});

// export const wallMaterial = new THREE.MeshPhysicalMaterial({

//   map: diffuseMap,

//   normalMap: normalMap,
//   //aoMap: metalAO,
//   // displacementMap: displacementMap,
//    displacementScale: 0.9,
//  // metalness: 0.3,  // Металл
//   roughness: 0.1,  // Гладкая поверхность
//  clearcoat: 1.0,  // Покрытие (эффект лака)
//   clearcoatRoughness: 0.9 // Гладкость покрытия
// });

export const whiteMaterial = new THREE.MeshPhysicalMaterial({
  color: "white",
  // transparent: true,
  // opacity: 0.3, // Полупрозрачность (0 — полностью прозрачный, 1 — непрозрачный)
 

  // normalMap: normalMap,
  //aoMap: metalAO,
  // displacementMap: displacementMap,
  //displacementScale: 0.9,
  //  metalness: 0.1,  // Металл
  roughness: 0.2, // Гладкая поверхность
  //clearcoat: 0.8, // Покрытие (эффект лака)
  clearcoatRoughness: 0.1, // Гладкость покрытия
});

export const blackMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,

  // normalMap: normalMap,
  //aoMap: metalAO,
  // displacementMap: displacementMap,
  //displacementScale: 0.9,
  metalness: 1, // Металл
  roughness: 1, // Гладкая поверхность
  clearcoat: 1.0, // Покрытие (эффект лака)
  //c5learcoatRoughness: 0.9 // Гладкость покрытия
});

export const woodMaterial = new THREE.MeshPhysicalMaterial({
  // map:diffuseMap2,
  // color: 0xffffff,

  // normalMap: normalMap,
  //aoMap: metalAO,
  // displacementMap: displacementMap,
  //displacementScale: 0.9,
  metalness: 0.1, // Металл
  roughness: 0.4, // Гладкая поверхность
  clearcoat: 1.0, // Покрытие (эффект лака)
  clearcoatRoughness: 0.9, // Гладкость покрытия
});

//export const boxMaterial = new THREE.MeshStandardMaterial({color: 'white'})

export const boxMaterial = [
  new THREE.MeshStandardMaterial({ color: 0xdfc7af }), // Красная (передняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdfc7af }), // Зелёная (задняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdfc7af }), // Синяя (верхняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdfc7af }), // Жёлтая (нижняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdfc7af }), // лицевая
  new THREE.MeshStandardMaterial({ color: 0xdfc7af }), // задняя (правая сторона)rgb(1, 65, 1)
];

// export const tableTopMaterial = new THREE.MeshStandardMaterial({
//   color: 0x808080,
// });

export const doorMaterial = [
  new THREE.MeshStandardMaterial({ color: 0xdcdcdc }), // Красная (передняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdcdcdc }), // Зелёная (задняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdcdcdc }), // Синяя (верхняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdcdcdc }), // Жёлтая (нижняя сторона)
  new THREE.MeshStandardMaterial({ color: 0xdcdcdc }), // лицевая
  new THREE.MeshStandardMaterial({ color: 0xdcdcdc }), // задняя (правая сторона)rgb(1, 65, 1)
];

export const basicMaterial = new THREE.MeshStandardMaterial({
  color: 0xf2f2f2,
});

export const BoxForSinkMaterial = new THREE.MeshStandardMaterial({
  color: 0xD2691E,
});

export const cabinetMaterial = new THREE.MeshStandardMaterial({
  color: 0xc8a8a8, // Цвет мебели
  roughness: 0.5,
});

export const door2 = new THREE.MeshPhysicalMaterial({
  color: 0xdcdcdc,

  //aoMap: metalAO,
  // displacementMap: displacementMap,
  displacementScale: 0.9,
  metalness: 0.2, // Металл
  roughness: 0.2, // Гладкая поверхность
  clearcoat: 1.0, // Покрытие (эффект лака)
  clearcoatRoughness: 0.9, // Гладкость покрытия
});


export const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1, // это ключ к "настоящему" стеклу
  transparent: true,
  opacity: 1,
  ior: 1.45, // индекс преломления стекла
  thickness: 0.2, // толщина, влияет на искажения
  envMapIntensity: 1,
});

export const lowerCabinetMaterial = new THREE.MeshPhysicalMaterial({
  color: "white",
  // transparent: true,
  // opacity: 0.3, // Полупрозрачность (0 — полностью прозрачный, 1 — непрозрачный)
 

  // normalMap: normalMap,
  //aoMap: metalAO,
  // displacementMap: displacementMap,
  //displacementScale: 0.9,
  //  metalness: 0.1,  // Металл
  roughness: 0.2, // Гладкая поверхность
  clearcoat: 0.8, // Покрытие (эффект лака)
  clearcoatRoughness: 0.1, // Гладкость покрытия
});