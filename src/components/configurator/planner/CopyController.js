import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { ModelInstanse } from "./ModelInstanse";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../pinia/penals";
import { algorithmConfig } from "../builders/Algorithm/algorithmConfig";
import { ModelInstanse2L } from "./ModelInstanse2L";
import { SectorInstanse } from "./SectorInstanse";
import { Model_In_Sector } from "./Model_In_Sector";
import { SinkInstanse } from "./SinkInstanse";




export class CopyController {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = this.sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.plannerStore = usePlannerStore()
    this.penalStore = usePenalStore()
    this.kitchenSizesStore = useKitchenSizesStore()
    this.camera = this.sceneSetup.camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.point = null
    this.moving = false
    this.setToRow = false
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
    this.bounds = {
      minX:0,
      maxX: this.kitchenSizesStore.sideSizes.side_a,
      minZ:0,
      maxZ: this.kitchenSizesStore.sideSizes.side_c,
    }

    this.levelConfig = {
      1: { y: 0, z: 0.3, x: 0.3 },
      2: { y: 1.41, z: 0.15, x: 0.15 }
    };
      
  }

  run() {
    
      const color = 0x00ffff
      const side = plannerConfig.copyObjectSide
      const name = plannerConfig.selectedObject.fullname


      console.log('name', name)

      const model = this.loaderModels.get(name);
      if(!model){
          console.log('ошибка загрузки')
          return
      }
      const box = new THREE.Box3().setFromObject(model);
      const helper = new THREE.Box3Helper(box, color);
      model.add(helper)
      model.visible = false;

      plannerConfig.copyObject = model;
      plannerConfig.copyObjectName = plannerConfig.selectedObject.name;
      plannerConfig.copyObjectFullName = plannerConfig.selectedObject.fullname;

      plannerConfig.copyObjectSide = plannerConfig.selectedObject.side;

      model.position.set(1, 0, 0);
      if(this.kitchenSizesStore.type == 'left')   model.position.set(0, 0, 1);
      model.name = 'copyObject'
      this.scene.add(model);
      this.moving= true
      this.point = new THREE.Vector3()
      this.point.copy(plannerConfig.selectedObject.root.position)
  
  }


  moveNearWallsOnly() {
    this.moving = true;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const level = plannerConfig.selectedObject.level;
    const side = plannerConfig.selectedObject.side;

    let intersects = [];

    // Выбор нужной плоскости в зависимости от уровня и стороны
    if (level === 1) {
      intersects = this.raycaster.intersectObject(plannerConfig.directPlane1level);
    } else if (level === 2) {
      if (side === 'direct') {
        intersects = this.raycaster.intersectObject(plannerConfig.directPlane2level);
      } else if (side === 'left') {
        intersects = this.raycaster.intersectObject(plannerConfig.leftPlane);
      }
    }

    if (!intersects || intersects.length === 0) return;

    // Обработка позиции
    plannerConfig.copyObject.visible = true;
    this.point = intersects[0].point.clone();

    this.updateCopyObjectPosition(this.point, level);
    this.sceneSetup.requestRender();
  }

  updateCopyObjectPosition(point, level) {
    const desiredPos = new THREE.Vector3(point.x, 0, point.z);
    const halfWidth = plannerConfig.copyObjectSize.x / 2;
    const halfDepth = plannerConfig.copyObjectSize.z / 2;

    const bounds = this.bounds



    // Ограничения по границам комнаты
    desiredPos.x = THREE.MathUtils.clamp(point.x, bounds.minX + halfWidth, bounds.maxX - halfWidth);

    desiredPos.z =  THREE.MathUtils.clamp(point.z, bounds.minZ + halfWidth, bounds.maxZ - halfWidth);

    const yPos = level === 1 ? 0 : 1.41;
    const zPos = level === 1 ? 0.3 : 0.15;
    const xSideFixed = level === 1 ? 0.3 : 0.15;

    const type = this.kitchenSizesStore.type;
    const side = plannerConfig.copyObjectSide;

    if (type === 'direct') {
      plannerConfig.copyObject.rotation.y = 0;
      plannerConfig.copyObject.position.set(desiredPos.x, yPos, zPos);


   //   console.log('x', desiredPos.x)
    } else if (type === 'left') {
      if (side === 'direct') {
        plannerConfig.copyObject.rotation.y = 0;
        plannerConfig.copyObject.position.set(desiredPos.x, yPos, zPos);
      } else if (side === 'left') {
        console.log('ypos', yPos)
        plannerConfig.copyObject.rotation.y = Math.PI / 2;
        plannerConfig.copyObject.position.set(xSideFixed, yPos, desiredPos.z);
      }
    }
  }

  set() {
    if (!this.point) return;
    const id = THREE.MathUtils.generateUUID()


    const level = plannerConfig.selectedObject.level;
    const side = plannerConfig.copyObjectSide;

    const rule = this.rules[side]

    plannerConfig.copyObject.updateMatrixWorld(true, true);

    // Проверка на коллизию
    const collision = this.checkCollision(plannerConfig.copyObject);
    if (collision) {
      plannerConfig.copyObject = false;
      this.moving = false;
      this.plannerStore.showError();
      this.setToRow = false;
      this.removeObjectsByName('copyObject');
      return;
    }

    this.removeObjectsByName('copyObject');

    const name = plannerConfig.copyObjectFullName;

    const type = plannerConfig.copyObjectName

    console.log('type', type)

    const model = this.loaderModels.get(name);
    if (!model) {
      console.log('Модуль не найден');
      return;
    }

    
    const deleteArray = plannerConfig[rule.deleteArray]
   
    deleteArray.push(name)

    model.visible = true;

    let instance;
    if (level === 1) {
      if(type === 'm') {
        instance = new SinkInstanse(model, this.sceneSetup);
        instance.name = 'm'
      } else {
        instance = new ModelInstanse(model, this.sceneSetup);
        instance.name = plannerConfig.copyObjectName;
      }
     
      instance.level  = 1
      if (side === 'direct') plannerConfig.modelsDirect.push(instance);
      if (side === 'left') plannerConfig.modelsLeft.push(instance);
    }

    if (level === 2) {
      instance = new ModelInstanse2L(model, this.sceneSetup);
      instance.level  = 2

      if (side === 'direct') plannerConfig.modelsDirect2L.push(instance);
      if (side === 'left') plannerConfig.modelsLeft2L.push(instance);
    }


    instance.fullname = plannerConfig.copyObjectFullName;
    instance.side = side;
    instance.id =id
    instance.raycasterBox.userData.id = id

    this.setObjectPosition(model, this.point, level, side);

    plannerConfig.models.push(instance);
    model.name = name
    this.scene.add(model);

    this.setToRow = true;
    this.moving = false;
    // this.calculateSlotPositions();
    // this.calculateSlotPositions2L()
    // this.calculateSlotsNew();
  }

  setSector(){
   // const level = plannerConfig.selectedObject.level;
    const side = plannerConfig.copyObjectSide;


    const collision = this.checkCollision(plannerConfig.copyObject);
    if (collision) {
      plannerConfig.copyObject = false;
      this.moving = false;
      this.plannerStore.showError();
      this.setToRow = false;

      this.scene.remove(this.instance.root)


    //       plannerConfig.copyObject.root.traverse((child) => {
    //   if (child.geometry) {
    //     child.geometry.dispose();
    //   }
    //   // if (child.material) {
    //   //   if (Array.isArray(child.material)) {
    //   //     child.material.forEach((m) => m.dispose());
    //   //   } else {
    //   //     child.material.dispose();
    //   //   }
    //   // }
    //   // if (child.texture) {
    //   //   child.texture.dispose();
    //   // }


    // });



    // this.instance.modelsGroup.add(modelClone); // добавляем клон


      this.removeObjectsByName('copyObject');
      return;
    }



 //   console.log(level)
    console.log(side)
    this.setToRow = true;
    this.moving = false;

      if (side === 'direct') plannerConfig.modelsDirect2L.push(this.instance);
      if (side === 'left') plannerConfig.modelsLeft2L.push(this.instance);
      plannerConfig.models.push(this.instance);
      this.instance.side = side
      this.instance.level = 2

      console.log('models', plannerConfig.models)
  }





  setObjectPosition(model, point, level, side) {
    const cfg = this.levelConfig[level] || this.levelConfig[1];

    if (side === 'direct') {
      model.rotation.y = 0;
      model.position.set(point.x, cfg.y, cfg.z);
    } else if (side === 'left') {
      model.rotation.y = Math.PI / 2;
      model.position.set(cfg.x, cfg.y, point.z);
    }
  }




  checkCollision(testInstance) {
      const side = plannerConfig.copyObjectSide


      const arrays = {
        'direct':plannerConfig.modelsDirect,
        'left':plannerConfig.modelsLeft,
      }

      
      const modelsArray = arrays[side]
  //    console.log('modelsArray', modelsArray)
      
      const gap = 0.01; 

      const selectedBox = new THREE.Box3().setFromObject(testInstance);
      selectedBox.expandByScalar(-gap); // уменьшаем на зазор


      for (let model of plannerConfig.models) {
    

        const otherBox = new THREE.Box3().setFromObject(model.root);

        //  console.log('selectedBox', selectedBox)
        //   console.log('other', otherBox)
      

        if (selectedBox.intersectsBox(otherBox)) {
        //  console.log("коллизия с учётом зазора!");
          // console.log('selectedBox', selectedBox)
          // console.log('other', otherBox)

          return true;

          
        }
      }

      return false;
  }

  clone() {
    //клонирование сектора
    const id = THREE.MathUtils.generateUUID()
    
    const modelsGroup = plannerConfig.selectedObject.root.getObjectByName('modelsGroup');
    const side = plannerConfig.selectedObject.side
    const width = plannerConfig.selectedObject.width


    if (!modelsGroup) {
      console.warn("modelsGroup не найден!");
      return;
    }


    const clonedGroup = modelsGroup.clone(true);
    this.removeHelpersFromGroup(clonedGroup)


    this.instance = new SectorInstanse (width, this.sceneSetup)
    this.instance.id = id
    this.instance.raycasterBox.userData.id = id
    this.instance.level = 2
    this.instance.width = width
    this.instance.ready = true
    this.instance.root.name = 'SectorTest'

    this.scene.add(this.instance.root);
    //   instance.root.position.set(0.15, 1.41, 1.15);
    this.instance.side = side
  //  plannerConfig.models.push(instance)


    clonedGroup.name = 'clonedGroup'
    plannerConfig.namesToDeleteDirect2L.push('clonedGroup')
    plannerConfig.namesToDeleteDirect2L.push('SectorTest')

    clonedGroup.children.forEach((model, i) => {
    const modelClone = model.clone(true); // полностью клонируем
    modelClone.name = 'test'
    plannerConfig.namesToDeleteDirect2L.push('test')
    const instanseInSector = new Model_In_Sector(modelClone, this.sceneSetup, false);
    this.instance.modules.push(instanseInSector);
    this.instance.modelsGroup.add(modelClone); // добавляем клон
  });

        plannerConfig.copyObject = this.instance.root;
        this.moving = true
        plannerConfig.copyObjectSide = side  
  }



  removeHelpersFromGroup(group) {
  
    const toRemove = [];
    const namesToRemove = ["boxHelper", "yellowBox"];

    group.traverse((child) => {
      if (namesToRemove.includes(child.name)) {
        toRemove.push(child);
      }
    });

    // Теперь удаляем — вне traverse
    toRemove.forEach((child) => {
      if (child.parent) {
        child.parent.remove(child);
      }

      // Очистка ресурсов
      if (child.geometry) child.geometry.dispose?.();
      if (child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => mat.dispose?.());
      }
    });

}


  checkSimpleCollision(testInstance) {
      const side = plannerConfig.copyObjectSide
      const gap = 0.005;
      const isLeft = side == 'left'

      const pos = side == 'left'
        ? testInstance.position.z
        : testInstance.position.x;

      const size = side == 'left'
        ? 0.4 // ширина вдоль Z → размер по X
        : 0.4; // ширина вдоль X → размер по Z

      const testMin = pos - size / 2 + gap;
      const testMax = pos + size / 2 - gap;

      let modelsArray = side == 'left'? plannerConfig.modelsLeft : plannerConfig.modelsDirect

    //  console.log('isLeft', isLeft)
    //  console.log('modelsArray', modelsArray)

      for (let model of modelsArray) { // почему когда ставлю modelsArray неправильно работает 
    //   if (model.root.uuid === testInstance.root.uuid) continue;

        const modelPos = side == 'left' ? model.root.position.z : model.root.position.x;

        let modelSize = side == 'left' ? model.objectSize.x : model.objectSize.x;

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


  calculateCornerBounds(){

        if(this.kitchenSizesStore.type == 'direct'){
          plannerConfig.roomBounds = {
          minX: 0 + plannerConfig.penalsBorders.directLeft,
          maxX: plannerConfig.penalsBorders.directRight,
          minZ: 0.3,
          maxZ: 0.3,
        };
      }

      if(this.kitchenSizesStore.type == 'left'){
          if (plannerConfig.selectedObject.side == "direct") {
          plannerConfig.roomBounds = {
            minX:  0 ,
            maxX: plannerConfig.penalsBorders.directRight,
          };
        }
        if (plannerConfig.selectedObject.side == "left") {
          plannerConfig.roomBounds = {
            minZ:  0, // ограничение движения если левый ряд до угла
            maxZ: plannerConfig.penalsBorders.left,
          };
        }


      const leftEdge = plannerConfig.newSlotsLeft[0].center - plannerConfig.newSlotsLeft[0].width/2
      if (leftEdge < 0.59) {
        console.log('left yes')
        plannerConfig.isAngleRow = 'left'
        if (plannerConfig.selectedObject.side == "direct") {
          plannerConfig.roomBounds = {
            minX:  0.6 ,
            maxX: plannerConfig.penalsBorders.directRight,
          };
        }
        if (plannerConfig.selectedObject.side == "left") {
          plannerConfig.roomBounds = {
            minZ:  0, // ограничение движения если левый ряд до угла
            maxZ: plannerConfig.penalsBorders.left,
          };
        }

      }
      const directEdge = plannerConfig.newSlotsDirect[0].center - plannerConfig.newSlotsDirect[0].width/2
      if (directEdge < 0.59) {
        plannerConfig.isAngleRow = 'direct'

          if (plannerConfig.selectedObject.side == "direct") {
          plannerConfig.roomBounds = {
            minX:  0 ,
            maxX: plannerConfig.penalsBorders.directRight,
          };
        }
        if (plannerConfig.selectedObject.side == "left") {
          plannerConfig.roomBounds = {
            minZ:  0.6, // ограничение движения если левый ряд до угла
            maxZ: plannerConfig.penalsBorders.left,
          };
        }
      } 
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

    

}
