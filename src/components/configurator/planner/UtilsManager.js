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

  roomBounds() {
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
}
