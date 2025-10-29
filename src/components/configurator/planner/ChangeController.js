import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { algorithmConfig } from "../builders/Algorithm/algorithmConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { usePenalStore } from "../../../pinia/penals";
import { ModelInstanse } from "./ModelInstanse";
import { SinkInstanse } from "./SinkInstanse";
import { mod } from "three/src/nodes/TSL.js";

export class ChangeController {
  constructor(sceneSetup, loaderModels, emptyManager) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
    this.plannerStore = usePlannerStore();
    this.emptyManager = emptyManager;
    this.rules = {
      direct: {
        axis: "x",
        modulesArray: "modelsDirect",
        deleteArray: "namesToDeleteDirect"
      },
      left: {
        axis: "z",
        modulesArray: "modelsLeft",
        deleteArray: "namesToDeleteLeft"

      },
      right: {
        axis: "z",
        modulesArray: "modelsRight",
        deleteArray: "namesToDeleteRight"
      },
    };
  }

  getPosition(leftModule, rightModule, newModuleWidth, posOld, axis) {
    let pos;

    console.log("leftModule", leftModule);
    console.log("rightModule", rightModule);

    if (leftModule && rightModule) {
      const leftEdge = leftModule.root.position[axis] + leftModule.width / 2;
      const rightEdge = rightModule.root.position[axis] - rightModule.width / 2;
      pos = (leftEdge + rightEdge) / 2;
    } else if (!leftModule && rightModule) {
      const rightEdge = rightModule.root.position[axis] - rightModule.width / 2;
      pos = rightEdge - newModuleWidth / 2;
    } else if (leftModule && !rightModule) {
      const leftEdge = leftModule.root.position[axis] + leftModule.width / 2;
      pos = leftEdge + newModuleWidth / 2;
    } else {
      pos = posOld[axis];
    }

    // Возвращаем Vector3 с обновлённой координатой
    const result = posOld.clone();
    result[axis] = pos;
    return pos;
  }

  changeSelected(modelType, width) {
    const rules = {
      direct: {
        axis: "x",
        modulesArray: "modelsDirect",
        rotation: 0,
        deleteArray: "namesToDeleteDirect"
      },
      left: {
        axis: "z",
        modulesArray: "modelsLeft",
        rotation: Math.PI / 2,
        deleteArray: "namesToDeleteLeft"
      },
      right: {
        axis: "z",
        modulesArray: "modelsRight",
        rotation: -Math.PI / 2,
        deleteArray: "namesToDeleteRight"

      },
    };

    let oldInstance = plannerConfig.selectedObject;
    const { level, id, side, type } = oldInstance;


    console.log('side', side)

    console.log("old", oldInstance);
    oldInstance.root.updateMatrixWorld(true, true);
    const position = oldInstance.root.position.clone();
    let cabinetName

    
    if (modelType === 'ms'){
      cabinetName = `${modelType}${width * 1000}`;
    } else {
      cabinetName = `${modelType}-${width * 1000}`;
    }


    const cabinetOriginal = this.loaderModels.get(cabinetName);

    if (!cabinetOriginal) {
      alert("Модель не найдена");
      return;
    }

    const rule = rules[side];
    const modulesArray = plannerConfig[rule.modulesArray];
    modulesArray.sort(
      (a, b) => a.root.position[rule.axis] - b.root.position[rule.axis]
    );

    const indexOld = modulesArray.findIndex(
      (m) => m.root.uuid === oldInstance.root.uuid
    );

    // Определяем соседей одинаково для всех осей
    // const leftModule = indexOld > 0 ? modulesArray[indexOld - 1] : null;
    // const rightModule = indexOld < modulesArray.length - 1 ? modulesArray[indexOld + 1] : null;

    const leftModule = modulesArray[indexOld - 1];
    const rightModule = modulesArray[indexOld + 1];

    // Получаем новую позицию
    const newPos = this.getPosition(
      leftModule,
      rightModule,
      width,
      position,
      rule.axis
    );

    console.log("newPos", newPos);

    const index = plannerConfig.models.findIndex(
      (m) => m.root.uuid === oldInstance.root.uuid
    );
    if (index !== -1) {
      plannerConfig.models.splice(index, 1);
    }

    // Временная копия для проверки
    const cabinetClone = cabinetOriginal.clone(true);
    const testInstance = new ModelInstanse(cabinetClone);
    cabinetClone.position.copy(position);
    cabinetClone.position[rule.axis] = newPos;
    cabinetClone.rotation.y = rule.rotation;
    cabinetClone.updateMatrixWorld(true, true);

    const selectedBox = new THREE.Box3().setFromObject(cabinetClone);

    console.log("cabinetOriginalBox", selectedBox);

    const collision = this.checkCollision(cabinetClone);

    if (collision) {
      plannerConfig.models.push(oldInstance);
      this.plannerStore.showError();
      return;
    }

    // удаляем старый
    this.deleteSelected();

    const cabinet = this.loaderModels.get(cabinetName);
    cabinet.visible = true;
    //   namesToDelete.push(cabinetName);

    let instance

    if(modelType === 'ms'){
      instance = new SinkInstanse(cabinet);
      instance.name = 'm'
    } else {
      instance = new ModelInstanse(cabinet);
      instance.name = modelType;
    }

     

    const deleteArray = plannerConfig[rule.deleteArray]

    deleteArray.push(cabinetName)

    
    // instance.slot = oldindex;
    instance.side = side;
    instance.id = id;
    instance.raycasterBox.userData.id = id;
    instance.fullname = cabinetName;
    cabinet.position.copy(position);
    cabinet.position[rule.axis] = newPos;
    cabinet.rotation.y = rule.rotation;
    cabinet.name = cabinetName

    plannerConfig.selectedObject = instance;
    plannerConfig.models.push(instance);

    modulesArray.push(instance);
    //plannerConfig.modelsDirect.push(instance);

    // plannerConfig.objectControls.push(instance.rightControl);
    // plannerConfig.objectControls.push(instance.leftControl);
    // plannerConfig.objectControls.push(instance.centerControl);

    instance.centerControl.visible = false;
    instance.leftControl.visible = false;
    instance.rightControl.visible = false;

    this.scene.add(cabinet);

    this.plannerStore.selectedObject.isSelect = false;
    this.plannerStore.selectedObject.name = false;

    this.plannerStore.objectMenu = false;
    plannerConfig.selectedObject = false;
    plannerConfig.selectedEmpty = false;
  }

  checkCollision(testInstance) {
    console.log("testPos", testInstance);
    const modelsArray = plannerConfig.models;
    const selectedBox = new THREE.Box3().setFromObject(testInstance);
    const gap = 0.01;

    selectedBox.expandByScalar(-gap); // уменьшаем объём коллизии
    for (let model of modelsArray) {
      // if (model.root.uuid === testInstance.root.uuid) continue;

      const otherBox = new THREE.Box3().setFromObject(model.root);

      if (selectedBox.intersectsBox(otherBox)) {
        console.log("collis");
        console.log("other", otherBox);
        console.log("selected", selectedBox);
        return true;
      }
    }

    return false;
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

    // Удаление из массива models

    const index = plannerConfig.models.findIndex(
      (m) => m.root.uuid === obj.root.uuid
    );
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
      //  console.log("goooo");
      const index2 = plannerConfig.modelsLeft.findIndex(
        (m) => m.root.uuid === obj.root.uuid
      );
      if (index2 !== -1) {
        plannerConfig.modelsLeft.splice(index2, 1);
      }
    }

    //   console.log("modelsDirect", plannerConfig.modelsDirect);
    //console.log("modelsLeft", plannerConfig.modelsLeft);

    // this.resizableModule.modelControls =
    //   this.resizableModule.modelControls.filter((el) => el !== obj.leftControl);
    // this.resizableModule.modelControls =
    //   this.resizableModule.modelControls.filter(
    //     (el) => el !== obj.rightControl
    //   );

    plannerConfig.objectControls.length = 0;

    plannerConfig.selectedObject = false;
    this.plannerStore.selectedObject.isSelect = false;
    this.plannerStore.selectedObject.name = "";



    //создание пустых боксов в пустоте
    this.emptyManager.calculateEmpties();



    this.sceneSetup.requestRender();
  }

  calculateCornerBounds() {
    if (this.kitchenSizesStore.type == "direct") {
      plannerConfig.roomBounds = {
        minX: 0 + plannerConfig.penalsBorders.directLeft,
        maxX: plannerConfig.penalsBorders.directRight,
        minZ: 0.3,
        maxZ: 0.3,
      };
    }

    if (this.kitchenSizesStore.type == "left") {
      if (plannerConfig.selectedObject.side == "direct") {
        plannerConfig.roomBounds = {
          minX: 0,
          maxX: plannerConfig.penalsBorders.directRight,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minZ: 0, // ограничение движения если левый ряд до угла
          maxZ: plannerConfig.penalsBorders.left,
        };
      }

      //оперделяем какой модуль зашёл в угол
      const leftEdge =
        plannerConfig.newSlotsLeft[0].center -
        plannerConfig.newSlotsLeft[0].width / 2;
      if (leftEdge < 0.59) {
        //   console.log('left yes')
        plannerConfig.isAngleRow = "left";
        if (plannerConfig.selectedObject.side == "direct") {
          plannerConfig.roomBounds = {
            minX: 0.6,
            maxX: plannerConfig.penalsBorders.directRight,
          };
        }
        if (plannerConfig.selectedObject.side == "left") {
          plannerConfig.roomBounds = {
            minZ: 0, // ограничение движения если левый ряд до угла
            maxZ: plannerConfig.penalsBorders.left,
          };
        }
      }
      const directEdge =
        plannerConfig.newSlotsDirect[0].center -
        plannerConfig.newSlotsDirect[0].width / 2;
      if (directEdge < 0.59) {
        plannerConfig.isAngleRow = "direct";

        if (plannerConfig.selectedObject.side == "direct") {
          plannerConfig.roomBounds = {
            minX: 0,
            maxX: plannerConfig.penalsBorders.directRight,
          };
        }
        if (plannerConfig.selectedObject.side == "left") {
          plannerConfig.roomBounds = {
            minZ: 0.6, // ограничение движения если левый ряд до угла
            maxZ: plannerConfig.penalsBorders.left,
          };
        }
      }
      if (leftEdge >= 0.6 && directEdge >= 0.6) {
        plannerConfig.isAngleRow = "none";
      }
    }
  }
}
