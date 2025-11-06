import { plannerConfig } from "./planerConfig";
import * as THREE from "three";
import { Line } from "./Line";
import { ModelInstanse } from "./ModelInstanse";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { PenalInstanse } from "./PenalInstanse";
import { SinkInstanse } from "./SinkInstanse";
import { usePenalStore } from "../../../pinia/penals";

export class EmptyManager {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.plannerStore = usePlannerStore();
    this.kitchenStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
  }

  createGapBoxes() {
    const side = "direct";
    const posY = 1.76;
    let totalWidth = this.kitchenStore.sideSizes.side_a;

    //  const filtedDirect = plannerConfig.penalsArray.filter(model=> model.side === 'direct')
    plannerConfig.iconsArray1L = plannerConfig.iconsArray1L.filter(
      (icon) => icon.name === "left1level"
    );

    // времменно добавляем пеналы
    const models = plannerConfig.modelsDirect;
    //  const models = plannerConfig.modelsDirect.map(p => ({ ...p }))
    //  models.push(...filtedDirect)
    models.sort((a, b) => a.root.position.x - b.root.position.x);

    //   console.log('models', models)

    // Добавление промежутков
    for (let i = 0; i < models.length - 1; i++) {
      const current = models[i];
      const next = models[i + 1];
      const box1 = new THREE.Box3().setFromObject(current.root);
      const box2 = new THREE.Box3().setFromObject(next.root);

      //    console.log('box1', box1)
      //  console.log('box2', box2)

      const rightEdge = box1.max.x;
      const leftEdgeNext = box2.min.x;

      if (leftEdgeNext - rightEdge > 0.15) {
        this.addGapBox(rightEdge, leftEdgeNext, box1, 1.5, side);
      }
    }

    // есть в углу модуль
    const leftOffset = plannerConfig.isAngleRow === "left" ? 0.6 : 0;

    if (models.length > 0) {
      // Левый край
      const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);
      if (firstBox.min.x > 0.15 + leftOffset) {
        //    console.log(' plannerConfig.isAngleRow2L',  plannerConfig.isAngleRow)

        this.addGapBox(
          0 + leftOffset,
          firstBox.min.x,
          firstBox,
          posY,
          side,
          leftOffset
        );
      }

      // Правый край
      const lastBox = new THREE.Box3().setFromObject(
        models[models.length - 1].raycasterBox
      );
      if (totalWidth - lastBox.max.x > 0.15) {
        this.addGapBox(lastBox.max.x, totalWidth, lastBox, 1.5, side);
      }
    } else {

      this.addGapBox(leftOffset, totalWidth, 1, 1.5, side);
    }


  }

  createGapBoxesLeft() {
    const side = "left";
    const posY = 1.76;
    let totalWidth = this.kitchenStore.sideSizes.side_c;

    //   const filtedLeft = plannerConfig.penalsArray.filter(model=> model.side == 'left')
    plannerConfig.iconsArray1L = plannerConfig.iconsArray1L.filter(
      (icon) => icon.name == "direct1level"
    );

    const models = plannerConfig.modelsLeft;
    // const models = plannerConfig.modelsLeft.map(p => ({ ...p }))

    //временно добавляем пеналы для расчёта
    // models.push(...filtedLeft)
    models.sort((a, b) => a.root.position.z - b.root.position.z);

    // Добавление промежутков
    for (let i = 0; i < models.length - 1; i++) {
      const current = models[i];
      const next = models[i + 1];
      const box1 = new THREE.Box3().setFromObject(current.root);
      const box2 = new THREE.Box3().setFromObject(next.root);

      //  console.log('box1', box1)
      //  console.log('box2', box2)

      const rightEdge = box1.max.z;
      const leftEdgeNext = box2.min.z;

      if (leftEdgeNext - rightEdge > 0.15) {
        this.addGapBoxLeft(rightEdge, leftEdgeNext, box1, 1.5, side);
      }
    }

    const offset = plannerConfig.isAngleRow == "direct" ? 0.6 : 0;

    if (models.length > 0) {
      // Левый край
      const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);
      if (firstBox.min.z > 0.15 + offset) {
        this.addGapBoxLeft(0 + offset, firstBox.min.z, firstBox, posY, side);
      }

      // Правый край
      const lastBox = new THREE.Box3().setFromObject(
        models[models.length - 1].raycasterBox
      );
      if (totalWidth - lastBox.max.z > 0.15) {
        this.addGapBoxLeft(lastBox.max.z, totalWidth, lastBox, 1.5, side);
      }
    } else {

      this.addGapBoxLeft(offset, totalWidth, 1, 1.5, side);
    }
  }

  addGapBox(startX, endX, referenceBox, posY, side, leftOffset) {
    const icon = this.loaderModels.get("icon");
    icon.visible = true;
    icon.name = "direct1level";

    plannerConfig.iconsArray1L.push(icon);

    const gap = endX - startX;
    if (gap <= 0) return;

    const geometry = new THREE.BoxGeometry(gap, 0.7, 0.3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: 0,
      transparent: true,
    });
    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBox1level";

    const lineHotizontal = new Line(
      this.sceneSetup,
      { x: -gap / 2, y: 0.3, z: -0.14 },
      { x: gap / 2, y: 0.3, z: -0.14 },
      0.4,
      1
    );
    gapBox.add(lineHotizontal.group);
    gapBox.userData.side = "direct";

    // plannerConfig.empties2levelDirect.push(gapBox);

    // plannerConfig.iconsArray2L.push(icon)

    gapBox.add(icon);
    // icon.position.set(0,1,0)

    if (side === "left") gapBox.rotation.y = Math.PI / 2;

    // позиция
    if (side === "direct") gapBox.position.set(startX + gap / 2, 0.45, 0.15);

    this.scene.add(gapBox);
  }

  addGapBoxLeft(startX, endX, referenceBox, posY, side) {
    const icon = this.loaderModels.get("icon");
    icon.visible = true;
    icon.name = "left1level";
    plannerConfig.iconsArray1L.push(icon);

    const gap = endX - startX;
    if (gap <= 0) return;

    const geometry = new THREE.BoxGeometry(gap, 0.7, 0.3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: 0,
      transparent: true,
    });
    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBoxLeft1level";

    const lineHotizontal = new Line(
      this.sceneSetup,
      { x: -gap / 2, y: 0.3, z: -0.14 },
      { x: gap / 2, y: 0.3, z: -0.14 },
      0.4,
      1
    );
    gapBox.add(lineHotizontal.group);

    plannerConfig.empties2levelLeft.push(gapBox);

    gapBox.add(icon);

    gapBox.rotation.y = Math.PI / 2;

    gapBox.userData.side = "left";

    // позиция

    if (side === "left") gapBox.position.set(0.15, 0.45, startX + gap / 2);

    this.scene.add(gapBox);
  }

  calculateEmpties() {


    this.removeObjectsByName("gapBox1level");
    this.removeObjectsByName("gapBoxLeft1level");

    plannerConfig.empties2levelDirect.length = 0;
    plannerConfig.empties2levelLeft.length = 0;

    if (plannerConfig.modelsDirect.length >= 0) {
     this.createGapBoxes();
    }
    if (
      this.kitchenStore.type === "left" &&
      plannerConfig.modelsLeft.length >= 0
    ) {
      this.createGapBoxesLeft();
    }
  }

  castShadow(cabinet){
    cabinet.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }


  addToEmpty(type, width, penal = null) {
    const id = THREE.MathUtils.generateUUID();

    console.log(type);
    console.log(width);
    console.log("penal", penal);

    let isLeft, oldInstance, oldindex, oldside;

    let position = plannerConfig.selectedEmpty.position.clone();
    position.y = 0;
    console.log(position);

    oldside = plannerConfig.selectedEmpty.userData.side;
    isLeft = plannerConfig.selectedEmpty.userData.side == "left";

    // oldindex = 1;

    if (isLeft) {
      position.z = Number(plannerConfig.selectedEmpty.position.z);
      position.x = 0.3;
    }
    if (!isLeft) {
      position.x = Number(plannerConfig.selectedEmpty.position.x);
      position.z = 0.3;
    }

    console.log(position);

    let cabinetName;

    console.log("type", type);

    if (penal) {
      console.log("1");
      cabinetName = `penal${width * 1000}-${type}`;
    } else {
      console.log("2");

      //если мойка
      type === "ms"
        ? (cabinetName = `${type}${width * 1000}`)
        : (cabinetName = `${type}-${width * 1000}`);
    }

    console.log("cabname", cabinetName);

    const cabinetOriginal = this.loaderModels.get(cabinetName);

    if (!cabinetOriginal) {
      alert("Модель не найдена");
      return;
    }

    // Временная копия для проверки
    const cabinetClone = cabinetOriginal.clone(true);
    const testInstance = new ModelInstanse(cabinetClone);
    testInstance.root.position.copy(position);
    //  console.log(testInstance.root.position);
    testInstance.root.rotation.y = isLeft ? Math.PI / 2 : 0;

    testInstance.slot = oldindex;

    const collision = this.checkCollision(testInstance);

    if (collision) {
      this.plannerStore.showError();
      return;
    }

    const cabinet = this.loaderModels.get(cabinetName);

 //   this.castShadow(cabinet)





    plannerConfig.namesToDelete.push(cabinetName);
    cabinet.visible = true;

    //добавление в массив для уделания при смене варианта
    const nameToDelete = cabinetName + isLeft ? "-left" : "-direct";

    cabinet.name = nameToDelete;
    isLeft
      ? plannerConfig.namesToDeleteLeft.push(nameToDelete)
      : plannerConfig.namesToDeleteDirect.push(nameToDelete);

    let instance;

    if (type === "ms") {
      instance = new SinkInstanse(cabinet, this.sceneSetup);
      instance.name = "m";
    } else if (type !== "ms" && penal) {
      instance = new PenalInstanse(cabinet);
      instance.name = "penal";
    } else if (type !== "ms" && !penal) {
      instance = new ModelInstanse(cabinet, this.sceneSetup);
      instance.name = type;
    }

    instance.side = oldside;
    instance.level = 1;
    instance.id = id;
    instance.fullname = cabinetName;
    instance.raycasterBox.userData.id = id;
    cabinet.position.copy(position);
    cabinet.rotation.y = isLeft ? Math.PI / 2 : 0;

    plannerConfig.selectedObject = instance;
    plannerConfig.models.push(instance);

    if (isLeft) {
      console.log("push to left");
      plannerConfig.modelsLeft.push(instance);
    }
    if (!isLeft) {
      plannerConfig.modelsDirect.push(instance);
    }

    this.scene.add(cabinet);

    this.plannerStore.selectedObject.isSelect = false;
    this.plannerStore.selectedObject.name = false;
    this.plannerStore.objectMenu = false;
    plannerConfig.selectedObject = false;
    plannerConfig.selectedEmpty = false;

    // this.calculateSlotPositions();
    this.sceneSetup.requestRender();
    //   console.log(this.scene)
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

    //   console.log(`Удалено объектов: ${objectsToRemove.length}`);
  }

  removeObjectById(targetId) {
    let objectToRemove = null;

    // Ищем объект
    this.scene.traverse((child) => {
      if (child.userData?.id === targetId) {
        objectToRemove = child;
      }
    });

    // Удаляем если найден
    if (objectToRemove && objectToRemove.parent) {
      // Очищаем ресурсы (геометрию, материалы)
      if (objectToRemove.geometry) objectToRemove.geometry.dispose();

      if (objectToRemove.material) {
        if (Array.isArray(objectToRemove.material)) {
          objectToRemove.material.forEach((m) => m.dispose());
        } else {
          objectToRemove.material.dispose();
        }
      }

      // Удаляем из сцены
      objectToRemove.parent.remove(objectToRemove);
      return true; // Успешно удален
    }

    return false; // Не найден
  }

  checkSimpleCollision(testInstance) {
    const isLeft = plannerConfig.selectedEmpty.userData.side === "left";
    const gap = 0.005;

    const pos = isLeft
      ? testInstance.root.position.z
      : testInstance.root.position.x;

    const size = isLeft
      ? testInstance.objectSize.x // ширина вдоль Z → размер по X
      : testInstance.objectSize.x; // ширина вдоль X → размер по Z

    const testMin = pos - size / 2 + gap;
    const testMax = pos + size / 2 - gap;

    let modelsArray = isLeft
      ? plannerConfig.modelsLeft
      : plannerConfig.modelsDirect;

    //  console.log('isLeft', isLeft)
    //  console.log('modelsArray', modelsArray)

    for (let model of modelsArray) {
      // почему когда ставлю modelsArray неправильно работает
      if (model.root.uuid === testInstance.root.uuid) continue;

      const modelPos = isLeft ? model.root.position.z : model.root.position.x;

      let modelSize = isLeft ? model.objectSize.x : model.objectSize.x;

      if (model.name == "m" && !isLeft) modelSize = 0.6;

      const min = modelPos - modelSize / 2 + gap;
      const max = modelPos + modelSize / 2 - gap;

      const intersects = !(testMax <= min || testMin >= max);
      if (intersects) {
        console.log("Упрощённая коллизия!");
        return true;
      }
    }

    return false;
  }

  checkCollision(testInstance) {
    let modelsArray = plannerConfig.models;
    const gap = 0.01;

    const selectedBox = new THREE.Box3().setFromObject(testInstance.root);
    selectedBox.expandByScalar(-gap); // уменьшаем на зазор

    // console.log("selected", selectedBox);

    for (let model of modelsArray) {
      if (model.root.uuid === testInstance.root.uuid) continue;
      const otherBox = new THREE.Box3().setFromObject(model.root);
      //  console.log('otherBox', otherBox)
      //  otherBox.expandByScalar(gap); // увеличиваем на зазор

      if (selectedBox.intersectsBox(otherBox)) {
        console.log("коллизия с учётом зазора!");
        console.log("selectedBox", selectedBox);
        console.log("other", otherBox);

        return true;
      }
    }

    return false;
  }
}
