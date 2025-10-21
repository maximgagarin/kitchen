import { element } from "three/tsl";
import { UpperCabinet } from "../cabinets/UpperCabinet";
import config from "../../config/config";
import * as THREE from "three";
import { useRowSegmentsStore } from "../../../pinia/RowSegments";
import { PenalInstanse } from "../planner/PenalInstanse";
import { models } from "../utils.js/models";
import { penalsArray } from "./penalsArray";
import { plannerConfig } from "../planner/planerConfig";

//строитель пеналов из загруженных моделей и антероссолей класса UpperCabint

export class PanalBuilder {
  constructor(scene, loaderModels, store) {
    this.sceneSetup = scene;
    this.scene = scene.scene;
    this.loaderModels = loaderModels;
    this.penalStore = store;
    this.rowSegmentsStore = useRowSegmentsStore();
    this.rotationMap = {
      0: Math.PI / 2,
      1: -Math.PI / 2,
      2: 0,
      3: Math.PI,
    };
    this.anp = {
      0.4:'АНП-400',
      0.45:'АНП-450',
      0.6:'АНП-600',
      0.18:'АНП-180'
    }
      this.anpRotationMap = {
      0: Math.PI / 2,
      1: -Math.PI / 2,
      2: Math.PI/2,
      3: Math.PI/2,
    };
  }

  //загружаем 3d модель пенала
  get3dModel(selectedOption) {
    return this.loaderModels.get(selectedOption);
  }

  // перебор массива с пеналами и создание группы из модели и антресолей
  builder() {
  

    plannerConfig.penalsArray.length = 0;

  //  console.trace("builder вызван");

    this.clearPenalsFromScene();
    this.penalStore.penals.forEach((element) => {
        const id = THREE.MathUtils.generateUUID()
      //загрузка модели
      let object = this.get3dModel(element.type);
      if(!object){
        console.log('модель не найдена')
        console.log('модель', element.type )
        return
      }
      object.visible = true;
      object.userData.id = element.id;
      const instance = new PenalInstanse(object);
      instance.id = id
      instance.raycasterBox.userData.id = id
      instance.level = 1
     // console.log(element.id);

     if(element.side == 'directLeft' || element.side == 'directRight'){
       instance.side = 'direct';
     }

     if(element.side == 'left'){
       instance.side = 'left';
     }

     
     if(element.side == 'right'){
       instance.side = 'right';
     }
     
     

      plannerConfig.penalsArray.push(instance);
    //  console.log(plannerConfig.penalsArray);

      const x = Number(element.x);
      const z = Number(element.z);
      const y = 0;

      object.position.set(x, y, z);
      object.rotation.y = this.rotationMap[element.rotate];
      object.name = "Penal";
      object.userData.name = element.type + "Penal";
      object.userData.width = element.width;
      object.userData.id = element.id;
      object.userData.index = element.index;
      object.userData.side = element.side;


      console.log('width', element.width)



      // Добавляем антресоль
      if (config.panels_size.height2level == 0.9) {
        const type = this.anp[element.width]
        console.log('type', type)
        const cabinet = this.loaderModels.get(type)
        console.log('rotate', element.rotate)
        if(element.width === 0.18) cabinet.rotation.y =  this.anpRotationMap[element.rotate];
        cabinet.visible = true
        cabinet.position.y = 2.118


        // cabinet.rotation.y = this.rotationMap[element.rotate];
        object.add(cabinet);
      }

      // if (config.level3) {
      //   const cabinet = new UpperCabinet(
      //     object.userData.width,
      //     config.panels_size.height3level,
      //     0.55
      //   );
      //   const globalX = x;
      //   const globalY = this.calculationPositionLevel3();
      //   const globalZ = z;

      //   cabinet.position.set(
      //     globalX - x,
      //     globalY - y,
      //     globalZ - z - 0.3 + 0.02
      //   );
      //   object.add(cabinet);
      // }
      this.scene.add(object);
    });
 //   console.log(this.scene);
  }

  deletePenal(id, side) {
    const index = plannerConfig.penalsArray.findIndex((m) => m.id === id);
    if (index !== -1) plannerConfig.penalsArray.splice(index, 1);
  //  console.log("Обновлённый modelsDirect:", plannerConfig.penalsArray);

    // Найти объект по userData.id
    const penalToRemove = this.scene.children.find(
      (child) => child.userData.id === id
    );
    let penalWidth = Number(penalToRemove.userData.width);
    let penalIndex = penalToRemove.userData.index;

   // console.log(penalToRemove);

    if (penalToRemove) {
      // Очистить ресурсы
      penalToRemove.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        // if (child.material) {
        // if (Array.isArray(child.material)) {
        //   child.material.forEach((m) => m.dispose());
        // } else {
        //   child.material.dispose();
        // }
        // }
      });

      // Удалить из сцены
      this.scene.remove(penalToRemove);
    }

    // Удалить из Pinia-стора
    this.penalStore.removePenal(id, side);

    switch (side) {
      case "left":
        this.penalStore.penals.forEach((element) => {
          if (element.side === "left" && element.index > penalIndex) {
            element.z = Number(element.z) + Number(penalWidth);
          }
        });

        //Пересчёт индексов только для left
        const leftPenals = this.penalStore.penals.filter(
          (p) => p.side === "left"
        );
        leftPenals.sort((a, b) => b.z - a.z)
        leftPenals.forEach((element, index) => {
          element.index = index;
        });


        break;

      case "right":
        this.penalStore.penals.forEach((element) => {
          if (element.side === "right" && element.index > penalIndex) {
            element.z = Number(element.z) + Number(penalWidth);
          }
        });

        // Пересчёт индексов только для right
        const rightPenals = this.penalStore.penals.filter(
          (p) => p.side === "right"
        );
        rightPenals.sort((a, b) => b.z - a.z)
        rightPenals.forEach((element, index) => {
          element.index = index;
        });

        break;

      case "directRight":
        this.penalStore.penals.forEach((element) => {
          if (element.side === "directRight" && element.index > penalIndex) {
            element.x = Number(element.x) + Number(penalWidth);
          }
        });

        // Пересчёт индексов только для right
        const DirectrightPenals = this.penalStore.penals.filter(
          (p) => p.side === "directRight"
        );
         DirectrightPenals.sort((a, b) => b.x - a.x)

        DirectrightPenals.forEach((element, index) => {
          element.index = index;
        });

        break;

      case "directLeft":
        this.penalStore.penals.forEach((element) => {
          if (element.side === "directLeft" && element.index > penalIndex) {
            element.x = Number(element.x) - Number(penalWidth);
          }
        });

        // Пересчёт индексов только для right
        const DirectleftPenals = this.penalStore.penals.filter(
          (p) => p.side === "directLeft"
        );
         DirectleftPenals.sort((a, b) => a.x - b.x)
        DirectleftPenals.forEach((element, index) => {
          element.index = index;
        });

        break;
    }

  //  console.log(this.scene);
    this.sceneSetup.requestRender();
  }

  clearPenalsFromScene() {
    const penals = this.scene.children.filter(
      (child) => child.name === "Penal"
    );
    penals.forEach((penal) => {
      penal.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        // if (child.material) {
        //   if (Array.isArray(child.material)) {
        //     child.material.forEach((m) => m.dispose());
        //   } else {
        //     child.material.dispose();
        //   }
        // }
      });
      this.scene.remove(penal);
    });
  }

  deleteAllPenals() {
    this.scene.children.forEach((element) => {
      if (element.name === "Penal") {
        this.scene.remove(element);
      }
    });
  }

  //строит модуль над пеналов 2й уровень
  build_upper_penal_level2(x, xPos, zPos, rotate) {
    const cabinet = new UpperCabinet(x, 0.2, 0.55);
    //cabinet.position.set(positionX + cabinetWidth / 2, 0.45, 0.1);
    cabinet.position.set(xPos, 2.218, zPos);

    cabinet.rotation.y = rotationMap[rotate];
    cabinet.name = "build_upper_penal_level2";
    this.scene.add(cabinet);
  }

  //строит модуль над пеналов 3й уровень
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
}
