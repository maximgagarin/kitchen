import { plannerConfig } from "./planerConfig";
import * as THREE from "three";
import { SectorInstanse } from "./SectorInstanse";
import { ModelInstanse2L } from "./ModelInstanse2L";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { Model_In_Sector } from "./Model_In_Sector";
import { usePenalStore } from "../../../pinia/penals";
import { Line } from "./Line";

export class EmptyManager2L {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.plannerStore = usePlannerStore();
    this.kitchenStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
    this.hoveredObject = null;
  }

  createGapBoxes() {
    const side = "direct";
    const posY = 1.76;
    let totalWidth = this.kitchenStore.sideSizes.side_a;

    

  

   plannerConfig.empties2level = plannerConfig.empties2level.filter(item=> item.name === 'gapBoxLeft')

    const filtedDirect = plannerConfig.modelsDirect.filter(
      (model) => model.side === "direct" && model.name === "penal"
    );
    // plannerConfig.iconsArray2L = plannerConfig.iconsArray2L.filter(
    //   (icon) => icon.name == "left"
    // );

    // времменно добавляем пеналы
    const models = plannerConfig.modelsDirect2L.map((p) => ({ ...p }));
    //   const models = plannerConfig.modelsDirect2L
    models.push(...filtedDirect);
    models.sort((a, b) => a.root.position.x - b.root.position.x);

      
    // Добавление промежутков
    for (let i = 0; i < models.length - 1; i++) {
      const current = models[i];
      const next = models[i + 1];
      const box1 = new THREE.Box3().setFromObject(current.root);
      const box2 = new THREE.Box3().setFromObject(next.root);

      //  console.log('box1', box1)
      //  console.log('box2', box2)

      const rightEdge = box1.max.x;
      const leftEdgeNext = box2.min.x;

      if (leftEdgeNext - rightEdge > 0.15) {
       
        this.addGapBox(rightEdge, leftEdgeNext, box1, 1.5, side);
      }
    }

    // есть в углу модуль
    const leftOffset = plannerConfig.isAngleRow2L === "left" ? 0.3 : 0;

    if (models.length > 0) {
      // Левый край
      const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);
      if (firstBox.min.x > 0.15 + leftOffset) {
       

        this.addGapBox( 0 + leftOffset, firstBox.min.x,  firstBox,  posY,   side,  leftOffset );
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

    // plannerConfig.modelsDirect2L = plannerConfig.modelsDirect2L.filter(
    //   model => model.name !== 'penal'
    // );

    //   console.log('modelsLengh', models)
  }

  createGapBoxesLeft() {
    const side = "left";
    const posY = 1.76;
    let totalWidth = this.kitchenStore.sideSizes.side_c;

    const filtedLeft = plannerConfig.modelsLeft.filter(
      (model) => model.side == "left" && model.name === "penal"
    );
    // plannerConfig.iconsArray2L = plannerConfig.iconsArray2L.filter(
    //   (icon) => icon.name == "direct"
    // );

    plannerConfig.empties2level = plannerConfig.empties2level.filter(item=> item.name === 'gapBoxDirect')


    // const models = plannerConfig.modelsLeft2L;
    const models = plannerConfig.modelsLeft2L.map((p) => ({ ...p }));

    //временно добавляем пеналы для расчёта
    models.push(...filtedLeft);
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

    const offset = plannerConfig.isAngleRow2L == "direct" ? 0.3 : 0;

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
      console.log("empty");
      this.addGapBox(offset, totalWidth, 1, 1.5, side);
    }

    // удаляем пеналы
    //  plannerConfig.modelsLeft2L = plannerConfig.modelsLeft2L.filter(
    //   model => model.name !== 'penal'
    // );
  }

  addGapBox(startX, endX, referenceBox, posY, side, leftOffset) {
    // const icon = this.loaderModels.get("icon");
    // icon.visible = true;
    // icon.name = "direct";

 //   plannerConfig.iconsArray2L.push(icon);

    const gap = endX - startX;
    if (gap <= 0) return;

    const geometry = new THREE.BoxGeometry(gap, 0.7, 0.3);
    const material = new THREE.MeshStandardMaterial({
      color: 'yellow',
      transparent: true,
      opacity: 0,
  
    });

    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBoxDirect";

    const lineHotizontal = new Line(
      this.sceneSetup,
      { x: -gap / 2, y: 0.3, z: -0.14 },
      { x: gap / 2, y: 0.3, z: -0.14 },
      0.4,
      1
    );
    gapBox.add(lineHotizontal.group);
    gapBox.userData.side = "direct";

    plannerConfig.empties2level.push(gapBox);

    // plannerConfig.iconsArray2L.push(icon)

    //gapBox.add(icon);
    // icon.position.set(0,1,0)

    if (side === "left") gapBox.rotation.y = Math.PI / 2;

    // позиция
    if (side === "direct") gapBox.position.set(startX + gap / 2, 1.76, 0.15);
    if (side === "left") gapBox.position.set(0.15, 1.76, startX + gap / 2);

    this.scene.add(gapBox);
  }

  addGapBoxLeft(startX, endX, referenceBox, posY, side) {
    // const icon = this.loaderModels.get("icon");
    // icon.visible = true;
    // icon.name = "left";
    // plannerConfig.iconsArray2L.push(icon);

    const gap = endX - startX;
    if (gap <= 0) return;

    const geometry = new THREE.BoxGeometry(gap, 0.7, 0.3);
    const material = new THREE.MeshStandardMaterial({
      color: 'yellow',
      transparent: true,
      opacity: 0,
  
    });
    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBoxLeft";

    const lineHotizontal = new Line(
      this.sceneSetup,
      { x: -gap / 2, y: 0.3, z: -0.14 },
      { x: gap / 2, y: 0.3, z: -0.14 },
      0.4,
      1
    );
    gapBox.add(lineHotizontal.group);

    plannerConfig.empties2level.push(gapBox);


    gapBox.rotation.y = Math.PI / 2;

    gapBox.userData.side = "left";

   

    if (side === "left") gapBox.position.set(0.15, 1.76, startX + gap / 2);

    this.scene.add(gapBox);
  }

  calculateEmpties() {
   this.removeObjectsByName("gapBoxDirect");
   this.removeObjectsByName("gapBoxLeft");

   plannerConfig.empties2level.length = 0;
   

    if (plannerConfig.modelsDirect2L.length >= 0) {
      this.createGapBoxes();
    }
    if (
      this.kitchenStore.type === "left" &&
      plannerConfig.modelsLeft2L.length >= 0
    ) {
      this.createGapBoxesLeft();
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

      this.scene.remove(object)

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

    // console.log(`Удалено объектов: ${objectsToRemove.length}`);
  }

  addToEmpty(type, width) {
    const id = THREE.MathUtils.generateUUID();

    console.log("type", type);
    // console.log(width)

    const box = plannerConfig.selectedEmpty2L;

    console.log('box', box)

    let side;
    if (box.name == "gapBoxLeft") side = "left";
    if (box.name == "gapBoxDirect") side = "direct";

    const cabinetName = `${type}-${width * 1000}`;

    console.log("cabinet name", cabinetName);

    //console.log(box);
    const position = box.position.clone();

    console.log('pos', position)
    let model;

    model = this.loaderModels.get(cabinetName);

    if (!model) {
      console.log("model not found");
      return;
    }

    // Временная копия для проверки
    const cabinetClone = model.clone(true);

    cabinetClone.position.copy(position);
    //  console.log(testInstance.root.position);
    cabinetClone.rotation.y = side == "left" ? Math.PI / 2 : 0;
    cabinetClone.position.y = 1.41;

    const collision = this.checkCollision(cabinetClone);

    if (collision) {
      this.plannerStore.showError();
      return;
    }

    model.visible = true;

    const instance = new SectorInstanse(width, this.sceneSetup);

    const instanceInSector = new Model_In_Sector(model, this.sceneSetup, false);

    instance.modules.push(instanceInSector);
    instance.modelsGroup.add(model);
    instance.root.position.copy(position);

    if (side == "left") instance.root.rotation.y = Math.PI / 2;
    this.scene.add(instance.root);
    instance.root.position.y = 1.41;
    instance.width = width;

    instance.id = id;
    model.userData.id = id;
    instance.raycasterBox.userData.id = id;

    //this.plannerStore.sectorWidth = width
    //this.plannerStore.sectorReady = true

    instance.ready = true;

    if (side == "direct") {
      const nameTodelete = cabinetName + "-direct";
      instance.root.name = nameTodelete;
      plannerConfig.namesToDeleteDirect2L.push(nameTodelete);
    }
    if (side == "left") {
      const nameTodelete = cabinetName + "-left";
      instance.root.name = nameTodelete;
      plannerConfig.namesToDeleteLeft2L.push(nameTodelete);
    }

    instance.level = 2;
    if (side == "left") instance.side = "left";
    if (side == "direct") instance.side = "direct";

    plannerConfig.models.push(instance);

    if (side == "direct") plannerConfig.modelsDirect2L.push(instance);
    if (side == "left") plannerConfig.modelsLeft2L.push(instance);
    this.calculateEmpties();
  }

  addToGroup(type, width) {
    //добавление в сектор

    const cabinetName = `${type}-${width * 1000}`;

    const is900 = this.kitchenStore.modules_height.height2level ===  0.9
    const maxY = is900 ? 2.315 :  2.115 // максимальная высота

    const model = this.loaderModels.get(cabinetName);

    const box = new THREE.Box3().setFromObject(model);
    console.log('box', box)

    const modelHeight = box.max.y - box.min.y

    console.log('heig', modelHeight)

    model.visible = true;
    model.position.copy(plannerConfig.selectedEmptyInSectorWorldPos);

    console.log('plannerConfig.selectedEmptyInSectorWorldPos', plannerConfig.selectedEmptyInSectorWorldPos)

    const posY = plannerConfig.selectedEmptyInSectorWorldPos.y - modelHeight/2

    console.log('posy', posY)

    model.position.y = posY

    if (plannerConfig.selectedSector.side == "left") model.rotation.y = Math.PI / 2;

  
    const box2 = new THREE.Box3().setFromObject(model);

    console.log('maxY', maxY)

    console.log('box2', box2)

    if((box2.max.y > maxY) || (box2.min.y < 1.4)) {
      console.log('1')
      this.plannerStore.showError();
      return;
    }

    const collision = this.checkCollisionInSector(model)

    if(collision){
      console.log('2')

      this.plannerStore.showError();
      return;
    }

    console.log('collision', collision)

    const instance = new Model_In_Sector(model, this.sceneSetup, false);

    plannerConfig.selectedSector.modules.push(instance);
    plannerConfig.selectedSector.modelsGroup.attach(model);
    //  plannerConfig.selectedSector.createNewBoxHelper();
    plannerConfig.selectedSector.modules.forEach((el, index) => {
      el.slot = index;
    });
    this.plannerStore.sectorReady = false;
    instance.ready = false;
  }

  checkCollision(testInstance) {
    const box = plannerConfig.selectedEmpty2L;

    let modelsArray;
    if (box.name == "gapBoxLeft") modelsArray = plannerConfig.modelsLeft2L;
    if (box.name == "gapBoxDirect") modelsArray = plannerConfig.modelsDirect2L;

    const gap = 0.01;

    const selectedBox = new THREE.Box3().setFromObject(testInstance);
    selectedBox.expandByScalar(-gap); // уменьшаем на зазор

    console.log("selected", selectedBox);

    for (let model of modelsArray) {
      if (model.uuid === testInstance.uuid) continue;
      const otherBox = new THREE.Box3().setFromObject(model.root);
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

  calcEmptyInSector() {
    if (plannerConfig.selectedObject.name !== "sector") return;

    const maxY = this.kitchenStore.modules_height.height2level === 0.9 ? 2.311 : 2.111

    plannerConfig.selectedObject.empties.length = 0;
    plannerConfig.selectedObject.emptiesGroup.clear();

    let side;
    if (plannerConfig.selectedSector.side == "direct") side = "direct";
    if (plannerConfig.selectedSector.side == "left") side = "left";

    const posY = 1.76;
    let totalHeight = 0.7;

    //  console.log(plannerConfig.selectedSector.modules)

    const models = plannerConfig.selectedSector.modules;

    models.sort((a, b) => a.root.position.y - b.root.position.y);

    // Добавление промежутков
    for (let i = 0; i < models.length - 1; i++) {
      const current = models[i];
      const next = models[i + 1];
      const box1 = new THREE.Box3().setFromObject(current.root);
      const box2 = new THREE.Box3().setFromObject(next.root);
      const maxEdge = box1.max.y;
      const minEdge = box2.min.y;

      if (minEdge - maxEdge > 0.199) {
        this.addGapBoxInSectror(maxEdge, minEdge, side, 1.5, side);
      }
    }

    //    Нижний край
    const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);

   //   console.log('maxY', maxY)
   // console.log('firstBox', firstBox)

    if (firstBox.min.y > 1.41) {
  //        console.log('нижний')
      this.addGapBoxInSectror(1.41, firstBox.min.y, side,  firstBox, posY);
    }

    // верхний край
    const lastBox = new THREE.Box3().setFromObject(models[models.length - 1].raycasterBox );
    // console.log(lastBox)

  

    if (maxY - lastBox.max.y >= 0.2) {
      //  console.log('верхний')
      this.addGapBoxInSectror(lastBox.max.y, maxY, side, lastBox, 1.5);
    }

    this.sceneSetup.requestRender();
    //   console.log(this.scene)
  }

  addGapBoxInSectror(startY, endY, side, referenceBox, posY) {
    const icon = this.loaderModels.get("icon");
    icon.scale.set(0.6, 0.6, 0.6);
    icon.visible = true;

    const gap = endY - startY;
 //   console.log('gap', gap)
    if (gap < 0.2) return;

    const geometry = new THREE.BoxGeometry(
      plannerConfig.selectedObject.width,
      gap,
      0.3
    );
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
  
    });
    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBoxSector";

 

    gapBox.userData.height = gap

    if (side == "left") gapBox.rotation.y = Math.PI / 2;

    // позиция
    //   console.log('x',plannerConfig.selectedObject.root.position.x)

    if (side == "direct") {
      gapBox.position.set(
        plannerConfig.selectedObject.root.position.x,
        startY + gap / 2,
        0.15
      );
      gapBox.userData.side = "direct";
    }

    if (side == "left") {
      gapBox.position.set(
        0.15,
        startY + gap / 2,
        plannerConfig.selectedObject.root.position.z
      );
      gapBox.userData.side = "left";
    }

    // this.scene.add(gapBox)
    plannerConfig.selectedObject.emptiesGroup.attach(gapBox);
    plannerConfig.selectedObject.empties.push(gapBox);
  }

  checkCollisionInSector(testInstance) {
   

    const gap = 0.005;

    const models = plannerConfig.selectedSector.modules

    const selectedBox = new THREE.Box3().setFromObject(testInstance);
    selectedBox.expandByScalar(-gap); // уменьшаем на зазор

    console.log("selected", selectedBox);

    for (let model of models) {
     
      const otherBox = new THREE.Box3().setFromObject(model.root);
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

  epmtySectorOver() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsEmpties2L = this.raycaster.intersectObjects(
      plannerConfig.selectedObject.empties,
      false
    );

    let found = false;
    if (intersectsEmpties2L.length > 0) {
      const obj = intersectsEmpties2L[0].object;
      if (this.hoveredObject !== obj) {
        if (this.hoveredObject) {
          this.hoveredObject.material.opacity = 0.0;
          this.hoveredObject.material.color.set(0x00ff00);
          this.hoveredObject.children[0].visible = false;
        }
        this.hoveredObject = obj;
        this.hoveredObject.material.opacity = 0.5;
        this.hoveredObject.material.color.set(0xffff00);
        this.hoveredObject.children[0].visible = true;
      }
      found = true;
    }

    if (!found && this.hoveredObject) {
      this.hoveredObject.children[0].visible = false;
      this.hoveredObject.material.opacity = 0.0;
      this.hoveredObject.material.color.set(0x00ff00);
      this.hoveredObject = null;
    }
  }
}
