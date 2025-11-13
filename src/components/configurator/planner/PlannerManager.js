import * as THREE from "three";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useMouseStore } from "../../../pinia/mouseStore";

import { usePenalStore } from "../../../pinia/penals";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { createPlanesForRaycaster } from "./utils/planes";
import { RotationController } from "./RotationController";
import { CopyController } from "./CopyController";


import { ResizableModule } from "./ResizableModule";
import { plannerConfig } from "./planerConfig";

import { EmptyManager } from "./EmptyManager";
import { MoveController } from "./MoveController";
import { MoveController2L } from "./MoveController2L";
import { ChangeController } from "./ChangeController";
import { SwapController } from "./SwapController";


import { TableTop } from "../builders/Algorithm/TableTop";
import { EmptyManager2L } from "./EmptyManager2L";
import { CombinationController } from "./CombinationController";
import { MoveInSector } from "./Move_In_Sector";
import { UtilsManager } from "./UtilsManager";
import { MenuController } from "./MenuController";
import { MouseMove } from "./MouseMovie";

export class PlannerManager {
  constructor(scene, loaderModels) {
    this.sceneSetup = scene;
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
    this.plannerStore = usePlannerStore();
    this.mouseStore = useMouseStore();
    this.container = scene.container;
    this.scene = scene.scene;
    this.loaderModels = loaderModels;
    this.camera = scene.camera;
    this.controls = scene.controls;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.count = 0;

    this.hoveredObject = null;
    this.hoveredObject1level = null;
    this.directPlane = null;
    this.wallPlane = null;

    this.isMoving = false;
    this.isDragging = false;
    this.movedBack = false;

    this.resizableModule = new ResizableModule(
      this.sceneSetup,
     
      this.loaderModels
    );
    this.isMoving = false;

    //габариты объекта
    this.objectSize = new THREE.Vector3();

    this.box = null;
    //офсет для передвижения без рывка
    this.offset = new THREE.Vector3();

    this.tableTop = new TableTop(this.sceneSetup, this.loaderModels);
    this.rotationController = new RotationController(this.sceneSetup);
    this.emptyManager = new EmptyManager(this.sceneSetup, this.loaderModels);
    this.moveController = new MoveController(this.sceneSetup);
    this.moveController2L = new MoveController2L(this.sceneSetup);
    this.changeController = new ChangeController( this.sceneSetup,    this.loaderModels,    this.emptyManager  );
    this.copyController = new CopyController(  this.sceneSetup,   this.loaderModels );
    this.emptyManager2L = new EmptyManager2L(  this.sceneSetup,   this.loaderModels  );
    this.combinationController = new CombinationController(this.sceneSetup);
    this.swapController = new SwapController(this.sceneSetup);
    this.moveInSector = new MoveInSector(this.sceneSetup);
    this.utils = new UtilsManager(this.sceneSetup, this.loaderModels);
    this.menuController = new MenuController(  this.sceneSetup,   this.loaderModels  );
    this.mouseMove = new MouseMove(this.sceneSetup)

    this.roomBounds = null;
  }

  rotation(rotate) {
    this.rotationController.rotateSelected(
      plannerConfig.selectedObject,
      rotate
    );
    this.sceneSetup.requestRender();
  }

  createTableTop(){    
        this.tableTop.create();

          if (!this.swapController.swapSelected) {
      plannerConfig.modelsDirect.forEach((item) => {
        if (['penal', 'fridge'].includes(item.name)) return;
          if(item.tabletop){
            item.tabletop.visible = false;
           }
        });
      plannerConfig.modelsLeft.forEach((item) => {
        if (['penal', 'fridge'].includes(item.name)) return;
          if(item.tabletop){
            item.tabletop.visible = false;
          }
      }); // отключам столешницу у модулей
    }
  }

  // если выбран модуль  меняем размер или пустой бокс добавляем модуль
  addModule(type, width, penal) {
    if (plannerConfig.selectedObject.level == 1) {
      console.log("changeSelected");
      this.changeController.changeSelected(type, width);
      this.emptyManager.calculateEmpties();
      this.createTableTop()
      this.sceneSetup.requestRender();
      
    } else if (plannerConfig.selectedEmpty) {
      console.log("addToEmpty");

      this.emptyManager.addToEmpty(type, width, penal);
      this.emptyManager.calculateEmpties();
      this.createTableTop()

   
    
      this.sceneSetup.requestRender();
    } else if (plannerConfig.selectedEmpty2L.name) {
      console.log("addToEmpty2");

      this.emptyManager2L.addToEmpty(type, width);
    } else if (plannerConfig.selectedEmptyInSector) {
      console.log("addToEmptySector");

      this.emptyManager2L.addToGroup(type, width);
    }
  }




  createArrays(){
      //создание массива для проверки коллизии
    plannerConfig.arraysToCheck.length = 0;
    const side = plannerConfig.selectedObject.side;
    const level = plannerConfig.selectedObject.level;

    //создание массивов для проверки
    if (side === "direct") plannerConfig.arraySwap = plannerConfig.modelsDirect;
    if (side === "left") plannerConfig.arraySwap = plannerConfig.modelsLeft;
    if (side === "right") plannerConfig.arraySwap = plannerConfig.modelsRight;

    //рассчет ограничений движения для модуля
    this.utils.roomBounds();

    if (this.kitchenSizesStore.type == "left") {
      if (level === 1) {
        if (side == "direct") {
          plannerConfig.arraysToCheck.push(...plannerConfig.modelsLeft);
        }
        if (side == "left") {
          plannerConfig.arraysToCheck.push(...plannerConfig.modelsDirect);
        }
      }
    }

    const isPenal = plannerConfig.selectedObject.name === "penal";

    if (isPenal) {
      plannerConfig.arraysToCheck.push(...plannerConfig.models);
    } else {
      plannerConfig.arraysToCheck.push(...plannerConfig.penalsArray);
    }
  }



    
  


  setSelectObjectSettings(controller) {
    console.log(plannerConfig.selectedObject);


    this.plannerStore.selectedType = plannerConfig.selectedObject.name
    this.plannerStore.selectedWidth = Number(plannerConfig.selectedObject.width.toFixed(1))
    this.createArrays()
   

  

    this.plannerStore.selectedObject.isSelect = true;
    this.plannerStore.selectedObject.name = controller.root.name;

    //невидимость для кнопок
    plannerConfig.selectedObject.controls.forEach((model) => { model.visible = true;});

    plannerConfig.selectedObject.boxHelper.visible = true;

   

    const intersectControls = this.raycaster.intersectObjects(plannerConfig.selectedObject.controls, false);

    if (intersectControls.length > 0 ) {
     this.controlsIntersected(intersectControls[0].object, event);
    }

    // //массив доступной ширины текущего объекта
    this.resizableModule.set();
  }

  setLevel2Setttings() {
    plannerConfig.arraysToCheck.length = 0;
    const side = plannerConfig.selectedObject.side;
    const level = plannerConfig.selectedObject.level;

    //содание массивов для проверки

    plannerConfig.modelsDirect2L.sort((a,b) => a.root.position.x - b.root.position.x)
    plannerConfig.modelsLeft2L.sort((a,b) => a.root.position.z - b.root.position.z)
    plannerConfig.modelsRight2L.sort((a,b) => a.root.position.z - b.root.position.z)

    if (side === "direct")plannerConfig.arraySwap = plannerConfig.modelsDirect2L;
    if (side === "left") plannerConfig.arraySwap = plannerConfig.modelsLeft2L;
    if (side === "right") plannerConfig.arraySwap = plannerConfig.modelsRight2L;




    this.utils.roomBounds();

    //  this.controls.enabled = false

    plannerConfig.selectedObject.controls.forEach((model) => {
      model.visible = true;
    });

    const planeHit = this.raycaster.intersectObject(
      plannerConfig.directPlane2level
    )[0];

    plannerConfig.selectedObject.boxHelper.visible = true;
    if (planeHit) {
      // 2. Вычисляем offset: позиция объекта - точка пересечения
      this.offset
        .copy(plannerConfig.selectedObject.root.position)
        .sub(planeHit.point);
      this.moveController2L.offset
        .copy(plannerConfig.selectedObject.root.position)
        .sub(planeHit.point);
    }

   


    const objectSize = new THREE.Vector3();
    const box = new THREE.Box3().setFromObject(
      plannerConfig.selectedObject.raycasterBox
    );
    box.getSize(objectSize);
    plannerConfig.copyObjectSize = objectSize;

    plannerConfig.setFromObject = new THREE.Box3().setFromObject(
      plannerConfig.selectedObject.root
    );

    if (plannerConfig.selectedObject.name == "sector") {
      this.plannerStore.sectorWidth = plannerConfig.selectedObject.width;
      this.plannerStore.sectorReady = plannerConfig.selectedObject.ready;

      plannerConfig.selectedSector = plannerConfig.selectedObject;

      this.emptyManager2L.calcEmptyInSector();

      const intersectsModules = this.raycaster.intersectObjects( plannerConfig.selectedObject.modules.map((m) => m.raycasterBox),  false  );
      const intersectsEmpties = this.raycaster.intersectObjects( plannerConfig.selectedObject.empties, true );

  

      //пустые в секторе
      if (intersectsEmpties.length > 0) {
      //  console.log("empty");

        let empty = intersectsEmpties[0].object;

    

     

        plannerConfig.selectedEmptyInSector = empty;

        this.plannerStore.empty2levelHeight = empty.userData.height

        const box = new THREE.Box3().setFromObject(
          plannerConfig.selectedEmptyInSector
        );



        plannerConfig.selectedEmptyInSectorMinY = box.min.y;

        plannerConfig.selectedEmptyInSectorWorldPos =
          plannerConfig.selectedEmptyInSector.getWorldPosition(
            new THREE.Vector3()
          );

        this.plannerStore.sectorMenu = true;
      }

      //выделенный модуль в секторе
      if (intersectsModules.length > 0) {
        this.controls.enabled = false;

        const id = intersectsModules[0].object.userData.id;
        const model = plannerConfig.selectedObject.modules.find(
          (m) => m.id == id
        );
         console.log('модуль', model)
 
        plannerConfig.selectedInSector = model;

        const intersectsControls = this.raycaster.intersectObjects(
        plannerConfig.selectedInSector.controls,
        true );

       


        this.moveInSector.set(intersectsModules[0])

         if (intersectsControls.length > 0) {
          console.log(intersectsControls[0])
          this.moveInSector.isMoving = true
        }


       
      }
    }
  }

  emptiesIntersetsClick(intersect) {
    this.plannerStore.objectMenu = true;
    plannerConfig.selectedEmpty = intersect;
  }

 
  hideTableTops(){

  }

  controlsIntersected(intersect, event) {
    const side = plannerConfig.selectedObject.side;
    const rules = {
      direct: {
        array: "modelsDirect",
      },
      left: {
        array: "modelsLeft",
      },
      right: {
        array: "modelsRight",
      },
    };

    const rule = rules[side];

 

    const modelsArray = plannerConfig[rule.array];

 
    if (intersect.name == "centerControl") {
      // свиг чтобы не было рывка
      const planeHit = this.raycaster.intersectObject(  plannerConfig.directPlane1level )[0];
      if (planeHit) {
     
        this.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
  
        this.moveController.offset.copy(plannerConfig.selectedObject.root.position).sub(planeHit.point);
      }
      this.isMoving = true;
      this.plannerStore.movingModule = true

      if (plannerConfig.selectedObject.side == "direct") {
        plannerConfig.tabletops.forEach((item) => {
          item.visible = false;
        });
        plannerConfig.modelsDirect.forEach((item) => {
          if (['penal', 'fridge'].includes(item.name)) return;
          item.tabletop.visible = true;
        });
      } else if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.tabletopsLeft.forEach((item) => {
          item.visible = false;
        });
        plannerConfig.modelsLeft.forEach((item) => {
          if (['penal', 'fridge'].includes(item.name)) return;
          item.tabletop.visible = true;
        });
      }
      this.sceneSetup.requestRender();

    } else if ( intersect.name == "leftControl" ||  intersect.name == "rightControl" ) {
      plannerConfig.tabletops.forEach((item) => {
        item.visible = false;
      });
      modelsArray.forEach((item) => {
        if (item.tabletop) item.tabletop.visible = true;
      });
      this.isDragging = true;
      this.resizableModule.setSettings(intersect, event);
    } else if (intersect.name == "menuControl") {
      this.plannerStore.changeMenu = true;
    } else if (intersect.name == "copyControl") {
  //    console.log(plannerConfig.selectedObject);
      this.copyController.moving = true;
      this.copyController.run();
    }
  }

  controlsIntersectedL2() {
    const intersectControls = this.raycaster.intersectObjects(
      plannerConfig.selectedObject.controls,
      false
    );

    if (intersectControls.length > 0) {
      if (intersectControls[0].object.name == "centerControl") {
        const planeHit =
          plannerConfig.selectedObject.side == "direct"
            ? this.raycaster.intersectObject(plannerConfig.directPlane2level)[0]
            : this.raycaster.intersectObject(plannerConfig.leftPlane)[0];

  //      console.log("planeHit", planeHit);

        if (planeHit) {
          // 2. Вычисляем offset: позиция объекта - точка пересечения
          this.offset
            .copy(plannerConfig.selectedObject.root.position)
            .sub(planeHit.point);
      //    console.log("rootPos", plannerConfig.selectedObject.root.position);
      //    console.log("planehitPoint", planeHit.point);
          this.moveController2L.offset
            .copy(plannerConfig.selectedObject.root.position)
            .sub(planeHit.point);
        }

        this.isMoving = true;
        this.plannerStore.movingModule = true
      }
      if (intersectControls[0].object.name == "ungroupCombo") {
    //    console.log("ungroupCombo");
        this.combinationController.ungroupCombo();
      }
      if (intersectControls[0].object.name == "ungroup") {
  //      console.log("ungroup");
        plannerConfig.selectedObject.edit = true;
        const model = this.loaderModels.get("ПЛВ-400");
        model.visible = true;
        this.scene.add(model);
        plannerConfig.modelToGroup = model;
      }
      if (intersectControls[0].object.name == "copyControl") {
    //    console.log("copy");
        this.copyController.moving = true;
        this.copyController.run();
      }
      if (intersectControls[0].object.name == "clone") {
   //     console.log("clone");
        this.copyController.clone();
      }
    }
  }




  handleClickEmpties2L(box) {

    this.plannerStore.objectMenuL2 = true; // включаем меню

    plannerConfig.selectedEmpty2L = box;
  
  }

  //синхронизация с частотой requestAnimationFrame
  mouseSync = (event) => {
    if (this.sceneSetup.needMouseEvent) {
      this.mouseStore.updateMousePosition(event.clientX, event.clientY);
      this.mouse.set(this.mouseStore.normalizedX , this.mouseStore.normalizedY )
      this.onMouseMove();
    }
    this.sceneSetup.needMouseEvent = false;
  };



  setMouse(event){
        this.mouse.set( (event.clientX / window.innerWidth) * 2 - 1,  -(event.clientY / window.innerHeight) * 2 + 1 );
    this.plannerStore.emptyPosition.x = event.clientX + 50;
    this.plannerStore.emptyPosition.y = event.clientY - 100;

  }

  onMouseMove() {

    

    this.mouseMove.showControls()


    //пустые боксы
    if (!this.isMoving && !this.copyController.moving) {
    
 
      this.mouseMove.epmtyBoxesOver2()
      this.mouseMove.epmtyBoxesOver()


      if(plannerConfig.selectedObject.name === 'sector'){
    
        this.mouseMove.boxesInSectorOver()
      }

    
    }

    if ( this.moveInSector.isMoving && !this.isMoving) {
      this.moveInSector.move();
      this.swapController.doSwap2();
    }

    if (plannerConfig.selectedObject) {
      plannerConfig.selectedObject.root.updateMatrixWorld(true, true);
       this.mouseMove.showPointer();
    }
    if (this.isDragging) {
      plannerConfig.selectedObject.root.updateMatrixWorld(true, true);
      this.resizableModule.start(event);
    }

    //движение модулей
    if (this.isMoving && !this.isDragging) {
      this.plannerStore.controls.show = false
      if (plannerConfig.selectedObject.level == 1) {
  

        this.moveController.moveNearWallsOnly();
        this.swapController.doSwap();
      }
      if (plannerConfig.selectedObject.level == 2) {
        this.moveController2L.moveNearWallsOnly();
        this.swapController.doSwap();
      }
    }

    if (plannerConfig.copyObject && this.copyController.moving) {
      //  console.log(event.clientX)
      this.copyController.moveNearWallsOnly();
    }
    this.sceneSetup.requestRender();
  }

  onMouseDown = (event) => {
    if (event.button !== 0) return;
    this.plannerStore.sectorReady = false;

    this.setMouse(event)


    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.moveController.raycaster.setFromCamera(this.mouse, this.camera);

 

    //вставка в сектор
    if (plannerConfig.modelToGroup) {
      this.emptyManager2L.addToGroup();
    }

    // обработка кнопок на модуле
  


    this.utils.clearSettings();

    const intersectsModules = this.raycaster.intersectObjects( plannerConfig.models.map((m) => m.raycasterBox),  false );
    const intersectsEmpties = this.raycaster.intersectObjects(plannerConfig.empties1level, false  );


    if (intersectsEmpties.length > 0) {
     console.log(intersectsEmpties[0].object);
     this.emptiesIntersetsClick(intersectsEmpties[0].object);
    }

    const intersectsEmpties2L = this.raycaster.intersectObjects( plannerConfig.empties2level,  false );



    if (intersectsEmpties.length > 0) {
      this.emptiesIntersetsClick(intersectsEmpties[0].object);
    }

    if (intersectsEmpties2L.length > 0) {
 
      this.handleClickEmpties2L(intersectsEmpties2L[0].object);
    }

    if (intersectsModules.length > 0 && !this.copyController.moving) {
      const id = intersectsModules[0].object.userData.id;
      console.log("id", id);
      const module = plannerConfig.models.find((m) => m.id === id);
      console.log('module', module)

      if (module.level == 1) {
        plannerConfig.selectedObject = module;
        this.setSelectObjectSettings(module);
      }

      if (module.level == 2) {
        plannerConfig.selectedObject = module;
        console.log(plannerConfig.selectedObject);
     
        this.setLevel2Setttings();
      }



       const intersectControls = this.raycaster.intersectObjects(
        plannerConfig.selectedObject.controls,
        false
      );
      //   console.log('123')

      if (intersectControls.length > 0) {
        // Обрабатываем клик по кнопке
        //    console.log("Нажата кнопка:", intersectControls[0].object.name);
        if (plannerConfig.selectedObject.level == 1) {
          this.controlsIntersected(intersectControls[0].object, event);
        }
        if (plannerConfig.selectedObject.level == 2) {
          this.controlsIntersectedL2(intersectControls[0].object, event);
        }
        this.controls.enabled = false;

        
      }
    




    }
    this.sceneSetup.requestRender();
  };

  onMouseUp = () => {
    this.tableTop.create();

    // отключам столешницу у модулей
    if (!this.swapController.swapSelected) {
      plannerConfig.modelsDirect.forEach((item) => {
        if (['penal', 'fridge'].includes(item.name)) return;
          if(item.tabletop){
            item.tabletop.visible = false;
           }
        });
      plannerConfig.modelsLeft.forEach((item) => {
        if (['penal', 'fridge'].includes(item.name)) return;
          if(item.tabletop){
            item.tabletop.visible = false;
          }
      }); // отключам столешницу у модулей
    }

    // рассчет какой модуль занмает угол
    this.utils.calcCornerModules();
    this.utils.calcCornerModules2L();

    //движени выбранного после свапа
    //    this.swapController.layoutBoxes(true, true )

    //движени выбранного внутри секции после свапа
    if (
      plannerConfig.selectedObject.name == "sector" &&
      this.swapController.swapSelectedInSector
    ) {
 //     this.swapController.moveAfterSwapInSectror();
    }

    // this.moveController.penalBounds()
    //пересчёт пустых в секторе
    if (plannerConfig.selectedObject.name == "sector")
      this.emptyManager2L.calcEmptyInSector();

    this.moveInSector.isMoving = false;
    

    if (plannerConfig.copyObject) {
   //   console.log("plannerConfig.copyObject");
      this.copyController.copySettings();
    }

    //пересчёт пустых промежутков
    this.emptyManager.calculateEmpties();
    this.emptyManager2L.calculateEmpties();

    this.swapController.lastSwapCandidate = null;
    this.isMoving = false;
    this.plannerStore.movingModule = false

    if (plannerConfig.selectedObject) {
      if (!this.swapController.swapSelected && plannerConfig.isCollision) {
        console.log("move back Selected false");
        this.swapController.moveBack(false);
      }
      if (this.swapController.swapSelected ) {
        console.log("move back Selected true");

         this.swapController.moveBack(true);
      }
    }

    if(plannerConfig.selectedInSector){
      if (!this.swapController.swapSelectedInSector && plannerConfig.isCollisionInSector) {
        console.log("move back inSector false");
        this.swapController.moveBackInSector(false);
      }
      if (this.swapController.swapSelectedInSector ) {
        console.log("move back inSector true");

         this.swapController.moveBackInSector(true);
      }
    }



    this.isDragging = false;
    //  this.calculateSlotPositions()
    // this.calculateSlotsNew()
    this.controls.enabled = true;
  };


  createRaycasterPlanes() {
    this.resizableModule.init(plannerConfig.models);
    const { directPlane, wallPlane, leftPlane, directPlane2level } =
      createPlanesForRaycaster(); // создание плоскости для raycaster

    this.scene.add(leftPlane, directPlane, directPlane2level);

    plannerConfig.directPlane1level = directPlane;
    plannerConfig.directPlane2level = directPlane2level;
    plannerConfig.leftPlane = leftPlane;
  }

  createModelsArray() {
    plannerConfig.models.length = 0;

    plannerConfig.models = [
      ...plannerConfig.modelsLeft,
      ...plannerConfig.modelsDirect,
      ...plannerConfig.modelsDirect2L,
      ...plannerConfig.modelsLeft2L,
    ];
  }

  start() {
    this.createModelsArray();
    this.createRaycasterPlanes();
    this.utils.calcCornerModules();
    this.utils.calcCornerModules2L();
    //   this.utils.roomBoundsPenal()
  //  this.utils.shadow()


    // this.scene.traverse(o => {
    //   if (o.castShadow) console.log('Отбрасывает тень:', o.name || o)
    // })






    this.sceneSetup.requestRender();
    this.container.addEventListener("mousemove", this.mouseSync);
    this.container.addEventListener("mousedown", this.onMouseDown);
    this.container.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", (e) => {
      if (e.key === "Control") plannerConfig.ctrlPressed = false;
    });
  }

  handleKeyDown(event) {
    if (event.key === "Delete") {
      this.utils.deleteSelected();
      this.emptyManager.calculateEmpties();
      this.tableTop.create();
      this.emptyManager2L.calculateEmpties();
    }
    if (event.key === "Control") {
      plannerConfig.ctrlPressed = true;
    }

    if (event.key === "Escape") {
      this.utils.clearSettings();
      plannerConfig.selectedObject = false;
      this.plannerStore.selectedObject.isSelect = false;
      this.copyController.moving = false;
      this.utils.removeObjectsByName("copyObject");
      plannerConfig.copyObject = false;
      plannerConfig.copyObjectName = false;
      plannerConfig.copyObjectSide = false;
      plannerConfig.copyObjectFullName = "";
      this.plannerStore.objectMenuL2 = false;
      this.plannerStore.changeMenu = false;
      this.plannerStore.sectorMenu = false

      plannerConfig.selectedEmpty2L = false;
      this.plannerStore.selectedType = null
      this.plannerStore.selectedWidth =null

      // this.plannerStore.selectedObject.name = null;
    }
  }
}
