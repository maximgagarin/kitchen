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
    this.penalStore = usePenalStore()
    this.hoveredObject = null
   
    
    this.addToArrays = {
      direct: (instance) => {
        plannerConfig.modelsDirect2L.push(instance);
        plannerConfig.models.push(instance);
      },
      left: (instance) => {
        plannerConfig.modelsLeft2L.push(instance);
        plannerConfig.models.push(instance);
      },
    };
  }

  createGapBoxes() {
    const side = "direct";
    const posY = 1.76;
    let totalWidth = this.kitchenStore.sideSizes.side_a - this.penalStore.penalOffsets.directRight;

    const filtedDirect = plannerConfig.penalsArray.filter(model=> model.side == 'direct')
    plannerConfig.iconsArray2L  = plannerConfig.iconsArray2L.filter(icon => icon.name == 'left')


    // времменно добавляем пеналы
    const models = plannerConfig.modelsDirect2L
    models.push(...filtedDirect)
    models.sort((a, b) => a.root.position.x - b.root.position.x);

 //   console.log('models', models)

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

    const leftOffset = plannerConfig.isAngleRow2L == 'left' ? 0.3 : 0

    // Левый край
    const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);
    if (firstBox.min.x > 0.15 + leftOffset) {
      this.addGapBox(0 +leftOffset, firstBox.min.x, firstBox, posY, side, leftOffset);
    }

    // Правый край
    const lastBox = new THREE.Box3().setFromObject(
      models[models.length - 1].raycasterBox
    );
    if (totalWidth - lastBox.max.x > 0.15) {
      this.addGapBox(lastBox.max.x, totalWidth, lastBox, 1.5, side);
    }

    plannerConfig.modelsDirect2L = plannerConfig.modelsDirect2L.filter(
      model => model.name !== 'penal'
    );
  }

  createGapBoxesLeft() {
    const side = "left";
    const posY = 1.76;
    let totalWidth = this.kitchenStore.sideSizes.side_c - this.penalStore.penalOffsets.left;

    const filtedLeft = plannerConfig.penalsArray.filter(model=> model.side == 'left')
    plannerConfig.iconsArray2L  = plannerConfig.iconsArray2L.filter(icon => icon.name == 'direct')

    

    const models = plannerConfig.modelsLeft2L;


    //временно добавляем пеналы для расчёта
    models.push(...filtedLeft)
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


    const offset = plannerConfig.isAngleRow2L == 'direct' ? 0.3 : 0



    // Левый край
    const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);
    if (firstBox.min.z > 0.15 + offset) {
      this.addGapBoxLeft(0 +offset, firstBox.min.z, firstBox, posY, side);
    }

    // Правый край
    const lastBox = new THREE.Box3().setFromObject(
      models[models.length - 1].raycasterBox
    );
    if (totalWidth - lastBox.max.z > 0.15) {
      this.addGapBoxLeft(lastBox.max.z, totalWidth, lastBox, 1.5, side);
    }

    // удаляем пеналы
     plannerConfig.modelsLeft2L = plannerConfig.modelsLeft2L.filter(
      model => model.name !== 'penal'
    );
  }

  addGapBox(startX, endX, referenceBox, posY, side, leftOffset) {
    const icon = this.loaderModels.get("icon");
    icon.visible = true;
    icon.name = 'direct'
    
    plannerConfig.iconsArray2L.push(icon)

    const gap = endX - startX;
    if (gap <= 0) return;

    const geometry = new THREE.BoxGeometry(gap , 0.7, 0.3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: 0,
      transparent: true,
    });
    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBox";


      const lineHotizontal = new Line(
          this.sceneSetup,
          { x: -gap / 2, y: -2, z: -0.14 },
          { x: gap / 2, y: -2, z: -0.14 },
          0.4,
          1
        );
        gapBox.add(lineHotizontal.group);
        gapBox.userData.side = 'direct'

    plannerConfig.empties2levelDirect.push(gapBox);

   // plannerConfig.iconsArray2L.push(icon)

    gapBox.add(icon);
   // icon.position.set(0,1,0)

    if (side === "left") gapBox.rotation.y = Math.PI / 2;

    // позиция
    if (side === "direct") gapBox.position.set(startX + gap / 2, 1.76, 0.15);
    if (side === "left")
      gapBox.position.set(0.15, posY + 0.01, startX + gap / 2);

    this.scene.add(gapBox);
  }

  addGapBoxLeft(startX, endX, referenceBox, posY, side) {
    const icon = this.loaderModels.get("icon");
    icon.visible = true;
    icon.name = 'left'
    plannerConfig.iconsArray2L.push(icon)


    const gap = endX - startX;
    if (gap <= 0) return;

    const geometry = new THREE.BoxGeometry(gap, 0.7, 0.3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: 0,
      transparent: true,
    });
    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBoxLeft";

     const lineHotizontal = new Line(
          this.sceneSetup,
          { x: -gap / 2, y: -2, z: -0.14 },
          { x: gap / 2, y: -2, z: -0.14 },
          0.4,
          1
        );
        gapBox.add(lineHotizontal.group);

    plannerConfig.empties2levelLeft.push(gapBox);

    gapBox.add(icon);

    gapBox.rotation.y = Math.PI / 2;

        gapBox.userData.side = 'left'


    // позиция
   
    if (side === "left")
      gapBox.position.set(0.15, 1.76, startX + gap / 2);

    this.scene.add(gapBox);
  }

  calculateEmpties() {
    //
    //  if()

    this.removeObjectsByName("gapBox");
    this.removeObjectsByName("gapBoxLeft");

    plannerConfig.empties2levelDirect.length = 0;
    plannerConfig.empties2levelLeft.length = 0;

    if (plannerConfig.modelsDirect2L.length > 0) {
      this.createGapBoxes();
    }
    if (plannerConfig.modelsLeft2L.length > 0) {
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
    const id = THREE.MathUtils.generateUUID()
    

   // console.log(type)
   // console.log(width)
    

    const box = plannerConfig.selectedEmpty2L;

    let side
    if(box.name == 'gapBoxLeft') side = 'left'
    if(box.name == 'gapBox') side = 'direct'

    const cabinetName = `${type}-${width * 1000}`;

  //  console.log('cabinet name', cabinetName)


    //console.log(box);
    const position = box.position.clone();
    let model
   
     model = this.loaderModels.get(cabinetName)

     if(!model){
      console.log('model not found')
      return

     }

    // Временная копия для проверки
      const cabinetClone = model.clone(true);
      
      cabinetClone.position.copy(position);
      //  console.log(testInstance.root.position);
      cabinetClone.rotation.y = side == 'left' ? Math.PI / 2 : 0;
      cabinetClone.position.y = 1.41
      
        const collision = this.checkCollision(cabinetClone);
    
        if (collision) {
          this.plannerStore.showError();
          return;
        }

   // const model = this.loaderModels.get("p600");

  


    model.visible = true;

    // this.scene.add(model)

   // console.log(position);

    const instance = new SectorInstanse(width, this.sceneSetup);
    

    const instanceInSector = new Model_In_Sector(model, this.sceneSetup, false);

    instance.modules.push(instanceInSector);
    instance.modelsGroup.add(model);
    instance.root.position.copy(position);




    if(side == 'left') instance.root.rotation.y = Math.PI/2
    this.scene.add(instance.root);
    instance.root.position.y = 1.41;
    instance.width = width

    instance.id = id
    model.userData.id = id
    instance.raycasterBox.userData.id = id

    //this.plannerStore.sectorWidth = width
    //this.plannerStore.sectorReady = true

    instance.ready = true



     if(side == 'direct'){
    const nameTodelete = cabinetName + '-direct'
    instance.root.name = nameTodelete
    plannerConfig.namesToDeleteDirect2L.push(nameTodelete)
   }
   if(side == 'left'){
    const nameTodelete = cabinetName + '-left'
    instance.root.name = nameTodelete
    plannerConfig.namesToDeleteLeft2L.push(nameTodelete)
   }

    instance.level = 2;
    if(side == 'left') instance.side = 'left'
    if(side == 'direct') instance.side = 'direct'

    plannerConfig.models.push(instance);

    if(side == 'direct')   plannerConfig.modelsDirect2L.push(instance);
    if(side == 'left')   plannerConfig.modelsLeft2L.push(instance);
    this.calculateEmpties();
    
  }

  addToGroup(type, width) {
    //добавление в сектор

//  console.log('wordPOs', plannerConfig.selectedEmptyInSectorWorldPos)

    
   
    const cabinetName = `${type}-${width * 1000}`;

    const model = this.loaderModels.get(cabinetName)

    model.visible = true
    model.position.copy(plannerConfig.selectedEmptyInSectorWorldPos)
    model.position.y = plannerConfig.selectedEmptyInSectorMinY

    if(plannerConfig.selectedSector.side == 'left') model.rotation.y = Math.PI/2
  

     const instance = new Model_In_Sector(model, this.sceneSetup, false);

     plannerConfig.selectedSector.modules.push(instance);
     plannerConfig.selectedSector.modelsGroup.attach(model);
   //  plannerConfig.selectedSector.createNewBoxHelper();
       plannerConfig.selectedSector.modules.forEach((el, index)=>{
      el.slot = index
    })
     this.plannerStore.sectorReady = false 
     instance.ready = false

  }

  checkCollision(testInstance) {
    

    
    const box = plannerConfig.selectedEmpty2L;

    let modelsArray
    if(box.name == 'gapBoxLeft') modelsArray = plannerConfig.modelsLeft2L
    if(box.name == 'gapBox') modelsArray = plannerConfig.modelsDirect2L

    

 

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

  calcEmptyInSector(){

    if(plannerConfig.selectedObject.name !=='sector') return

     plannerConfig.selectedObject.empties.length = 0;
     plannerConfig.selectedObject.emptiesGroup.clear()

     let side
     if(plannerConfig.selectedSector.side == 'direct') side = 'direct'
     if(plannerConfig.selectedSector.side == 'left') side = 'left'


    
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

     //   console.log('box1', box1)
      //  console.log('box2', box2)

      const topEdge = box1.max.y;
      const bottomEdgeNext = box2.min.y;

      // if (leftEdgeNext - rightEdge > 0.15) {
      //   this.addGapBox(rightEdge, leftEdgeNext, box1, 1.5, side);
      // }
    }

    //    Нижний край
    const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);
   // console.log(firstBox)
    if (firstBox.min.y > 1.61) {
  //    console.log('нижний')
      this.addGapBoxInSectror(1.41, firstBox.min.y, firstBox, posY);
    }

     // верхний край
    const lastBox = new THREE.Box3().setFromObject(models[models.length - 1].raycasterBox);
  // console.log(lastBox)

    if (2.11 - lastBox.max.y > 0.2) {
    //  console.log('верхний')
      this.addGapBoxInSectror(lastBox.max.y, 2.11, side,  lastBox, 1.5);
    }

    this.sceneSetup.requestRender()
 //   console.log(this.scene)
  }

  addGapBoxInSectror(startY, endY, side, referenceBox, posY) {
    const icon = this.loaderModels.get("icon");
    icon.visible = true;

    const gap = endY - startY;
    if (gap <= 0) return;

    const geometry = new THREE.BoxGeometry(plannerConfig.selectedObject.width, gap, 0.3);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: 0,
      transparent: true,
    });
    const gapBox = new THREE.Mesh(geometry, material);
    gapBox.name = "gapBoxSector";

    

    gapBox.add(icon);

    if(side == 'left') gapBox.rotation.y = Math.PI / 2;
    

    // позиция
 //   console.log('x',plannerConfig.selectedObject.root.position.x)


    if(side == 'direct'){
      gapBox.position.set(plannerConfig.selectedObject.root.position.x, startY + gap / 2, 0.15);
      gapBox.userData.side = 'direct'
      

    }

    if(side == 'left'){
      gapBox.position.set(0.15, startY + gap / 2, plannerConfig.selectedObject.root.position.z);
      gapBox.userData.side = 'left'


    }

   

   // this.scene.add(gapBox)
    plannerConfig.selectedObject.emptiesGroup.attach(gapBox);
    plannerConfig.selectedObject.empties.push(icon)
  }

  epmtySectorOver() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsEmpties2L = this.raycaster.intersectObjects( plannerConfig.selectedObject.empties, false );


  let found = false;
      if (intersectsEmpties2L.length > 0) {
          const obj = intersectsEmpties2L[0].object;
          if (this.hoveredObject !== obj) {
              if (this.hoveredObject) {
                  this.hoveredObject.material.opacity = 0.0;
                  this.hoveredObject.material.color.set(0x00ff00);
                  this.hoveredObject.children[0].visible = false
              }
              this.hoveredObject = obj;
              this.hoveredObject.material.opacity = 0.5;
              this.hoveredObject.material.color.set(0xffff00);
              this.hoveredObject.children[0].visible = true

          }
          found = true;
      }

      if (!found && this.hoveredObject) {
        this.hoveredObject.children[0].visible = false
          this.hoveredObject.material.opacity = 0.0;
          this.hoveredObject.material.color.set(0x00ff00);
          this.hoveredObject = null;
            

      }
  }

}
