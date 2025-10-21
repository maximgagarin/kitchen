import { UpperCabinet } from "./cabinets/UpperCabinet";
import { LowerCabinet } from "./cabinets/LowerCabinet";
import { CaseCabinet } from "./cabinets/CaseCabinet";
import { useRowSegmentsStore } from "../../pinia/RowSegments";
import { DimensionLine } from "./builders/DimensionLine";
import { glass , atlasMaterial} from "./materials";


import config4 from "../config/config4";
import config from "../config/config";
import * as THREE from "three";
import { mod } from "three/tsl";

export class CabinetBuilder {
  constructor(sceneSetup, loaderModels, kitchenSizesStore, penalStore) {
    this.scene = sceneSetup.scene;
    this.sceneSetup = sceneSetup;
    this.width = 0;
    this.loaderModels = loaderModels;
    this.kitchenSizesStore = kitchenSizesStore; // хранлище размеров кухни pinia
    this.penalStore = penalStore; // pinia пеныла
    this.rowSegmentsStore = useRowSegmentsStore();

    this.start();
  
 //   this.test2()
  

    this.height = config.kitchen_size.height;
    this.tableTopAll = [];

    // this.create_backsplash()

    // ← для отладки
  }

  test1(){
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.5,0.038,0.6), atlasMaterial )
    box.position.set(2,1,1)
    this.scene.add(box)

  }

  test2(){
   setTimeout(()=>{
    console.log('123')
        const model = this.loaderModels.get('ПГС2-600');   
        model.visible = true;
        model.position.set(1, 1.44, 1);
        this.scene.add(model);
         this.getObjectTexturesSize(model);
      this.sceneSetup.requestRender()
   }, 12000)

   

  

  
  }

  getObjectTexturesSize(obj) {
    const seen = new Set(); // уникальные текстуры
    let total = 0;
  
    obj.traverse(child => {
      if (child.isMesh && child.material) {
        // пропускаем troika Text
        if (child.isTroikaText || child.material.baseMaterial) return;
  
        const mats = Array.isArray(child.material) ? child.material : [child.material];
  
        mats.forEach(mat => {
          for (const key in mat) {
            const val = mat[key];
            if (val && val.isTexture && !seen.has(val.uuid)) {
              const sizeMB = this.getTextureSizeMB(val);
              total += sizeMB;
              seen.add(val.uuid);
              console.log(`${child.name} | ${key}: ${sizeMB.toFixed(2)} MB`);
            }
          }
        });
      }
    });
  
    console.log(`Всего текстур: ${total.toFixed(2)} MB`);
    return total;
    }
  
  getTextureSizeMB(tex) {
    if (!tex) return 0;
  
    let w = 0, h = 0;
  
    // обычные текстуры
    if (tex.image) {
      if (Array.isArray(tex.image)) {
        w = tex.image[0]?.width || 0;
        h = tex.image[0]?.height || 0;
      } else {
        w = tex.image.width || 0;
        h = tex.image.height || 0;
      }
    }
    // WebGLRenderTarget / PMREM (envMap)
    else if (tex.source && tex.source.data) {
      w = tex.source.data.width || 0;
      h = tex.source.data.height || 0;
    }
  
    if (!w || !h) return 0;
  
    let bpp = 4; // RGBA8
    if (tex.type === THREE.FloatType) bpp = 16;
    if (tex.type === THREE.HalfFloatType) bpp = 8;
  
    // если кубмап → ×6, мипы +33%
    const factor = tex.isCubeTexture ? 6 * 1.33 : 1.33;
  
    return (w * h * bpp * factor) / (1024 * 1024); // МБ
    }


 

  start() {
    Object.keys(config4.start).forEach((category) => {
      if (Array.isArray(config4.start[category])) {
        config4.start[category].forEach((elem) => {
          if (typeof this[elem.funk] === "function") {
            this[elem.funk](...elem.params);
          }
        });
      }
    });
    config.type = "direct";

    let lineDirect = new DimensionLine(this.sceneSetup,this.scene, { x: 0, y: 2.5, z: 0.01 }, { x: 3, y: 2.5, z: 0.01 }, 0);
    lineDirect.name = "lineDirect";
    config.lines.push(lineDirect);

    let lineLeft = new DimensionLine(this.sceneSetup, this.scene, { x: 0.01, y: 2.5, z: 0 }, { x: 0.01, y: 2.5, z: 2.75 }, 1);
    lineLeft.name = "lineLeft";
    lineLeft.visibleOff()
    config.lines.push(lineLeft);

    let lineRight = new DimensionLine(this.sceneSetup, this.scene, { x: 3, y: 2.5, z: 0 }, { x:3, y: 2.5, z: 2.75 }, 1);
    lineRight.name = "lineRight";
    lineRight.visibleOff()
    config.lines.push(lineRight);

    let lineHeight = new DimensionLine(this.sceneSetup, this.scene, { x: 3.1, y: 0, z: 0.01 }, { x:3.1, y: 2.12, z: 0.01 }, 0, true);
    lineHeight.name = "lineHeight";
    //lineHeight.visibleOff()
    config.lines.push(lineHeight);

   // console.log('1')
  }

  deleteLowRows() {
    [
      "build_direct_l1",
      "build_left_l1",
      "build_right_l1",
      "build_left_l2",
      "build_direct_l2",
    ].forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
  }

  deleteAll() {
    [
      "build_direct_l2",
      "build_direct_l1",
      "build_left_l1",
      "build_left_l2",
      "build_right_l1",
      "build_right_l2",
      "build_left_short_l2",

      "build_right_short_l2",
      "build_right_long_l2",
      "build_left_long_l2",
      "CaseCabinet",
      "build_direct_l3",
      "build_left_l3",
      "build_left_long_l3",
      "build_left_short_l3",
      "build_right_l3",
      "build_right_long_l3",
      "build_right_short_l3",
      "leftPenal",
      "rightPenal",
      "directRightPenal",
      "directLeftPenal",
      "build_upper_penal_level2",
      "build_upper_penal_level3",
    ].forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
  }

  deleteAll2() {
    const namesToRemove = [
      "build_direct_l2",
      "build_direct_l1",
      "build_left_l1",
      "build_left_l2",
      "build_right_l1",
      "build_right_l2",

      "build_right_short_l2",
      "build_right_long_l2",
      "build_left_long_l2",
      "CaseCabinet",
      "build_direct_l3",
      "build_left_l3",
      "build_left_long_l3",
      "build_left_short_l3",
      "build_right_l3",
      "build_right_long_l3",
      "build_right_short_l3",
      "leftPenal",
      "rightPenal",
      "directRightPenal",
      "directLeftPenal",
      "build_upper_penal_level2",
      "build_upper_penal_level3",
      "build_left_short_l2",
    ];

    const namesSet = new Set(namesToRemove);

    // Итерируем в обратном порядке чтобы избежать проблем с изменяющимся массивом
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const child = this.scene.children[i];
      if (namesSet.has(child.name)) {
        this.scene.remove(child);

        // Если нужно освободить ресурсы:
        if (child.dispose) child.dispose();
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    }
  }

  clearPenals(side) {
    config4.actual.leftPenal = [];
    config4.actual.rightPenal = [];
    config4.actual.directPenalRight = [];
    config4.actual.directPenalLeft = [];

    config4.actual.upper_penal_level2_left = [];
    config4.actual.upper_penal_level2_right = [];
    config4.actual.upper_penal_level2_directLeft = [];
    config4.actual.upper_penal_level2_directRight = [];

    config4.actual.upper_penal_level3_left = [];
    config4.actual.upper_penal_level3_right = [];
    config4.actual.upper_penal_level3_directLeft = [];
    config4.actual.upper_penal_level3_directRight = [];

    const namesToRemove = [
      "leftPenal",
      "rightPenal",
      "directRightPenal",
      "directLeftPenal",
      "build_upper_penal_level2",
      "build_upper_penal_level3",
    ];

    namesToRemove.forEach((name) => {
      const objects = this.scene.getObjectsByProperty("name", name);
      objects.forEach((obj) => {
        this.scene.remove(obj);
        console.log("deleeeete");

        if (obj.geometry) {
          obj.geometry.dispose();
        }

        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      });
    });

    config.row_offsets.offsetDirectLeft = 0; // обнулить свиг для прямых радов т.к. удалили пеналы

    config.offset_for_rows.offsetDirectLeft = 0;
    config.offset_for_rows.offsetDirectRight = 0;
    config.offset_for_rows.offsetLeft = 0;
    config.offset_for_rows.offsetRight = 0;

    config.countLeft = 0;
    config.countMaxLeft = 0;
    config.countDirectRight = 0;
    config.countMaxDirectRight = 0;

    config.countRight = 0;
    config.countMaxRight = 0;

    config.countDirectLeft = 0;
    config.countMaxDirectLeft = 0;

    config.kitchen_size.side_c_row = config.kitchen_size.side_c - 0.55;
    config.kitchen_size.side_d_row = config.kitchen_size.side_d - 0.55;
    config.kitchen_size.width_row = config.kitchen_size.width;

    // const names = ['leftPenal', 'rightPenal'];

    // names.forEach(name => {
    //   const obj = this.scene.getObjectByName(name);
    //   if (obj) {
    //     // Рекурсивно удаляем геометрию и материалы всех детей
    //     obj.traverse(child => {
    //       if (child.isMesh) {
    //         if (child.geometry) {
    //           child.geometry.dispose();
    //         }
    //         if (child.material) {
    //           if (Array.isArray(child.material)) {
    //             child.material.forEach(mat => mat.dispose());
    //           } else {
    //             child.material.dispose();
    //           }
    //         }
    //       }
    //     });
    //     this.scene.remove(obj);
    //   }
    // });
  }

  //удаляем ряды после переустановки раковины
  deleteRows() {
    [
      "build_direct_l2",
      "build_direct_l1",
      "build_left_l1",
      "build_left_l2",
      "build_right_l1",
      "build_right_l2",
      "build_left_short_l2",
      "build_right_short_l2",
      "build_right_long_l2",
      "build_left_long_l2",

      "build_direct_l3",
      "build_left_l3",
      "build_left_long_l3",
      "build_left_short_l3",
      "build_right_l3",
      "build_right_long_l3",
      "build_right_short_l3",

      "build_upper_penal_level2",
      "build_upper_penal_level3",
    ].forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
  }
  //строит нижние ряды из хранилища
  buildLowerRows() {
    ["build_direct_l1", "build_left_l1", "build_right_l1"].forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });

    let segments = this.rowSegmentsStore.segments;

    //  Object.values(segments).forEach(sideArray => {
    //     sideArray.forEach(element => {
    //       if (element.type === 'build_direct_l1') {
    //        console.log(element.type)
    //       }
    //     });
    //   });

    Object.values(segments).forEach((sideArray) => {
      sideArray.forEach((element) => {
        if (
          ["build_direct_l1", "build_left_l1", "build_right_l1"].includes(
            element.type
          )
        ) {
          this[element.type](element.width, element.start);
        }
      });
    });
  }

  executeConfig(option, stateSizes) {
    this.sceneSetup.requestRender();
    this.deleteAll();

    if (!config4[option]) {
      console.error(`Опция ${option} не найдена в config4`);
      return;
    }

    config4.actual.leftLevel = [...config4[option].leftLevel];
    config4.actual.rightLevel = [...config4[option].rightLevel];
    config4.actual.direct = [...config4[option].direct];

    if (stateSizes === "currect") {
      console.log('currect')
      config4.actual.leftLevel.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.rowSizesWithPanels.side_c;
      });
      config4.actual.rightLevel.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.rowSizesWithPanels.side_d;
      });
      config4.actual.direct.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.rowSizesWithPanels.side_a;
      });
    } else if (stateSizes === "currectActual") {
      config4.actual.leftLevel.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.rowSizesCurrect.side_c ;
      });
      config4.actual.rightLevel.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.rowSizesCurrect.side_d ;
      });
      config4.actual.direct.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.rowSizesCurrect.side_a;
      });
    }

    else {
      config4.actual.leftLevel.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.sideSizes.side_c - 0.55;
      });
      config4.actual.rightLevel.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.sideSizes.side_d - 0.55;
      });
      config4.actual.direct.forEach((item) => {
        item.params[0] = this.kitchenSizesStore.sideSizes.side_a;
      });
    }

    Object.keys(config4.actual).forEach((category) => {
      config4.actual[category].forEach((elem) => {
        this[elem.funk](...elem.params);
      });
    });

   // console.log(this.lowerRows);
  }

  create_backsplash() {
    let backsplash = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.58, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x778899 })
    );
    backsplash.position.set(2, 1.13, 0);
    this.scene.add(backsplash);
  }

  build_direct_l2(width, height) {
    // console.log('direct2')

    this.width = width;
    this.scene.children
      .filter((child) => child.name && child.name.includes("build_direct_l2"))
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX = Number(this.kitchenSizesStore.offsetForLeftRow);
    let positionZ = 0;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new UpperCabinet(
        cabinetWidth,
        config.panels_size.height2level,
        0.3
      );
      cabinet.position.set(
        positionX + cabinetWidth / 2,
        Number(config.panels_size.height2level) === 0.9 ? 1.868 : 1.768,
        0
      );
      // cabinet.position.set(1, 0.45, (positionZ + cabinetWidth )/ 2);

      // cabinet.rotation.y = Math.PI/2
      this.scene.add(cabinet);

      cabinet.name = "build_direct_l2";

      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
  }

  build_direct_l1( width,  positionX = Number(this.kitchenSizesStore.offsetForLeftRow)) {
    //если шаг установки раковины отключение удаления

    const kitchenType = this.kitchenSizesStore.type

    if (this.kitchenSizesStore.delete_1level) {
      this.scene.children
        .filter((child) => child.name && child.name.includes("build_direct_l1"))
        .forEach((child) => {
          if (child.dispose) {
            child.dispose(); // Вызов метода dispose перед удалением
          }
          this.scene.remove(child);
        });
    }

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionZ = 0;

    for (let i = 0; i < cabinetCount; i++) {
      const isFirst = i === 0;
      const isLast = i === cabinetCount - 1;

      const cabinet = new LowerCabinet(
        isFirst && (kitchenType === "left" || kitchenType === "uShaped")
          ? cabinetWidth - 0.05
          : isLast && (kitchenType === "right" || kitchenType === "uShaped")
            ? cabinetWidth - 0.05
            : cabinetWidth,
        0.716, //высота
        0.5, //глубина
        kitchenType,
        isFirst,
        isLast
      );

      cabinet.position.set(
        isFirst && (kitchenType === "left" || kitchenType === "uShaped")
          ? positionX + cabinetWidth / 2 + 0.025
          : isLast && (kitchenType === "right" || kitchenType === "uShaped")
            ? positionX + cabinetWidth / 2 - 0.025
            : positionX + cabinetWidth / 2,
        0.458,
        0.06
      );

      this.scene.add(cabinet);

      cabinet.name = "build_direct_l1";
      cabinet.userData.index = i;

      positionX += cabinetWidth;
      positionZ += cabinetWidth;

      //   console.log(isLast)
    }

    //console.log(this.tableTopAll)
  }

  build_left_l1(width, positionZ = 0.56) {
    if (this.kitchenSizesStore.delete_leftLevel) {
      this.scene.children
        .filter((child) => child.name && child.name.includes("build_left_l1"))
        .forEach((child) => {
          if (child.dispose) {
            child.dispose(); // Вызов метода dispose перед удалением
          }
          this.scene.remove(child);
        });
    }

    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX = 0;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new LowerCabinet(cabinetWidth, 0.716, 0.5);
      cabinet.position.set(0.06, 0.458, positionZ + cabinetWidth / 2);
      cabinet.rotation.y = Math.PI / 2;
      cabinet.name = "build_left_l1";
      this.scene.add(cabinet);
      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
  }

  calculationPositionLevel3() {
    let topHeight;

    if (
      config.panels_size.height3level == 0.35 &&
      config.panels_size.height2level == 0.7
    ) {
      topHeight = 2.293;
    } else if (
      config.panels_size.height3level == 0.35 &&
      config.panels_size.height2level == 0.9
    ) {
      topHeight = 2.493;
    } else if (
      config.panels_size.height3level == 0.45 &&
      config.panels_size.height2level == 0.7
    ) {
      topHeight = 2.343;
    } else if (
      config.panels_size.height3level == 0.45 &&
      config.panels_size.height2level == 0.9
    ) {
      topHeight = 2.543;
    }
    return topHeight;
  }

  build_direct_l3(width) {
    let positionY = this.calculationPositionLevel3();
    // console.log('direct2')

    this.width = width;
    this.scene.children
      .filter((child) => child.name && child.name.includes("build_direct_l3"))
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX = Number(this.kitchenSizesStore.offsetForLeftRow);
    let positionZ = 0;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new UpperCabinet(
        cabinetWidth,
        config.panels_size.height3level,
        0.55
      );
      cabinet.position.set(
        positionX + cabinetWidth / 2,
        positionY,

        0
      );

      this.scene.add(cabinet);

      cabinet.name = "build_direct_l3";

      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
  }

  build_left_l2(width) {
    // let newWidth = Number(width)
    // newWidth += 0.02
    // console.log(newWidth)
    this.scene.children
      .filter((child) => child.name && child.name.includes("build_left_l2"))
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX =0;
    let positionZ = 0.55;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new UpperCabinet(
        cabinetWidth,
        config.panels_size.height2level,
        0.3
      );

      cabinet.position.set(
        0.01,
        Number(config.panels_size.height2level) === 0.9 ? 1.868 : 1.768,
        positionZ + cabinetWidth / 2
      );

      cabinet.rotation.y = Math.PI / 2;
      cabinet.name = "build_left_l2";
      this.scene.add(cabinet);

      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
    //console.log(this.scene)
  }

  build_left_l3(width) {
    this.scene.children
      .filter((child) => child.name && child.name.includes("build_left_l3"))
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX = 0;
    let positionZ = 0.55;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new UpperCabinet(
        cabinetWidth,
        config.panels_size.height3level,
        0.55
      );
      //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
      cabinet.position.set(
        0,
        this.calculationPositionLevel3(),
        positionZ + cabinetWidth / 2
      );

      cabinet.rotation.y = Math.PI / 2;
      cabinet.name = "build_left_l3";
      this.scene.add(cabinet);

      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
    //console.log(this.scene)
  }

  build_left_short_l3() {
    const cabinet = new UpperCabinet(0.23, 0.3, 0.5);
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(0, 2.25, 0.435);

    cabinet.rotation.y = Math.PI / 2;
    cabinet.name = "build_left_short_l3";
    this.scene.add(cabinet);
  }

  build_left_long_l3() {
    const cabinet = new UpperCabinet(
      0.55,
      config.panels_size.height3level,
      0.55
    );
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(0, this.calculationPositionLevel3(), 0.275);

    cabinet.rotation.y = Math.PI / 2;
    cabinet.name = "build_left_long_l3";
    this.scene.add(cabinet);
  }

  build_right_l3(width) {
    this.scene.children
      .filter((child) => child.name && child.name.includes("build_right_l3"))
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX = 0;
    let positionZ = 0.55;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new UpperCabinet(
        cabinetWidth,
        config.panels_size.height3level,
        0.55
      );
      //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
      cabinet.position.set(
        this.width,
        this.calculationPositionLevel3(),
        positionZ + cabinetWidth / 2
      );

      cabinet.rotation.y = -Math.PI / 2;
      cabinet.name = "build_right_l3";
      this.scene.add(cabinet);

      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
    //console.log(this.scene)
  }

  build_right_short_l3() {
    this.scene.children
      .filter(
        (child) => child.name && child.name.includes("build_right_short_l3")
      )
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    const cabinet = new UpperCabinet(
      0.23,
      config.panels_size.height3level,
      0.5
    );
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(this.width, 2.25, 0.435);

    cabinet.rotation.y = -Math.PI / 2;
    cabinet.name = "build_right_short_l3";
    this.scene.add(cabinet);
  }

  build_right_long_l3() {
    this.scene.children
      .filter(
        (child) => child.name && child.name.includes("build_right_long_l3")
      )
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    const cabinet = new UpperCabinet(
      0.6,
      config.panels_size.height3level,
      0.55
    );
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(this.width, this.calculationPositionLevel3(), 0.25);

    cabinet.rotation.y = -Math.PI / 2;
    cabinet.name = "build_right_long_l3";
    this.scene.add(cabinet);
  }

  build_left_short_l2() {
    this.scene.children
      .filter(
        (child) => child.name && child.name.includes("build_left_short_l2")
      )
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    const cabinet = new UpperCabinet(
      0.23,
      config.panels_size.height2level,
      0.3
    );
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(
      0.01,
      Number(config.panels_size.height2level) === 0.9 ? 1.868 : 1.768,
      0.435
    );

    cabinet.rotation.y = Math.PI / 2;
    cabinet.name = "build_left_short_l2";
    this.scene.add(cabinet);
  }

  build_left_long_l2() {
    this.scene.children
      .filter(
        (child) => child.name && child.name.includes("build_left_long_l2")
      )
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    const cabinet = new UpperCabinet(
      0.55,
      config.panels_size.height2level,
      0.3
    );
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(
      0.01,
      Number(config.panels_size.height2level) === 0.9 ? 1.868 : 1.768,
      0.275
    );

    cabinet.rotation.y = Math.PI / 2;
    cabinet.name = "build_left_long_l2";
    this.scene.add(cabinet);
  }

  build_right_long_l2() {
    this.scene.children
      .filter(
        (child) => child.name && child.name.includes("build_right_long_l2")
      )
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    const cabinet = new UpperCabinet(0.6, config.panels_size.height2level, 0.3);
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(
      this.width,
      Number(config.panels_size.height2level) === 0.9 ? 1.868 : 1.768,
      0.25
    );

    cabinet.rotation.y = -Math.PI / 2;
    cabinet.name = "build_right_long_l2";
    this.scene.add(cabinet);
  }

  build_right_short_l2() {
    this.scene.children
      .filter(
        (child) => child.name && child.name.includes("build_right_short_l2")
      )
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    const cabinet = new UpperCabinet(
      0.23,
      config.panels_size.height2level,
      0.3
    );
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(
      this.width,
      Number(config.panels_size.height2level) === 0.9 ? 1.868 : 1.768,
      0.435
    );

    cabinet.rotation.y = -Math.PI / 2;
    cabinet.name = "build_right_short_l2";
    this.scene.add(cabinet);
  }

  build_right_l2(width) {
    this.scene.children
      .filter((child) => child.name && child.name.includes("build_right_l2"))
      .forEach((child) => {
        if (child.dispose) {
          child.dispose(); // Вызов метода dispose перед удалением
        }
        this.scene.remove(child);
      });

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX = 0;
    let positionZ = 0.55;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new UpperCabinet(
        cabinetWidth,
        config.panels_size.height2level,
        0.3
      );
      //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
      cabinet.position.set(
        this.width,
        Number(config.panels_size.height2level) === 0.9 ? 1.868 : 1.768,
        positionZ + cabinetWidth / 2
      );

      cabinet.rotation.y = -Math.PI / 2;
      cabinet.name = "build_right_l2";
      this.scene.add(cabinet);

      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
  }

  build_right_l1(width, positionZ = 0.56) {
   // console.log(this.width);
    if (this.kitchenSizesStore.delete_rightLevel) {
      this.scene.children
        .filter((child) => child.name && child.name.includes("build_right_l1"))
        .forEach((child) => {
          if (child.dispose) {
            child.dispose(); // Вызов метода dispose перед удалением
          }
          this.scene.remove(child);
        });
    }

    // Определяем количество шкафов
    let cabinetCount = Math.ceil(width / 0.6);
    let cabinetWidth = width / cabinetCount; // Все шкафы подстраиваются под ширину

    let positionX = 0;

    for (let i = 0; i < cabinetCount; i++) {
      const cabinet = new LowerCabinet(cabinetWidth, 0.716, 0.5);
      //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
      cabinet.position.set(
        this.width - 0.06,
        0.458,
        positionZ + cabinetWidth / 2
      );

      cabinet.rotation.y = -Math.PI / 2;
      cabinet.name = "build_right_l1";
      this.scene.add(cabinet);

      positionX += cabinetWidth;
      positionZ += cabinetWidth;
    }
  }

  build_upper_penal_level3(x, xPos, zPos, rotate) {
    const rotationMap = {
      0: Math.PI / 2,
      1: -Math.PI / 2,
      2: 0,
    };

    const cabinet = new UpperCabinet(x, config.panels_size.height3level, 0.55);
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(xPos, this.calculationPositionLevel3(), zPos);

    cabinet.rotation.y = rotationMap[rotate];
    cabinet.name = "build_upper_penal_level3";
    this.scene.add(cabinet);
  }

  mooveRightModules(width) {
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_right_l1") {
        cabinet.position.x = width - 0.05;
      }
    });

    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_right_l2") {
        cabinet.position.x = width;
      }
    });
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_right_short_l3") {
        cabinet.position.x = width;
      }
    });
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_right_long_l2") {
        cabinet.position.x = width;
      }
    });
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_right_short_l2") {
        cabinet.position.x = width;
      }
    });
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_right_long_3") {
        cabinet.position.x = width;
      }
    });
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_right_l3") {
        cabinet.position.x = width;
      }
    });
    // this.scene.children.forEach((cabinet) => {
    //   if (cabinet.name === "rightPenal") {
    //     cabinet.position.x = width - 0.3;
    //   }
    // });
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_upper_penal_level2") {
        cabinet.position.x = width;
      }
    });
    this.scene.children.forEach((cabinet) => {
      if (cabinet.name === "build_upper_penal_level3") {
        cabinet.position.x = width;
      }
    });
  }

  movePenal(delta, type) {
    switch (type) {
      case "left":
        this.scene.children.forEach((cabinet) => {
          if (cabinet.name === "Penal" && cabinet.userData.side === "left") {
            //сдвигаем пеналы на delta
            cabinet.position.z += Number(delta);
            // Получаем id пенала из userData
            const penalId = cabinet.userData.id;
            //меняем положение z в store
            this.penalStore.penals.forEach((element) => {
              if (element.id === penalId) {
                element.z = cabinet.position.z;
              }
            });
          }
        });
        break;

      case "right":
        this.scene.children.forEach((cabinet) => {
          if (cabinet.name === "Penal" && (cabinet.userData.side === "right" )) {
            //сдвигаем пеналы на delta
            cabinet.position.z += Number(delta);

            // Получаем id пенала из userData
            const penalId = cabinet.userData.id;

            //меняем положение z в store
            this.penalStore.penals.forEach((element) => {
              if (element.id === penalId) {
                element.z = cabinet.position.z;
              }
            });
          }
        });
        break;

      case "directRight":
        this.scene.children.forEach((cabinet) => {
          if (cabinet.name === "Penal" && cabinet.userData.side === "directRight" || cabinet.userData.side === "right" ) {
            //сдвигаем пеналы на delta
            cabinet.position.x += Number(delta);
            // Получаем id пенала из userData
            const penalId = cabinet.userData.id;
            //меняем положение z в store
            this.penalStore.penals.forEach((element) => {
              if (element.id === penalId) {
                element.x = cabinet.position.x;
              }
            });
          }
        });
        break;
    }
  }

  build_upper_penal_level2(x, xPos, zPos, rotate) {
    const rotationMap = {
      0: Math.PI / 2,
      1: -Math.PI / 2,
      2: 0,
    };

    const cabinet = new UpperCabinet(x, 0.2, 0.55);
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(xPos, 2.218, zPos);

    cabinet.rotation.y = rotationMap[rotate];
    cabinet.name = "build_upper_penal_level2";
    this.scene.add(cabinet);
  }

  addCaseCabinet(x, y, z, h, rotate, name) {
    const cube = new CaseCabinet(0.6, h, 0.55, name);

    switch (rotate) {
      case 0:
        cube.rotation.y = 0;
        cube.setPosition(x, y, z);
        break;
      case 1:
        cube.rotation.y = Math.PI / 2;
        cube.setPosition(x, y, z);
        break;
      case 2:
        cube.rotation.y = -Math.PI / 2;
        cube.setPosition(x, y, z);
    }

    this.scene.add(cube);
    cube.name = "CaseCabinet";
  }

  LoadPenal(x, y, z, selectedOption, rotate, name, penalWidth, penalId) {
    const rotationMap = {
      0: Math.PI / 2,
      1: -Math.PI / 2,
      2: 0,
    };

    //let object = this.loaderModels.get('penal700-2')

    let object = this.loaderModels.get(selectedOption);

    object.position.set(x, 1.06, z);
    object.rotation.y = rotationMap[rotate];
    object.name = name + "Penal";
    object.userData.width = penalWidth;
    object.userData.id = penalId;
    object.visible = true;
    this.scene.add(object);
    this.penals.push(object); // Добавляем в массив
  }
}
