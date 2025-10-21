import * as THREE from "three";
import { ModelInstanse2L } from "./ModelInstanse2L";
import { plannerConfig } from "./planerConfig";

export class CombinationController {
  constructor(sceneSetup) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
  }

  checkCandidate(intersect) {
    if (intersect.length === 0) return;

    const selected1 = plannerConfig.selectedObject;
    const selected2 = intersect[0].object.userData?.controller;

    if (!selected1 || !selected2 || selected1.root === selected2.root.uuid)
      return;

    // проверка что модули один над друшим
    const isPair =
      (selected1.sublevel === 1 && selected2.sublevel === 2) ||
      (selected1.sublevel === 2 && selected2.sublevel === 1);

    if (!isPair) return;

    //расстояние между модулями
    const dx = Math.abs(selected1.root.position.x - selected2.root.position.x);
    console.log("dx", dx);

    if (dx < 0.4) {
      this.grouping(selected1, selected2);
      if (selected2.boxHelper) selected2.boxHelper.visible = false;
    }

    this.sceneSetup.requestRender();
  }

  ungroupCombo() {
    let main = plannerConfig.selectedObject.root.getObjectByName("Scene");
    let moduleGroup = main.children.slice(); // <---- тут делаем копию
    console.log("mgroup", moduleGroup);

    const obj = plannerConfig.selectedObject;
    let side = obj.side;

    const index = plannerConfig.models.findIndex(
      (m) => m.root.uuid === obj.root.uuid
    );
    if (index !== -1) {
      plannerConfig.models.splice(index, 1);
    }

    if (side == "direct") {
      const index2 = plannerConfig.modelsDirect2L.findIndex(
        (m) => m.root.uuid === obj.root.uuid
      );
      if (index2 !== -1) {
        plannerConfig.modelsDirect2L.splice(index2, 1);
      }
    }

    if (side == "left") {
      const index2 = plannerConfig.modelsLeft2L.findIndex(
        (m) => m.root.uuid === obj.root.uuid
      );
      if (index2 !== -1) {
        plannerConfig.modelsLeft2L.splice(index2, 1);
      }
    }

    //проходим по моделям группы и создаём отдельный группа и инстанс для каждый
    moduleGroup.forEach((moduleGroup, i) => {
      //  moduleGroup.updateMatrixWorld(true, true)
      const worldPosition = new THREE.Vector3();
      const worldQuaternion = new THREE.Quaternion();
      const worldScale = new THREE.Vector3();
      moduleGroup.getWorldPosition(worldPosition);
      moduleGroup.getWorldQuaternion(worldQuaternion);
      moduleGroup.getWorldScale(worldScale);

      if (moduleGroup.parent) {
        moduleGroup.parent.remove(moduleGroup);
      }

      this.scene.attach(moduleGroup); // теперь это безопасно

      moduleGroup.position.copy(worldPosition);
      // moduleGroup.quaternion.copy(worldQuaternion);
      // moduleGroup.scale.copy(worldScale);

      const instance = new ModelInstanse2L(moduleGroup, this.sceneSetup, false);
      if (instance.root.position.y > 1.65) instance.sublevel = 2;
      if (instance.root.position.y < 1.45) instance.sublevel = 1;
      instance.isCombo = false;

      if (side == "left") {
        let x = instance.objectSize.x;
        moduleGroup.quaternion.copy(worldQuaternion);
      }

      //удалить кнопку раззгурппировать
      if (!instance.isCombo) this.deleteUnComboButton(instance.controls);

      if (side == "direct") {
        instance.side = "direct";
        plannerConfig.modelsDirect2L.push(instance);
      }

      if (side == "left") {
        instance.side = "left";
        plannerConfig.modelsLeft2L.push(instance);
      }

      plannerConfig.models.push(instance);

      console.log(`Added module #${i} at`, worldPosition);
    });

    // В конце можно освободить comboInstance
    // comboInstance.dispose();
    this.scene.remove(plannerConfig.selectedObject.root);
    console.log("modelsAfter", plannerConfig.models);
  }

  deleteUnComboButton(controls) {
    const index = controls.findIndex((m) => m.name === "ungroupCombo");

    if (index !== -1) {
      controls.splice(index, 1);
    }
  }

  deleteFormArrays(selected) {
    const side = selected.side;
    const index = plannerConfig.models.findIndex(
      (m) => m.root.uuid === selected.root.uuid
    );

    if (index !== -1) {
      plannerConfig.models.splice(index, 1);
    }

    if (side == "direct") {
      const index2 = plannerConfig.modelsDirect2L.findIndex(
        (m) => m.root.uuid === selected.root.uuid
      );

      if (index2 !== -1) {
        plannerConfig.modelsDirect2L.splice(index2, 1);
      }
    }

    if (side == "left") {
      const index2 = plannerConfig.modelsLeft2L.findIndex(
        (m) => m.root.uuid === selected.root.uuid
      );

      if (index2 !== -1) {
        plannerConfig.modelsLeft2L.splice(index2, 1);
      }
    }
  }

  clearGroup(group) {
    console.log("before", group);

    const namesToRemove = [
      "BoxHelper",
      "leftControl",
      "rightControl",
      "centerControl",
      "menuControl",
      "ungroupCombo",
      "boxHelper",
    ];

    // обходим копию массива, чтобы избежать проблем с мутацией во время итерации
    group.children.slice().forEach((child) => {
      if (namesToRemove.includes(child.name)) {
        group.remove(child);

        // Очистка ресурсов
        if (child.geometry) child.geometry.dispose?.();

        if (child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => mat.dispose?.());
        }
      }
    });

    console.log("after", group);
  }

  grouping(selected1, selected2) {
    this.clearGroup(selected1.root);
    this.clearGroup(selected2.root);

    this.deleteFormArrays(selected1);
    this.deleteFormArrays(selected2);

    const side = selected1.side;
    //  console.log('side', side)

    const axis = new THREE.AxesHelper(5);
    //   console.log(selected1, selected2);
    const group = new THREE.Group();
    group.name = "Scene";
    const groupMain = new THREE.Group();
    // group.name = 'Scene'

    const pos1 = new THREE.Vector3();
    selected1.root.getWorldPosition(pos1);

    const pos2 = new THREE.Vector3();
    selected2.root.getWorldPosition(pos2);

    const center = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
    group.position.copy(center);
    groupMain.position.copy(center);

    if (side == "left") {
      selected1.root.rotation.y = 0;
      selected2.root.rotation.y = 0;
    }

    this.scene.add(groupMain);

    group.attach(selected1.root);
    group.attach(selected2.root);

    if (side == "left") {
      selected1.root.position.z = 0;
      selected2.root.position.z = 0;
    }

    groupMain.attach(group);

    let instance = new ModelInstanse2L(groupMain, this.sceneSetup, false);

    if (side == "left") instance.root.rotation.y = Math.PI / 2;
    instance.isCombo = true;
    instance.level = 2;

    if (side == "direct") instance.side = "direct";
    if (side == "left") instance.side = "left";

    if (side == "direct") {
      plannerConfig.models.push(instance);
      plannerConfig.modelsDirect2L.push(instance);
    }

    if (side == "left") {
      plannerConfig.models.push(instance);
      plannerConfig.modelsLeft2L.push(instance);
    }

    this.scene.remove(selected1.root);
    this.scene.remove(selected2.root);
  }
}
