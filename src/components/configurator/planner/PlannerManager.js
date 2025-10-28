import * as THREE from "three";
import { usePlannerStore } from "../../../pinia/PlannerStore";

import { usePenalStore } from "../../../pinia/penals";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { createPlanesForRaycaster } from "./utils/planes";
import { RotationController } from "./RotationController";
import { CopyController } from "./CopyController";


import { gsap } from "gsap";
import { ResizableModule } from "./ResizableModule";
import { plannerConfig } from "./planerConfig";



import { EmptyManager } from "./EmptyManager";
import { MoveController } from "./MoveController";
import { MoveController2L } from "./MoveController2L";
import { ChangeController } from "./ChangeController";
import { SwapController } from "./SwapController";

import { algorithmConfig } from "../builders/Algorithm/algorithmConfig";
import { deletePlane } from "./utils/deletePlane";
import { TableTop } from "../builders/Algorithm/TableTop";

import { EmptyManager2L } from "./EmptyManager2L";
import { CombinationController } from "./CombinationController";
import { MoveInSector } from "./Move_In_Sector";
import { UtilsManager } from "./UtilsManager";
import { MenuController } from "./MenuController";



export class PlannerManager {
  constructor(scene, loaderModels) {
    this.sceneSetup = scene;
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
    this.plannerStore = usePlannerStore();
    this.container = scene.container;
    this.scene = scene.scene;
    this.loaderModels = loaderModels;
    this.camera = scene.camera;
    this.controls = scene.controls;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.hoveredObject = null;
    this.hoveredObject1level = null;
    this.directPlane = null;
    this.wallPlane = null;
    

    this.isMoving = false;
    this.isDragging = false;
    this.movedBack = false

    this.resizableModule = new ResizableModule(this.scene, this, this.loaderModels );
    this.isMoving = false;


    //габариты объекта
    this.objectSize = new THREE.Vector3();

    this.box = null;
    //офсет для передвижения без рывка
    this.offset = new THREE.Vector3();

    this.tableTop = new TableTop(this.sceneSetup, this.loaderModels)
    this.rotationController = new RotationController(this.sceneSetup);
    this.emptyManager = new EmptyManager(this.sceneSetup, this.loaderModels)
    this.moveController = new MoveController(this.sceneSetup)
    this.moveController2L = new MoveController2L(this.sceneSetup)
    this.changeController = new ChangeController(this.sceneSetup, this.loaderModels, this.emptyManager)
    this.copyController = new CopyController(this.sceneSetup, this.loaderModels)
    this.emptyManager2L = new EmptyManager2L(this.sceneSetup, this.loaderModels)
    this.combinationController = new CombinationController(this.sceneSetup)
    this.swapController = new SwapController(this.sceneSetup)
    this.moveInSector = new MoveInSector(this.sceneSetup)
    this.utils = new UtilsManager(this.sceneSetup, this.loaderModels)
    this.menuController = new MenuController(this.sceneSetup, this.loaderModels)


    this.roomBounds = null;
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
    this.emptyManager.calculateEmpties()

    if(this.kitchenSizesStore.type == 'left'){
      this.emptyManager.calculateEmptiesLeft()
    }

    

    this.tableTop.create()
    
   
    this.emptyManager2L.calculateEmpties()

    this.sceneSetup.requestRender();
  }





  rotation(rotate) {
    this.rotationController.rotateSelected(plannerConfig.selectedObject, rotate);
    this.sceneSetup.requestRender();
  }


  
  checkSimpleCollision(testInstance) {
    const isLeft = plannerConfig.sideOfSelected === "left";
    const gap = 0.005;

    const pos = isLeft
      ? testInstance.root.position.z
      : testInstance.root.position.x;

    const size = isLeft
      ? testInstance.objectSize.x // ширина вдоль Z → размер по X
      : testInstance.objectSize.x; // ширина вдоль X → размер по Z

    const testMin = pos - size / 2 + gap;
    const testMax = pos + size / 2 - gap;

    let modelsArray = isLeft? plannerConfig.modelsLeft : plannerConfig.modelsDirect

  //  console.log('isLeft', isLeft)
  //  console.log('modelsArray', modelsArray)

    for (let model of modelsArray) { // почему когда ставлю modelsArray неправильно работает 
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



 

  // если выбран модуль  меняем размер или пустой бокс добавляем модуль
  addModule(type, width, penal){
    if(plannerConfig.selectedObject.level == 1){
      console.log('changeSelected')
      this.changeController.changeSelected(type, width)
      this.emptyManager.calculateEmpties()
      this.tableTop.create() 
      this.sceneSetup.requestRender()
      

    } else if(plannerConfig.selectedEmpty){
      console.log('addToEmpty')
     
      this.emptyManager.addToEmpty(type, width, penal)
      this.emptyManager.calculateEmpties()
      this.tableTop.create() 
      this.sceneSetup.requestRender()
      
    } else if(plannerConfig.selectedEmpty2L.name){
      console.log('addToEmpty2')

      this.emptyManager2L.addToEmpty(type, width)
  
    }
     else if(plannerConfig.selectedEmptyInSector){
      console.log('addToEmptySector')

      this.emptyManager2L.addToGroup(type, width)
   
    }

  }



 
 
  checkMoveBack(){
    const side = plannerConfig.selectedObject.side;
    const level = plannerConfig.selectedObject.level

    const movingBox = new THREE.Box3().setFromObject(
      plannerConfig.selectedObject.raycasterBox
    );
    const movingCenter = new THREE.Vector3();
    movingBox.getCenter(movingCenter);

    
    let modelsArray
    if(level == 1){
      side == 'direct'? modelsArray = plannerConfig.modelsDirect : modelsArray = plannerConfig.modelsLeft 
    }

    if(level == 2){
      side == 'direct'? modelsArray = plannerConfig.modelsDirect2L : modelsArray = plannerConfig.modelsLeft2L 
    }

    for (let model of modelsArray) {
      if (model.root.uuid === plannerConfig.selectedObject.root.uuid) continue;

      const staticBox = new THREE.Box3().setFromObject(model.raycasterBox);

      let overlap, movingSize;

      if (side === "direct") {
        // Сравнение по X
        overlap =
          Math.min(movingBox.max.x, staticBox.max.x) -
          Math.max(movingBox.min.x, staticBox.min.x);
        movingSize = movingBox.max.x - movingBox.min.x;
      } else if (side === "left" || side === "right") {
        // Сравнение по Z
        overlap =
          Math.min(movingBox.max.z, staticBox.max.z) -
          Math.max(movingBox.min.z, staticBox.min.z);
        movingSize = movingBox.max.z - movingBox.min.z;
      } else {
        console.warn("checkSwapCandidate: Unknown kitchenType", side);
        continue;
      }

     

      // Если есть перекрытие и оно больше половины размера — вернуть модель
      if (overlap > 0.05 && overlap < 0.2) {
        console.log('over')
        plannerConfig.moveBack.otherBox = model;
        this.movedBack  = true 
        this.plannerStore.movedBack = true
        if(side == 'direct'){
          if(plannerConfig.selectedObject.root.position.x < model.root.position.x){
          plannerConfig.moveBack.side = 'right'
        }
         if(plannerConfig.selectedObject.root.position.x > model.root.position.x){
          plannerConfig.moveBack.side = 'left'
        }
         return; // сразу выйти
        }
          if(side == 'left'){
          if(plannerConfig.selectedObject.root.position.z > model.root.position.z){
          plannerConfig.moveBack.side = 'right'
        }
         if(plannerConfig.selectedObject.root.position.z < model.root.position.z){
          plannerConfig.moveBack.side = 'left'
        }
         return; // сразу выйти
        }
        
      }
    }

   this.movedBack = false;
this.plannerStore.movedBack = false;
    return null;
  }


 


  showPointer() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsControls = this.raycaster.intersectObjects(
       plannerConfig.selectedObject.controls,
      false
    );

    if (intersectsControls.length > 0) {
      document.body.style.cursor = "pointer"; //  "pointer" как на кнопках
    } else {
      document.body.style.cursor = "default";
    }
  }

  showPointerPenal() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersectsControls = this.raycaster.intersectObject(
      this.selectedPenal.raycasterControl[0],
      false
    );

    if (intersectsControls.length > 0) {
      document.body.style.cursor = "pointer"; //  "pointer" как на кнопках
    } else {
      document.body.style.cursor = "default";
    }
  }

  epmtyBoxesMouseOver() {

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsControls = this.raycaster.intersectObjects(
      plannerConfig.iconsArray,
      true
    );

    if (intersectsControls.length > 0) {
      document.body.style.cursor = "pointer"; //  "pointer" как на кнопках
    } else {
      document.body.style.cursor = "default";
    }
  }

  // epmtyBoxesMouseOver() {

  //   this.raycaster.setFromCamera(this.mouse, this.camera);
  //   const intersectsControls = this.raycaster.intersectObjects(
  //      [...plannerConfig.boxesArrayDirect, ...plannerConfig.boxesArrayLeft],
  //     false
  //   );

  //   let found = false;
  //     if (intersectsControls.length > 0) {
  //         const obj = intersectsControls[0].object;
  //        // console.log(obj)
  //         if (this.hoveredObject1level !== obj) {
  //             if (this.hoveredObject1level) {
  //                 this.hoveredObject1level.material.opacity = 0.0;
  //                 this.hoveredObject1level.material.color.set(0x00ff00);
  //                 this.hoveredObject1level.children[0].visible = false
                 
  //             }
  //             this.hoveredObject1level = obj;
  //             this.hoveredObject1level.material.opacity = 0.5;
  //             this.hoveredObject1level.material.color.set(0xffff00);
  //             this.hoveredObject1level.children[0].visible = true
                


  //         }
  //         found = true;
  //     }

  //     if (!found && this.hoveredObject1level) {
  //       this.hoveredObject1level.children[0].visible = false
                 

  //         this.hoveredObject1level.material.opacity = 0.0;
  //         this.hoveredObject1level.material.color.set(0x00ff00);
  //         this.hoveredObject1level = null;
            

  //     }
  // }


  epmtyBoxesMouseOver2(){
   // console.log('nen')
     this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsControls = this.raycaster.intersectObjects(
      plannerConfig.iconsArray2L,
      true
    );

    if (intersectsControls.length > 0) {
     
      document.body.style.cursor = "pointer"; //  "pointer" как на кнопках
    } else {
      document.body.style.cursor = "default";
    }
  }


  // epmtyBoxesMouseOver2() {
  //   this.raycaster.setFromCamera(this.mouse, this.camera);
  //   const intersectsEmpties2L = this.raycaster.intersectObjects(
  //   [...plannerConfig.empties2levelDirect, ...plannerConfig.empties2levelLeft],
  //   false
  // );


  // let found = false;
  //     if (intersectsEmpties2L.length > 0) {
  //         const obj = intersectsEmpties2L[0].object;
  //         if (this.hoveredObject !== obj) {
  //             if (this.hoveredObject) {
  //                 this.hoveredObject.material.opacity = 0.0;
  //                 this.hoveredObject.material.color.set(0x00ff00);
  //                 this.hoveredObject.children[0].visible = false
  //             }
  //             this.hoveredObject = obj;
  //             this.hoveredObject.material.opacity = 0.5;
  //             this.hoveredObject.material.color.set(0xffff00);
  //             this.hoveredObject.children[0].visible = true

  //         }
  //         found = true;
  //     }

  //     if (!found && this.hoveredObject) {
  //       this.hoveredObject.children[0].visible = false
  //         this.hoveredObject.material.opacity = 0.0;
  //         this.hoveredObject.material.color.set(0x00ff00);
  //         this.hoveredObject = null;
            

  //     }
  // }
  
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


  clearSettings() {

    //невидимость для кнопок
    if(plannerConfig.selectedObject){
         plannerConfig.selectedObject.controls.forEach((model) => {
      model.visible = false;
     
    });
      plannerConfig.selectedObject.boxHelper.visible = false
    }

  

 
    //  удлить из стора если кликаем в пустоту
    plannerConfig.selectedObject = false;
    this.selectedPenal = null;
    this.plannerStore.selectedObject.isSelect = false;
    this.plannerStore.selectedObject.name = "";
    plannerConfig.selectedEmpty = false
    //this.selectedEmpty = intersect
    this.allowedWidths = null;
    this.currentIndex = null;
    plannerConfig.objectControls.length = 0;
    this.plannerStore.objectMenu = false;
    this.plannerStore.objectMenuL2 = false
     plannerConfig.selectedEmpty2L = false

 
 
    this.sceneSetup.requestRender();
  }

  setSelectObjectSettings(controller) {
    console.log(plannerConfig.selectedObject);
    // plannerConfig.selectedObject.tabletop.visible = true
    // console.log(plannerConfig.selectedObject.tabletop.visible)

  





    //создание массива для проверки коллизии
    plannerConfig.arraysToCheck.length = 0
    const side = plannerConfig.selectedObject.side
    const level = plannerConfig.selectedObject.level

   

    if(this.kitchenSizesStore.type == 'left'){
     
        if(level === 1){
          if(side == 'direct'){
            plannerConfig.arraysToCheck.push(...plannerConfig.modelsLeft)
          }
          if(side == 'left'){
            plannerConfig.arraysToCheck.push(...plannerConfig.modelsDirect)
          }
        }
    }

    const isPenal = plannerConfig.selectedObject.name === "penal";

    if (isPenal) {
      plannerConfig.arraysToCheck.push(...plannerConfig.models);
    } else {
      plannerConfig.arraysToCheck.push(...plannerConfig.penalsArray);
    }

   
  
    
  

     

   
   
    // габариты
    const objectSize = new THREE.Vector3();

    this.box = new THREE.Box3().setFromObject(plannerConfig.selectedObject.raycasterBox);
    this.box.getSize(this.objectSize);
    this.box.getSize(objectSize);

    this.box.getSize(this.moveController.objectSize);
    plannerConfig.copyObjectSize = objectSize

    // this.oldPosition = plannerConfig.selectedObject.root.position.clone();
    const planeHit = plannerConfig.selectedObject.level == 1? 
    this.raycaster.intersectObject(plannerConfig.directPlane1level)[0]:
    this.raycaster.intersectObject(plannerConfig.directPlane2level)[0]

    //console.log('planeHit', planeHit)

    // if (planeHit) {
    //   // 2. Вычисляем offset: позиция объекта - точка пересечения
    //   this.offset.copy(controller.root.position).sub(planeHit.point);
    //   console.log('rootPos', controller.root.position)
    //   console.log('planehitPoint', planeHit.point)

    //   this.moveController.offset.copy(controller.root.position).sub(planeHit.point);



    // }
    this.plannerStore.selectedObject.isSelect = true;
    this.plannerStore.selectedObject.name = controller.root.name;

    //невидимость для кнопок 
    plannerConfig.selectedObject.controls.forEach((model) => {
  //   console.log('2222222')
         model.visible = true   
      });

    plannerConfig.selectedObject.boxHelper.visible = true
   

    
    //сторона
    plannerConfig.sideOfSelected = plannerConfig.selectedObject.side;

    // const intersectControls = this.raycaster.intersectObjects(plannerConfig.selectedObject.controls, false);

    // if (intersectControls.length > 0 ) {
    //  this.controlsIntersected(intersectControls[0].object, event);
    // }
    // //массив доступной ширины текущего объекта
    this.resizableModule.set();
  //  this.controls.enabled = false;

    
   
    
     

    

   // console.log('selectedObject',plannerConfig.selectedObject);
  }

  setLevel2Setttings(){


    
    plannerConfig.arraysToCheck.length = 0
    const side = plannerConfig.selectedObject.side
    const level = plannerConfig.selectedObject.level

    if(this.kitchenSizesStore.type == 'left'){
        if(level === 2){
          console.log('1')
          if(side == 'direct'){
          console.log('2')
            plannerConfig.arraysToCheck.push(...plannerConfig.modelsLeft2L)
          }
          if(side == 'left'){
          console.log('3')
            plannerConfig.arraysToCheck.push(...plannerConfig.modelsDirect2L)
          }
        }
    }




  //  this.controls.enabled = false
      plannerConfig.selectedObject.controls.forEach((model) => {
         model.visible = true   
      });

       const planeHit =  this.raycaster.intersectObject(plannerConfig.directPlane2level)[0]


    plannerConfig.selectedObject.boxHelper.visible = true
     if (planeHit) {
      // 2. Вычисляем offset: позиция объекта - точка пересечения
      this.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
      this.moveController2L.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
    }


      const otherBox = new THREE.Box3().setFromObject(plannerConfig.selectedObject.root);
  //    console.log('otherBox', otherBox)

    
      this.moveController2L.bounds2level()
        const objectSize = new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(plannerConfig.selectedObject.raycasterBox);
    box.getSize(objectSize);
    plannerConfig.copyObjectSize = objectSize


    

 

     plannerConfig.setFromObject = new THREE.Box3().setFromObject(plannerConfig.selectedObject.root);
     


    if(plannerConfig.selectedObject.name == 'sector'){

      this.plannerStore.sectorWidth = plannerConfig.selectedObject.width
      this.plannerStore.sectorReady = plannerConfig.selectedObject.ready



      plannerConfig.selectedSector = plannerConfig.selectedObject
      this.emptyManager2L.calcEmptyInSector()
      const intersectsModules = this.raycaster.intersectObjects(plannerConfig.selectedObject.modules.map((m) => m.raycasterBox)  , false);
      const intersectsEmpties = this.raycaster.intersectObjects(plannerConfig.selectedObject.empties  , true);

      //пустые в секторе
     if(intersectsEmpties.length>0){
        console.log('empty')


        let empty =  intersectsEmpties[0].object
  



        while (empty && !empty.userData.side && empty.parent) {
          empty = empty.parent;
        }

        plannerConfig.selectedEmptyInSector = empty

        const box = new THREE.Box3().setFromObject(plannerConfig.selectedEmptyInSector);
        plannerConfig.selectedEmptyInSectorMinY = box.min.y
         

        plannerConfig.selectedEmptyInSectorWorldPos =
        plannerConfig.selectedEmptyInSector.getWorldPosition(new THREE.Vector3());

         
        this.plannerStore.objectMenuL2 = true
       
         
     }


     //выделенный модуль в секторе
     if(intersectsModules.length>0){
     this.controls.enabled = false

      const id = intersectsModules[0].object.userData.id
      const model = plannerConfig.selectedObject.modules.find(m=> m.id == id)
     // console.log(controller)
      plannerConfig.isSector = true
      plannerConfig.selectedInSector = model
     
     }

    }


   
  }



  emptiesIntersetsClick(intersect) {
    while (intersect && !intersect.userData.side && intersect.parent) {
    intersect = intersect.parent;
    }

    if (intersect && intersect.userData.side) {
      console.log("Нашли userData:", intersect.userData);
    }
     this.emptyManager.calcEmtyForPenal(intersect)
    console.log(intersect)
    this.plannerStore.objectMenu = true;
    plannerConfig.selectedEmpty = intersect
   // this.selectedEmpty = intersect;
    console.log(this.emptyPosition);
  }
 

  // emptiesIntersetsClick(intersect) {
  // //  plannerConfig.selectedEmptyUUID = intersect.uuid
  //   this.emptyManager.calcEmtyForPenal(intersect)
  //   this.plannerStore.objectMenu = true;
  //   plannerConfig.selectedEmpty = intersect
  //  // this.selectedEmpty = intersect;
  // //  console.log(plannerConfig.selectedEmpty.uuid);
  //   //console.log(plannerConfig.boxesArrayDirect[0].uuid)
  // }

  controlsIntersected(intersect, event) {
    const side = plannerConfig.selectedObject.side
    const rules = {
      direct:{
        array:"modelsDirect"
      },
      left:{
        array:"modelsLeft"
      },
      right:{
        array:"modelsRight"
      }
    }

    const rule = rules[side]
    const modelsArray = plannerConfig[rule.array]

 //   console.log(intersect);
    if (intersect.name == "centerControl") {
   // свиг чтобы не было рывка 
    const planeHit =   this.raycaster.intersectObject(plannerConfig.directPlane1level)[0]
      if (planeHit) {
        // 2. Вычисляем offset: позиция объекта - точка пересечения
        this.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
        console.log('rootPos', plannerConfig.selectedObject.root.position)
        console.log('planehitPoint', planeHit.point)
        this.moveController.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
      }
      this.isMoving = true;
      if(plannerConfig.selectedObject.side == 'direct'){
        plannerConfig.tabletops.forEach(item=>{item.visible = false})
        plannerConfig.modelsDirect.forEach(item => {
          if(item.name =='penal') return
          item.tabletop.visible = true})
      } 
      else if(plannerConfig.selectedObject.side == 'left'){
        plannerConfig.tabletopsLeft.forEach(item=>{item.visible = false})
        plannerConfig.modelsLeft.forEach(item => {
        if(item.name =='penal') return
        item.tabletop.visible = true})
      }
      this.sceneSetup.requestRender()
  
     }
   else if (intersect.name == "leftControl" || intersect.name == "rightControl" ) {
      plannerConfig.tabletops.forEach(item=>{item.visible = false})
      modelsArray.forEach(item => {
        if (item.tabletop) item.tabletop.visible = true
      })
      this.isDragging = true;
      this.resizableModule.setSettings(intersect, event);
    }
   else if (intersect.name == "menuControl") {
      this.plannerStore.objectMenu = true;
   }
   else if (intersect.name == "copyControl") {
      console.log(plannerConfig.selectedObject)
      this.copyController.moving = true
      this.copyController.run()
    }
  }


  controlsIntersectedL2(){
        const intersectControls = this.raycaster.intersectObjects(plannerConfig.selectedObject.controls, false);

    if (intersectControls.length > 0 ) {
      if (intersectControls[0].object.name == "centerControl") {

        const planeHit =  plannerConfig.selectedObject.side == 'direct'?
         this.raycaster.intersectObject(plannerConfig.directPlane2level)[0]:
         this.raycaster.intersectObject(plannerConfig.leftPlane)[0]

         console.log('planeHit', planeHit)

        if (planeHit) {
          // 2. Вычисляем offset: позиция объекта - точка пересечения
          this.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
          console.log('rootPos', plannerConfig.selectedObject.root.position)
          console.log('planehitPoint', planeHit.point)
          this.moveController2L.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
        }

      this.isMoving = true;
      }
      if (intersectControls[0].object.name == "ungroupCombo") {
      console.log('ungroupCombo')
      this.combinationController.ungroupCombo()
      }
      if (intersectControls[0].object.name == "ungroup") {
      console.log('ungroup')
      plannerConfig.selectedObject.edit = true
      const model = this.loaderModels.get("ПЛВ-400");
      model.visible = true;
      this.scene.add(model)
      plannerConfig.modelToGroup = model
      }
      if(intersectControls[0].object.name == "copyControl"){
        console.log('copy')
       this.copyController.moving = true
       this.copyController.run()
      }
      if (intersectControls[0].object.name == "clone") {
      console.log('clone')
      this.copyController.clone()
   
      }
    }

  }

  moveBack(){
    let side = plannerConfig.selectedObject.side
    let index = plannerConfig.selectedObject.index
    let oldPos = plannerConfig.slotsDirect.find((obj) => obj.index == index)
    let posX, posZ

    if(side == 'direct'){
         if(plannerConfig.moveBack.side == 'right'){
         posX = plannerConfig.moveBack.otherBox.root.position.x - plannerConfig.moveBack.otherBox.width/2
     - plannerConfig.selectedObject.width/2
    }

     if(plannerConfig.moveBack.side == 'left'){
          posX = plannerConfig.moveBack.otherBox.root.position.x + plannerConfig.moveBack.otherBox.width/2
     + plannerConfig.selectedObject.width/2
    }
    }

    if(side == 'left'){
         if(plannerConfig.moveBack.side == 'right'){
         posZ = plannerConfig.moveBack.otherBox.root.position.z + plannerConfig.moveBack.otherBox.width/2
     + plannerConfig.selectedObject.width/2
    }

     if(plannerConfig.moveBack.side == 'left'){
          posZ = plannerConfig.moveBack.otherBox.root.position.z - plannerConfig.moveBack.otherBox.width/2
     - plannerConfig.selectedObject.width/2
    }
    }
 
 
 


 //  console.log('posX', posX)

    gsap.to(plannerConfig.selectedObject.root.position, {
      x: side == 'direct'? posX : 0.3 ,
      z: side == 'left'? posZ: 0.3 ,
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
     //   console.log('moveBack')
        this.movedBack = false
        plannerConfig.moveBack.otherBox = null
      },
    });
  }

  copySettings(){
    console.log(plannerConfig.selectedObject.name)

    if(plannerConfig.selectedObject.name == 'sector'){
      this.copyController.setSector()
    } else {
      this.copyController.set()

    }

    if(this.copyController.setToRow){
      this.copyController.moving = false
      plannerConfig.copyObject = null
      plannerConfig.copyObjectName = ''
      plannerConfig.copyObjectFullName = ''

    } else {
     // this.copyController.moveNearWallsOnly()
    }
    console.log(this.scene)
  }

  handleClickEmpties2L(box){
      while (box && !box.userData.side && box.parent) {
    box = box.parent;
    }
    this.plannerStore.objectMenuL2 = true

    plannerConfig.selectedEmpty2L = box
  }


  onMouseMove = (event) => {


    

  const currentX = event.clientX;

  if (plannerConfig.lastMouseX !== null) {
    if (currentX > plannerConfig.lastMouseX) {
      plannerConfig.movingRight = true;
      plannerConfig.movingDirection = 1
    } else if (currentX < plannerConfig.lastMouseX) {
      plannerConfig.movingRight = false;
      plannerConfig.movingDirection = -1
    }
  }

  plannerConfig.lastMouseX = currentX;



    this.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.moveController.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.copyController.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.moveController2L.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.moveInSector.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

  //  this.showControls()


    // if(plannerConfig.modelToGroup){
    //   this.moveInSector.moveAround()
    // }
   

    //пустые боксы
    if(!this.isMoving && !this.copyController.moving) {
  //    console.log('moving' ,this.isMoving)
   //   console.log('copymoving' ,this.copyController.moving)

      
      this.epmtyBoxesMouseOver2();
      this.epmtyBoxesMouseOver();
    }


    //подсветка пустых в секторе
    // if(plannerConfig.selectedObject.name == 'sector'){
    //   this.epmtySectorOver()
    // }

    if(plannerConfig.isSector && !this.isMoving){
      this.moveInSector.move()
      this.swapController.doSwapInSector()
    }

 

    if (plannerConfig.selectedObject) {
    
      plannerConfig.selectedObject.root.updateMatrixWorld(true, true);
      this.showPointer();
    }
    if (this.isDragging) {
      plannerConfig.selectedObject.root.updateMatrixWorld(true, true);
      this.resizableModule.start(event);
      
    }

    //движение модулей
    if (this.isMoving && !this.isDragging) {
      if(plannerConfig.selectedObject.level == 1){
     //   this.checkMoveBack()
  //   this.moveController.freeMove()
        this.moveController.moveNearWallsOnly();
        this.swapController.doSwap()
      }
      if(plannerConfig.selectedObject.level == 2){
        this.moveController2L.moveNearWallsOnly()
        this.swapController.doSwap()

      }
    }

    if(plannerConfig.copyObject && this.copyController.moving){
    //  console.log(event.clientX)
      this.copyController.moveNearWallsOnly()
    }
    this.sceneSetup.requestRender();
  };


  onMouseDown = (event) => {
    if (event.button !== 0) return; 
     this.plannerStore.sectorReady = false 
     

     

    this.mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.moveController.raycaster.setFromCamera(this.mouse, this.camera);

    //группировка
    if(plannerConfig.ctrlPressed && plannerConfig.selectedObject){
      const intersectsModules = this.raycaster.intersectObjects(plannerConfig.models.map((m) => m.raycasterBox), false );
      this.combinationController.checkCandidate(intersectsModules)
      this.clearSettings()
      return
    }



   //вставка в сектор
   if(plannerConfig.modelToGroup){
    this.emptyManager2L.addToGroup()
   }

    


     // обработка кнопок на модуле
     if (plannerConfig.selectedObject) {
      const intersectControls = this.raycaster.intersectObjects(plannerConfig.selectedObject.controls, false);
   //   console.log('123')


        if (intersectControls.length > 0) {
            // Обрабатываем клик по кнопке
        //    console.log("Нажата кнопка:", intersectControls[0].object.name);
            if(plannerConfig.selectedObject.level == 1){
              this.controlsIntersected(intersectControls[0].object, event);
            }
             if(plannerConfig.selectedObject.level == 2){
              this.controlsIntersectedL2(intersectControls[0].object, event);
            }
            this.controls.enabled = false;

            return;
        }
    }

       this.clearSettings();


  

    const intersectsModules = this.raycaster.intersectObjects(plannerConfig.models.map((m) => m.raycasterBox), false );
    const intersectsEmpties = this.raycaster.intersectObjects(plannerConfig.iconsArray, true);
    plannerConfig.boxesArray.length = 0
    plannerConfig.boxesArray.push(...plannerConfig.boxesArrayDirect, ...plannerConfig.boxesArrayLeft)

    if (intersectsEmpties.length > 0) {
      console.log(intersectsEmpties[0].object)
      this.emptiesIntersetsClick(intersectsEmpties[0].object);
    }

    const intersectsEmpties2L = this.raycaster.intersectObjects(plannerConfig.iconsArray2L,true);


    plannerConfig.boxesArray.length = 0
    plannerConfig.boxesArray.push(...plannerConfig.boxesArrayDirect, ...plannerConfig.boxesArrayLeft)

    if (intersectsEmpties.length > 0  ) {
      this.emptiesIntersetsClick(intersectsEmpties[0].object);
    }

    if (intersectsEmpties2L.length > 0  ) {
      console.log('klick')
      this.handleClickEmpties2L(intersectsEmpties2L[0].object)
    }
 
    if (intersectsModules.length > 0 && !this.copyController.moving ) {

      const id = intersectsModules[0].object.userData.id;
      console.log('id',id)
      const module = plannerConfig.models.find(m => m.id === id);
      
      if(module.level == 1){
        plannerConfig.selectedObject = module;
        this.setSelectObjectSettings(module); 
      }

      if(module.level == 2){
          
        plannerConfig.selectedObject = module;
        console.log(plannerConfig.selectedObject)
      //  this.moveController2L.bounds2level()
        this.setLevel2Setttings()
      }

    }
        this.sceneSetup.requestRender();
  };

  onMouseUp = () => {

  this.tableTop.create() 

  // отключам столешницу у модулей
  if(!this.swapController.swapSelected){
     plannerConfig.modelsDirect.forEach(item => {
      if(item.name =='penal') return
      item.tabletop.visible = false
    }) 
     plannerConfig.modelsLeft.forEach(item => {
       if(item.name =='penal') return
      item.tabletop.visible = false}) // отключам столешницу у модулей

  }
    
     
    // рассчет ограничений
    this.utils.calcCornerModules()

    //движени выбранного после свапа
    if(this.swapController.swapSelected){
       this.swapController.moveSelectedAfterSwap()
    
    }

     //движени выбранного внутри секции после свапа
    if(plannerConfig.selectedObject.name == 'sector' && this.swapController.swapSelectedInSector){
       this.swapController.moveAfterSwapInSectror()
    }
    
   
    this.moveController.penalBounds()
    //пересчёт пустых в секторе
    if(plannerConfig.selectedObject.name == 'sector') this.emptyManager2L.calcEmptyInSector()



    plannerConfig.isSector = false
    plannerConfig.selectedInSector = false

    if(plannerConfig.copyObject){
      console.log('plannerConfig.copyObject')
      this.copySettings()
    }



    
   //пересчёт пустых
   this.emptyManager.calculateEmpties();
  

    if(this.kitchenSizesStore.type == 'left'){
      this.emptyManager.calculateEmptiesLeft()
    }
    this.emptyManager2L.calculateEmpties()

    
    this.swapController.lastSwapCandidate = null;
    this.isMoving = false;
 
    if (plannerConfig.selectedObject ) {
      //    this.container.removeEventListener("mousemove", this.onMouseMove);
      if (!this.swapController.swapSelected) {
        
       // this.swapController.moveAfterSwapInSectror()
      }
      if (this.movedBack) {
      // this.moveBack();
      }
    }
    this.isDragging = false;
  //  this.calculateSlotPositions()
   // this.calculateSlotsNew()
    this.controls.enabled = true;
  };

  showControls(){
    
    
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersectsModules = this.raycaster.intersectObjects(plannerConfig.models.map((m) => m.raycasterBox), false );
    if(intersectsModules.length>0){
     console.log('intersectModule', intersectsModules[0].object)
     if(this.object && intersectsModules[0].object.userData.controller.root.uuid !== this.object.root.uuid){
      this.object.controls.forEach(elem=> elem.visible = false) 
      this.object = intersectsModules[0].object.userData.controller
      this.object.controls.forEach(elem=> elem.visible = true) 


     }
     this.object = intersectsModules[0].object.userData.controller
     this.object.controls.forEach(elem=> elem.visible = true) 
     plannerConfig.selectedObject = this.object
           this.setSelectObjectSettings(this.object)

   } else{
      if(this.object){
        this.object.controls.forEach(elem=> elem.visible = false) 
        this.clearSettings()
      }
   }

   this.sceneSetup.requestRender()

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
             minZ: 0.3,
        maxZ: 0.3,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minX:0.3,
          maxX:0.3,
          minZ:  0, // ограничение движения если левый ряд до угла
          maxZ: plannerConfig.penalsBorders.left,
        };
      }


      //оперделяем какой модуль зашёл в угол
    const leftEdge = plannerConfig.newSlotsLeft[0].center - plannerConfig.newSlotsLeft[0].width/2
    if (leftEdge < 0.59) {
   //   console.log('left yes')
      plannerConfig.isAngleRow = 'left'
       if (plannerConfig.selectedObject.side == "direct") {
        plannerConfig.roomBounds = {
          minX:  0.6 ,
          maxX: plannerConfig.penalsBorders.directRight,
              minZ: 0.3,
        maxZ: 0.3,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minZ:  0, // ограничение движения если левый ряд до угла
          maxZ: plannerConfig.penalsBorders.left,
          minX:0.3,
          maxX:0.3,
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
            minZ: 0.3,
        maxZ: 0.3,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minZ:  0.6, // ограничение движения если левый ряд до угла
          maxZ: plannerConfig.penalsBorders.left,
            minX:0.3,
          maxX:0.3,
        };
      }
    } 
    if(leftEdge >= 0.6 && directEdge >= 0.6){
      plannerConfig.isAngleRow = 'none'
    }
    }

 
   

      
  }




 

  start() {
    // window.addEventListener("start-drag-module", (e) => {
    //  // const module = e.name;
    //   console.log('123efe')
    // });


    plannerConfig.kitchenBounds = {
      minX:0,
      maxX: this.kitchenSizesStore.sideSizes.side_a,
      minZ:0,
      maxZ: this.kitchenSizesStore.sideSizes.side_c,
    }

    //оффсет от пеналов
    this.calculateOffsets();
  //  deletePlane(this.scene);
    plannerConfig.models.length = 0;

    this.kitchenType = this.kitchenSizesStore.type;

    const penalsDirect = plannerConfig.penalsArray.filter(penal=> penal.side == 'direct')
    const penalsLeft = plannerConfig.penalsArray.filter(penal=> penal.side == 'left')
    const penalsRight = plannerConfig.penalsArray.filter(penal=> penal.side == 'right')



  



  
    plannerConfig.models = [...plannerConfig.modelsLeft, ...plannerConfig.modelsDirect ,
       ...plannerConfig.modelsDirect2L, ...plannerConfig.modelsLeft2L];
   

    console.log('models', plannerConfig.models);
    console.log('modelsDirect', plannerConfig.modelsDirect);
    console.log('modelsLeft', plannerConfig.modelsLeft);

    



    this.resizableModule.init(plannerConfig.models);
    const { directPlane, wallPlane, leftPlane, directPlane2level } = createPlanesForRaycaster(); // создание плоскости для raycaster
  //  this.scene.add(directPlane,directPlane2level );
  this.scene.add(leftPlane, directPlane, directPlane2level)
 // this.scene.add(directPlane2level)

    plannerConfig.directPlane1level = directPlane;
    plannerConfig.directPlane2level = directPlane2level;
    plannerConfig.leftPlane = leftPlane;


  //  this.wallPlane = wallPlane;

   // console.log("models", plannerConfig.models);
    this.sceneSetup.requestRender();
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("mousedown", this.onMouseDown);
    this.container.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Control')  plannerConfig.ctrlPressed = false;
    });
  }

  handleKeyDown(event) {
    if (event.key === "Delete") {
      this.deleteSelected();
    }
    if (event.key === "Control") {
      plannerConfig.ctrlPressed = true
      
    }

    if (event.key === "Escape") {
       this.clearSettings()
      plannerConfig.selectedObject = false;
      this.plannerStore.selectedObject.isSelect = false;
      this.copyController.moving = false
      this.removeObjectsByName('copyObject')
      plannerConfig.copyObject = false
      plannerConfig.copyObjectName = false
      plannerConfig.copyObjectSide = false
       plannerConfig.copyObjectFullName = ''
         this.plannerStore.objectMenuL2 = false
     plannerConfig.selectedEmpty2L = false
     

      // this.plannerStore.selectedObject.name = null;
    }
  }



  calculateOffsets() {
    const filtredirectRight = plannerConfig.penalsArray.filter(penal=>penal.side =='directRight')
    
    if(filtredirectRight.length>0){
      const objectWithMinX = filtredirectRight.reduce((min, current) =>
      current.root.position.x < min.root.position.x ? current : min);

      const rightBorder = Number((objectWithMinX.root.position.x - objectWithMinX.objectSize.x/2).toFixed(3))
      plannerConfig.penalsBorders.directRight = rightBorder
    } else {
      plannerConfig.penalsBorders.directRight = this.kitchenSizesStore.sideSizes.side_a
    }
  

    const filtredirectLeft = plannerConfig.penalsArray.filter(penal=>penal.side =='directLeft')
    if(filtredirectLeft.length>0){
      const objectWithMaxX = filtredirectLeft.reduce((min, current) =>
      current.root.position.x > min.root.position.x ? current : min);

      const leftBorder = Number((objectWithMaxX.root.position.x + objectWithMaxX.objectSize.x/2).toFixed(3))
      plannerConfig.penalsBorders.directLeft = leftBorder
    } else {
      plannerConfig.penalsBorders.directLeft = 0
    }

     const filtredLeft = plannerConfig.penalsArray.filter(penal=>penal.side =='left')
    if(filtredLeft.length>0){
      const objectWithMaxZ = filtredLeft.reduce((min, current) =>
      current.root.position.z < min.root.position.z ? current : min);

      const leftBorder = Number((objectWithMaxZ.root.position.z - objectWithMaxZ.objectSize.x/2).toFixed(3))
      plannerConfig.penalsBorders.left = leftBorder
    } else {
      plannerConfig.penalsBorders.left = this.kitchenSizesStore.sideSizes.side_c
    }
        
   // console.log('plannerConfig', plannerConfig)
   // this.moveController.bounds1level()
  }

  roomBoundsCalculate() {
    // диапазон движений модулей

    if(this.kitchenSizesStore.type =='direct'){
      plannerConfig.roomBounds = {
      minX:  0 + plannerConfig.penalsBorders.directLeft,
      maxX: plannerConfig.penalsBorders.directRight,
      minZ:  0.3,
      maxZ: 0.3 ,
      };
    }

    if(this.kitchenSizesStore.type == 'left'){
      if(plannerConfig.selectedObject.side =='direct'){
        plannerConfig.roomBounds = {
          minX: plannerConfig.isAngleRow == 'left'? 0.6: 0, // ограничение движения если левый ряд до угла
          maxX: plannerConfig.penalsBorders.directRight,
        };
      }
       if(plannerConfig.selectedObject.side =='left'){
        plannerConfig.roomBounds = {
          minZ: plannerConfig.isAngleRow == 'direct'? 0.6: 0, // ограничение движения если левый ряд до угла
          maxZ: plannerConfig.penalsBorders.left,
        };
      }
    }

    // this.roomBounds = {
    //   minX: this.kitchenSizesStore.type == "left" ? 0 : 0 + plannerConfig.penalsBorders.directLeft,
    //   maxX: plannerConfig.penalsBorders.directRight,
    //   minZ: this.kitchenSizesStore.type == "left" ? 1 : 0,
    //   maxZ: plannerConfig.penalsBorders.left ,
    // };

    // if (this.kitchenSizesStore.sink.side == "right") {
    //   this.roomBounds = {
    //     minX: this.kitchenSizesStore.type == "left" ? 0.6 : 0,
    //     maxX:  plannerConfig.penalsBorders.directRight,
    //     minZ: this.kitchenSizesStore.type == "left" ? 1 : 0,
    //     maxZ: plannerConfig.penalsBorders.left,
    //   };
    // }
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
