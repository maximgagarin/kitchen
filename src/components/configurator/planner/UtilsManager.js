import { plannerConfig } from "./planerConfig";
import { ModelInstanse } from "./ModelInstanse";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../pinia/penals";
import { min } from "lodash";

export class UtilsManager {
  constructor(sceneSetup, loaderModels) {
    this.scene = sceneSetup.scene;
    this.sceneSetup = sceneSetup;
    this.loaderModels = loaderModels;
    this.selectedObject = false;
    this.plannerStore = usePlannerStore();
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
  }

  // рассчёт какой ряд до угла
  calcCornerModules() {
    const leftModules = plannerConfig.modelsLeft2L;
    const directModules = plannerConfig.modelsDirect2L;

    if (!leftModules.length && !directModules.length) {
      plannerConfig.isAngleRow2L = "none";
      return;
    }

    if (!leftModules.length) {
      const firstDirect = directModules
        .slice()
        .sort((a, b) => a.root.position.z - b.root.position.z)[0];
      const directEdge =
        firstDirect.root.position.x - firstDirect.objectSize.x / 2;
      plannerConfig.isAngleRow2L = directEdge < 0.3 ? "direct" : "none";
      return;
    }

    if (!directModules.length) {
      const firstLeft = leftModules
        .slice()
        .sort((a, b) => a.root.position.z - b.root.position.z)[0];
      const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;
      plannerConfig.isAngleRow2L = leftEdge < 0.3 ? "left" : "none";
      return;
    }

    // Если есть оба ряда
    const firstLeft = leftModules
      .slice()
      .sort((a, b) => a.root.position.z - b.root.position.z)[0];
    const firstDirect = directModules
      .slice()
      .sort((a, b) => a.root.position.z - b.root.position.z)[0];

    const directEdge =
      firstDirect.root.position.x - firstDirect.objectSize.x / 2;
    const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;

    if (directEdge < 0.29) {
      plannerConfig.isAngleRow2L = "direct";
    } else if (leftEdge < 0.29) {
      plannerConfig.isAngleRow2L = "left";
    } else {
      plannerConfig.isAngleRow2L = "none";
    }
  }

  calcCornerModules2L() {
    const leftModules = plannerConfig.modelsLeft;
    const directModules = plannerConfig.modelsDirect;

    if (!leftModules.length && !directModules.length) {
      plannerConfig.isAngleRow2L = "none";
      return;
    }

    if (!leftModules.length) {
      const firstDirect = directModules
        .slice()
        .sort((a, b) => a.root.position.z - b.root.position.z)[0];
      const directEdge =
        firstDirect.root.position.x - firstDirect.objectSize.x / 2;
      plannerConfig.isAngleRow = directEdge < 0.6 ? "direct" : "none";
      return;
    }

    if (!directModules.length) {
      const firstLeft = leftModules
        .slice()
        .sort((a, b) => a.root.position.z - b.root.position.z)[0];
      const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;
      plannerConfig.isAngleRow = leftEdge < 0.6 ? "left" : "none";
      return;
    }

    // Если есть оба ряда
    const firstLeft = leftModules
      .slice()
      .sort((a, b) => a.root.position.z - b.root.position.z)[0];
    const firstDirect = directModules
      .slice()
      .sort((a, b) => a.root.position.x - b.root.position.x)[0];

    const directEdge =
      firstDirect.root.position.x - firstDirect.objectSize.x / 2;
    const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;

    if (directEdge < 0.59) {
      plannerConfig.isAngleRow = "direct";
    } else if (leftEdge < 0.59) {
      plannerConfig.isAngleRow = "left";
    } else {
      plannerConfig.isAngleRow = "none";
    }
  }

  removeObjectsByName(name) {
    const objectsToRemove = [];

    // 1. Находим все объекты с указанным именем
    this.scene.traverse((object) => {
      if (object.name === name) {
        objectsToRemove.push(object);
      }
    });

    // 2. Удаляем объекты и очищаем ресурсы
    objectsToRemove.forEach((object) => {
      if (object.parent) {
        object.parent.remove(object);
      }

      // Очистка ресурсов
      if (object.geometry) object.geometry.dispose();

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    console.log(`Удалено объектов: ${objectsToRemove.length}`);
  }

  roomBounds2() {
    const level = plannerConfig.selectedObject.level;
    const isLeftTaken = level === 1 ? plannerConfig.isAngleRow === "left" : plannerConfig.isAngleRow2L === "left" 
    const isDirectTaken =  level === 1 ? plannerConfig.isAngleRow === "direct" : plannerConfig.isAngleRow2L === "direct" 

    const kitchenStore = this.kitchenSizesStore;
    const sideSizes = kitchenStore.sideSizes;
    const penalOffsets = this.penalStore.penalOffsetsState;
    const side = plannerConfig.selectedObject.side;
    const MODULE_DEPTH = level === 1 ? 0.6 : 0.3

    const rules = {
      direct: {
        minX: penalOffsets.directLeft,
        maxX: sideSizes.side_a - penalOffsets.directRight,
        minZ: 0,
        maxZ: 0,
      },
      left: {
        direct: {
          minX: isLeftTaken ? MODULE_DEPTH : 0,
          maxX: sideSizes.side_a - penalOffsets.directRight,
          minZ: 0,
          maxZ: 0,
        },
        left: {
          minX: 0,
          maxX: 0,
          minZ: isDirectTaken ? MODULE_DEPTH : 0,
          maxZ: sideSizes.side_c - penalOffsets.left,
        },
      },
    };


      const rule = rules[kitchenStore.type][side]
      console.log(rule)
      plannerConfig.roomBounds = rule
  }
  roomBounds() {
    const level = plannerConfig.selectedObject.level;
    const isLeftTaken = level === 1
      ? plannerConfig.isAngleRow === "left"
      : plannerConfig.isAngleRow2L === "left";
    const isDirectTaken = level === 1
      ? plannerConfig.isAngleRow === "direct"
      : plannerConfig.isAngleRow2L === "direct";

    const kitchenStore = this.kitchenSizesStore;
    const sideSizes = kitchenStore.sideSizes;
    const side = plannerConfig.selectedObject.side;
    const MODULE_DEPTH = level === 1 ? 0.6 : 0.3;
    const selected = plannerConfig.selectedObject;
    const selectedPosX = selected.root.position.x;
    const selectedPosZ = selected.root.position.z;
    const width = selected.width;
    const isPenal = selected.name === "penal";
    const isSelectedFridge = selected.name === "fridge";
    const isFridge = plannerConfig.fridge
    

    // === PENALS ===
    const penalsX = plannerConfig.models
      .filter(m => ['penal', 'fridge'].includes(m.name) && m.side === 'direct')
      .sort((a, b) => a.root.position.x - b.root.position.x);

      

    const penalsZ = plannerConfig.models
      .filter(m => ['penal', 'fridge'].includes(m.name) && m.side === 'left')
      .sort((a, b) => a.root.position.z - b.root.position.z);

    // === Обычные модули ===
    const modulesX = plannerConfig.models
      .filter(m => m.name !== "penal" && m.side === "direct")
      .sort((a, b) => a.root.position.x - b.root.position.x);

    const modulesZ = plannerConfig.models
      .filter(m => m.name !== "penal" && m.side === "left")
      .sort((a, b) => a.root.position.z - b.root.position.z);

    // === Универсальный поиск ближайших объектов ===
    const findNearest = (list, pos, axis = "x") => {
      let left = null, right = null;
      for (const obj of list) {
        const value = axis === "x" ? obj.root.position.x : obj.root.position.z;
        if (value < pos) left = obj;
        else if (value > pos && !right) {
          right = obj;
          break;
        }
      }
      return { left, right };
    };

    // === Ищем ограничения в зависимости от типа ===
    const { left: leftPenalX, right: rightPenalX } = findNearest(penalsX, selectedPosX, "x");
    const { left: leftPenalZ, right: rightPenalZ } = findNearest(penalsZ, selectedPosZ, "z");

    let leftLimitX = leftPenalX;
    let rightLimitX = rightPenalX;
    let leftLimitZ = leftPenalZ;
    let rightLimitZ = rightPenalZ;

    // === Если выбран пенал — ограничиваем по обычным модулям ===
    if (isPenal || isSelectedFridge) {
      const { left: leftModuleX, right: rightModuleX } = findNearest(modulesX, selectedPosX, "x");
      const { left: leftModuleZ, right: rightModuleZ } = findNearest(modulesZ, selectedPosZ, "z");

      // если модули ближе чем пеналы — они главные
      if (leftModuleX && (!leftLimitX || leftModuleX.root.position.x > leftLimitX.root.position.x))
        leftLimitX = leftModuleX;
      if (rightModuleX && (!rightLimitX || rightModuleX.root.position.x < rightLimitX.root.position.x))
        rightLimitX = rightModuleX;

      if (leftModuleZ && (!leftLimitZ || leftModuleZ.root.position.z > leftLimitZ.root.position.z))
        leftLimitZ = leftModuleZ;
      if (rightModuleZ && (!rightLimitZ || rightModuleZ.root.position.z < rightLimitZ.root.position.z))
        rightLimitZ = rightModuleZ;
    }

    // === Базовые границы кухни ===
    let minX = 0;
    let maxX = sideSizes.side_a;
    let minZ = 0;
    let maxZ = sideSizes.side_c;

    // === Применяем ограничения по найденным объектам ===
    if (leftLimitX) {
      const rightEdge = leftLimitX.root.position.x + leftLimitX.width / 2;
      minX = Math.max(minX, rightEdge);
    }
    if (rightLimitX) {
      const leftEdge = rightLimitX.root.position.x - rightLimitX.width / 2;
      maxX = Math.min(maxX, leftEdge);
    }

    if (leftLimitZ) {
      const backEdge = leftLimitZ.root.position.z + leftLimitZ.width / 2;
      minZ = Math.max(minZ, backEdge);
    }
    if (rightLimitZ) {
      const frontEdge = rightLimitZ.root.position.z - rightLimitZ.width / 2;
      maxZ = Math.min(maxZ, frontEdge);
    }

    // === Учёт углов комнаты ===
    if (isLeftTaken) minX = Math.max(minX, MODULE_DEPTH);
    if (isDirectTaken) minZ = Math.max(minZ, MODULE_DEPTH);

    // === Итоговые ограничения ===
    const rules = {
      direct: { minX, maxX, minZ: 0, maxZ: 0 },
      left: {
        direct: { minX, maxX, minZ: 0, maxZ: 0 },
        left: { minX: 0, maxX: 0, minZ, maxZ },
      },
    };

    const rule =
      kitchenStore.type === "left"
        ? rules.left?.[side]
        : rules.direct;

    console.log("✅ Итоговое ограничение:", rule);
    plannerConfig.roomBounds = rule;
  }

  deleteSelected() {
    const obj = plannerConfig.selectedObject;
    const side = plannerConfig.selectedObject.side;
  //  console.log(side);

    if (!obj || !obj.root) return;

    // Удаление из сцены
    this.scene.remove(obj.root);

    // Рекурсивно очищаем ресурсы (геометрию, материалы)
    obj.root.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      // if (child.material) {
      //   if (Array.isArray(child.material)) {
      //     child.material.forEach((m) => m.dispose());
      //   } else {
      //     child.material.dispose();
      //   }
      // }
      // if (child.texture) {
      //   child.texture.dispose();
      // }
    });

    if(plannerConfig.selectedInSector){
      const parent = plannerConfig.selectedInSector.root.parent
      parent.remove(plannerConfig.selectedInSector.root)
    }

    // Удаление из массива models

    const index = plannerConfig.models.findIndex((m) => m.root.uuid === obj.root.uuid);
    if (index !== -1) {
      plannerConfig.models.splice(index, 1);
    }
 //   console.log("models", plannerConfig.models);
    // Удаление из массива modelsDirect

    if (side == "direct") {
      const index2 = plannerConfig.modelsDirect.findIndex(
        (m) => m.root.uuid === obj.root.uuid
      );
      if (index2 !== -1) {
        plannerConfig.modelsDirect.splice(index2, 1);
      }
    }

    if (side == "left") {
   
      const index2 = plannerConfig.modelsLeft.findIndex((m) => m.root.uuid === obj.root.uuid);
      if (index2 !== -1) {
        plannerConfig.modelsLeft.splice(index2, 1);
      }
    }

    if (obj.level == 2 && obj.side == "direct") {
   
      const index2 = plannerConfig.modelsDirect2L.findIndex((m) => m.root.uuid === obj.root.uuid);
      if (index2 !== -1) {
        plannerConfig.modelsDirect2L.splice(index2, 1);
      }
    }

     if (obj.level == 2 && obj.side == "left") {
   
      const index2 = plannerConfig.modelsLeft2L.findIndex((m) => m.root.uuid === obj.root.uuid);
      if (index2 !== -1) {
        plannerConfig.modelsLeft2L.splice(index2, 1);
      }
    }

    if(obj.name == 'penal'){
      
        const index2 = plannerConfig.penalsArray.findIndex((m) => m.root.uuid === obj.root.uuid);
      if (index2 !== -1) {
        plannerConfig.penalsArray.splice(index2, 1);
      }
    }


    plannerConfig.objectControls.length = 0;

    plannerConfig.selectedObject = false;
    this.plannerStore.selectedObject.isSelect = false;
    this.plannerStore.selectedObject.name = "";

  //   console.log('models', plannerConfig.models)
 //   console.log('modelsDirect', plannerConfig.modelsDirect)

    //создание пустых боксов в пустоте


    this.sceneSetup.requestRender();
  }

  shadow(){
      //   включить тень
    const excludedNames = ['p', 'm', 'd'];

    plannerConfig.models.forEach(model => {
      if (!excludedNames.includes(model.name)) {
        model.root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    });
  }


}
