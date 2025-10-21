import * as THREE from "three";
import { ModelInstanse } from "./ModelInstanse";
import { modelsList } from "./utils/modelsList";

import { usePlannerStore } from "../../../pinia/PlannerStore";

import { namesToDelete } from "./utils/namesToDelete";
import { plannerConfig } from "./planerConfig";

export class ResizableModule {
  constructor(scene, plannerManager, loaderModels) {
    this.scene = scene;
    this.plannerManager = plannerManager;
    this.selectedObject = plannerConfig.selectedObject;
    this.loaderModels = loaderModels;
    this.plannerStore = usePlannerStore();

    //доступные ширины для выбранной модели
    this.allowedWidths = null;
    //индес в массиве ширин текущего объекта
    this.currentIndex = null;
    //изменение размера
    this.dragging = false;
    //позиция перед началом изменения размера
    this.startX = 0;
    this.startZ = 0;

    //выбранный controls у модели
    this.selectedControls = false;
  }

  setSettings(intersectObject, event) {
    this.selectedControls = intersectObject;

    this.startX = event.clientX;
    this.startZ = event.clientZ;
    console.log("event", event);
    // console.log('startZ', this.startZ)
    // console.log('eventZ', event.clientZ)

   // console.log("selectedControls", this.selectedControls);
  }

  set() {
  //  console.log(plannerConfig.selectedObject.name);
    this.allowedWidths = modelsList[plannerConfig.selectedObject.name];
    this.currentIndex = this.allowedWidths.indexOf(
      Number(plannerConfig.selectedObject.objectSize.x.toFixed(2))
    );

   // console.log(this.allowedWidths);
   // console.log(this.allowedWidths);
  }

  init(models) {
    //массив для кнопок модели для raycaster
    // this.modelControls = plannerConfig.models.flatMap((m) =>
    //   [m.leftControl, m.rightControl].filter(Boolean)
    // );
   // console.log("controls", this.modelControls);
  }

  start(event) {
    const deltaX = event.clientX - this.startX;
    const deltaZ = event.clientZ - this.startZ;

    const threshold = 10; // пикселей на шаг
   // console.log(deltaX);
   // console.log("deltaZ", deltaZ);

    const typeControl = this.selectedControls.name;
    if (Math.abs(deltaX) >= threshold) {
      let direction;
      if (typeControl == "rightControl") {
        direction = deltaX > 0 ? 1 : -1;
      } else {
        direction = deltaX > 0 ? -1 : 1;
      }

      this.tryChangeWidth(direction);
   //   console.log("direction", direction);
      this.startX = event.clientX; // сброс, чтобы не прыгало сразу много шагов
    }
  }

  loadModule() {
    const side = plannerConfig.sideOfSelected;

  //  console.log("sideOfResize", side);

    this.plannerStore.hasCollision = false;
  //  console.log(plannerConfig.selectedObject);
    const type = plannerConfig.selectedObject.name;
    const typeControl = this.selectedControls.name;
    const oldindex = plannerConfig.selectedObject.slot;
    const oldside = plannerConfig.selectedObject.side;
    const oldLevel = plannerConfig.selectedObject.level
    const oldId = plannerConfig.selectedObject.id

   // console.log(oldindex);

    let oldX, oldZ;
    if (typeControl == "rightControl") {
      oldX =
        plannerConfig.selectedObject.root.position.x -
        plannerConfig.selectedObject.objectSize.x / 2;
    } else {
      oldX =
        plannerConfig.selectedObject.root.position.x +
        plannerConfig.selectedObject.objectSize.x / 2;
    }

    if (side == "left") {
      if (typeControl == "rightControl") {
        oldZ =
          plannerConfig.selectedObject.root.position.z +
          plannerConfig.selectedObject.objectSize.x / 2;
      } else {
        oldZ =
          plannerConfig.selectedObject.root.position.z -
          plannerConfig.selectedObject.objectSize.x / 2;
      }
    }

    const width = this.allowedWidths[this.currentIndex];
   // console.log("width", width);

    let name;
    if (type === "m") {
      name = `ms${width * 1000}`;
    } else if (type === "p") {
      name = `dw-${width * 1000}`;
    } else if (type === "d") {
      name = `i-oven-${width * 1000}`;
    } else {
      name = `${type}-${width * 1000}`;
    }

   // console.log(name);

    const model = this.loaderModels.get(name);
    if (!model) {
    //  console.log("нет модели");
      return;
    }




    let nameToDelete

    model.visible = true;
    model.updateMatrixWorld(true, true);

    if(side == 'left') nameToDelete = name + 'left'
    if(side == 'direct') nameToDelete = name + 'direct'



   
  
    model.name = nameToDelete;
    side == 'left'?   plannerConfig.namesToDeleteLeft.push(nameToDelete) :   plannerConfig.namesToDeleteDirect.push(nameToDelete)



    //Создаём временный экземпляр для проверки
    const testInstance = new ModelInstanse(model.clone());
    testInstance.name = type;
    testInstance.slot = oldindex;

    testInstance.root.rotation.y = side == "direct" ? -Math.PI / 2 : 0;

    if (side == "direct") {
      if (typeControl == "rightControl") {
        testInstance.root.position.set(oldX + width / 2, 0, 0.3);
      } else {
        testInstance.root.position.set(oldX - width / 2, 0, 0.3);
      }
    }

    if (side == "left") {
      if (typeControl == "rightControl") {
        testInstance.root.position.set(0.3, 0, oldZ - width / 2);
      } else {
        testInstance.root.position.set(0.3, 0, oldZ + width / 2);
      }
    }

    // Удаляем временно текущий объект из моделей, чтобы он не мешал проверке
    const current = plannerConfig.selectedObject;

    let indexInModels

    if(side == 'direct'){
       indexInModels = plannerConfig.modelsDirect.indexOf(current);
       if (indexInModels !== -1) {
      plannerConfig.modelsDirect.splice(indexInModels, 1);
    }
    }

    if(side == 'left'){
       indexInModels = plannerConfig.modelsLeft.indexOf(current);
       if (indexInModels !== -1) {
      plannerConfig.modelsLeft.splice(indexInModels, 1);
    }
    }

     
   

    const hasCollision = this.plannerManager.checkSimpleCollision(testInstance);

    // Возвращаем назад, если коллизия
    if (side == 'direct' && indexInModels !== -1) {
      plannerConfig.modelsDirect.splice(indexInModels, 0, current);
    }

     if (side == 'left' && indexInModels !== -1) {
      plannerConfig.modelsLeft.splice(indexInModels, 0, current);
    }


    if (hasCollision) {
      console.log(
        "Ошибка: модуль не помещается. Выберите другой или освободите место."
      );
      this.plannerStore.showError();

      return;
    }

    // Теперь можно удалять старый
    this.plannerManager.deleteSelected();

    const instance = new ModelInstanse(model);
    instance.name = type;
    instance.slot = oldindex;
    instance.side = oldside;
    instance.fullname = name
    instance.level = oldLevel
    instance.id = oldId
    instance.raycasterBox.userData.id= oldId

    model.rotation.y = side == "direct" ? 0 :Math.PI / 2;

    if (side == "direct") {
      if (typeControl == "rightControl") {
        model.position.set(oldX + width / 2, 0, 0.3);
      } else {
        model.position.set(oldX - width / 2, 0, 0.3);
      }
    }

    if (side == "left") {
      if (typeControl == "rightControl") {
        model.position.set(0.3, 0, oldZ - width / 2);
      } else {
        model.position.set(0.3, 0, oldZ + width / 2);
      }
    }

    this.scene.add(model);
    plannerConfig.selectedObject = instance;

    // objectControls.push(instance.rightControl);
    // objectControls.push(instance.leftControl);
    // objectControls.push(instance.centerControl);

    instance.centerControl.visible = true;
    instance.leftControl.visible = true;
    instance.rightControl.visible = true;
    instance.menuControl.visible = true;


    plannerConfig.models.push(instance);

    if (side == "direct") {
      plannerConfig.modelsDirect.push(instance);
    }

    if (side == "left") {
      plannerConfig.modelsLeft.push(instance);
    }

    this.plannerManager.calculateSlotPositions();
  }

  tryChangeWidth(direction) {
    const newIndex = THREE.MathUtils.clamp(
      this.currentIndex + direction,
      0,
      this.allowedWidths.length - 1
    );
    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
      this.loadModule();
    }
  }
}
