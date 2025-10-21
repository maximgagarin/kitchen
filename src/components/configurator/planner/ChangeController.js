import { plannerConfig } from "./planerConfig";
import { algorithmConfig } from "../builders/Algorithm/algorithmConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { usePenalStore } from "../../../pinia/penals";
import { ModelInstanse } from "./ModelInstanse";


export class ChangeController{
    constructor(sceneSetup, loaderModels, emptyManager){
        this.sceneSetup = sceneSetup
        this.scene = sceneSetup.scene
        this.loaderModels = loaderModels
        this.kitchenSizesStore = useKitchenSizesStore()
        this.penalStore = usePenalStore()
        this.plannerStore = usePlannerStore()
        this.emptyManager = emptyManager
    }

     changeSelected(type, width) {
    
        this.calculateSlotsNew()
    
        const side = plannerConfig.selectedObject.side;
    
        
        let isLeft = plannerConfig.sideOfSelected === "left";
        let oldInstance = plannerConfig.selectedObject;
        oldInstance.root.updateMatrixWorld(true, true);
        let position = oldInstance.root.position.clone();
      //  console.log(position);
        let oldindex = oldInstance.index;
        let oldside = oldInstance.side;

        const oldId = oldInstance.id
     
    
    
        if(isLeft){
          const index = plannerConfig.newSlotsLeft.findIndex(item => item.index == oldindex);
          position.z = this.getCenterPositionLeft(index)
        //  console.log('posZ', position.z)
        }else {
          const index = plannerConfig.newSlotsDirect.findIndex(item => item.index == oldindex);
          position.x = this.getCenterPositionDirect(index)
        //  console.log(position.x)
        }
    
        const cabinetName = `${type}-${width * 1000}`;
        const cabinetOriginal = this.loaderModels.get(cabinetName);
    
        if (!cabinetOriginal) {
          alert("Модель не найдена");
          return;
        }
    
        // Временная копия для проверки
        const cabinetClone = cabinetOriginal.clone(true);
        const testInstance = new ModelInstanse(cabinetClone);
        testInstance.root.position.copy(position);
      // console.log(testInstance.root.position);


      if(side == 'left')  testInstance.root.rotation.y = Math.PI / 2;
       
        testInstance.slot = oldindex;
    
        //  Исключаем текущий объект из проверки
        let indexInModels
        const current = plannerConfig.selectedObject;
    
    
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
    
    
        const collision = this.checkSimpleCollision(testInstance);
    
    
        // Возвращаем назад, если коллизия
        if (side == 'direct' && indexInModels !== -1) {
          plannerConfig.modelsDirect.splice(indexInModels, 0, current);
        }
    
          if (side == 'left' && indexInModels !== -1) {
          plannerConfig.modelsLeft.splice(indexInModels, 0, current);
        }
    
        if (collision) {
          this.plannerStore.showError();
          return;
        }
    
        // удаляем старый
        this.deleteSelected();
    
        const cabinet = this.loaderModels.get(cabinetName);
        cabinet.visible = true;
     //   namesToDelete.push(cabinetName);
    
        const instance = new ModelInstanse(cabinet);
        instance.name = type;
        instance.slot = oldindex;
        instance.side = oldside;
        instance.id - oldId
        instance.raycasterBox.userData.id = oldId
        instance.fullname = cabinetName
        cabinet.position.copy(position);
        cabinet.rotation.y = isLeft ? Math.PI / 2 : 0;
    
        plannerConfig.selectedObject = instance;
        plannerConfig.models.push(instance);
    
        if (isLeft) {
          plannerConfig.modelsLeft.push(instance);
        }
        if (!isLeft) {
          plannerConfig.modelsDirect.push(instance);
        }
    
        // plannerConfig.objectControls.push(instance.rightControl);
        // plannerConfig.objectControls.push(instance.leftControl);
        // plannerConfig.objectControls.push(instance.centerControl);
    
        instance.centerControl.visible = false;
        instance.leftControl.visible = false;
        instance.rightControl.visible = false;
    
        this.scene.add(cabinet);
    
        this.plannerStore.selectedObject.isSelect = false;
        this.plannerStore.selectedObject.name = false;
    
        
        
          this.plannerStore.objectMenu = false
          plannerConfig.selectedObject = false
          plannerConfig.selectedEmpty = false
    
          this.calculateSlotPositions();
      }

      
        getCenterPositionDirect(index) {
          const lastIndex = plannerConfig.newSlotsDirect.length - 1;
        // console.log('1')
      
          if (index === 0) {
        // console.log('2')
      
            const rightObj = plannerConfig.newSlotsDirect[index+1]
            let rightEdge = rightObj.center - rightObj.width / 2;
            const offset = plannerConfig.isAngleRow === 'left' ? 0.6 : 0;
            return (this.penalStore.penalOffsets.directLeft + rightEdge + offset) / 2;
          }
          if (index === lastIndex) {
        //   console.log('3')
      
            const leftObj = plannerConfig.newSlotsDirect[index-1]
            let leftEdge = leftObj.center + leftObj.width / 2;
            let rightEdge = this.kitchenSizesStore.sideSizes.side_a;
            return  (leftEdge + this.kitchenSizesStore.sideSizes.side_a  - this.penalStore.penalOffsets.directRight) / 2;
          }
            let leftObj = plannerConfig.newSlotsDirect[index-1]
            let rightObj = plannerConfig.newSlotsDirect[index+1]
      
            const leftEdge = leftObj.center + leftObj.width / 2
            const rightEdge = rightObj.center - rightObj.width / 2
          //  console.log(leftEdge , rightEdge)
            return (leftEdge + rightEdge) / 2
        }
      
        getCenterPositionLeft(index) {
          const slots = plannerConfig.newSlotsLeft;
          const lastIndex = slots.length - 1;
      
        if (index === 0) {
          // Крайний "правый" модуль (index=0) - ограничение справа это 0
          const leftObj = slots[index + 1];
          const leftEdge = leftObj 
            ? leftObj.center - leftObj.width / 2 
            : this.kitchenSizesStore.sideSizes.side_c;
      
          // Добавим отступ 0.3 если это прямой ряд
          const offset = plannerConfig.isAngleRow === 'direct' ? 0.3 : 0;
          
          return (leftEdge / 2) + offset;
        }
      
          if (index === lastIndex) {
            // Крайний "левый" модуль
            const rightObj = slots[index - 1];
            const rightEdge = rightObj ? rightObj.center + rightObj.width / 2 : 0;
            const leftEdge = this.kitchenSizesStore.sideSizes.side_c - this.penalStore.penalOffsets.left;
            return (rightEdge + leftEdge ) / 2;
          }
      
          // Для промежуточных
          const rightObj = slots[index - 1];
          const leftObj = slots[index + 1];
          const rightEdge = rightObj.center + rightObj.width / 2;
          const leftEdge = leftObj.center - leftObj.width / 2;
      
          return (rightEdge + leftEdge) / 2;
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
            //  console.log("goooo");
              const index2 = plannerConfig.modelsLeft.findIndex((m) => m.root.uuid === obj.root.uuid);
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
        
             console.log('models', plannerConfig.models)
            console.log('modelsDirect', plannerConfig.modelsDirect)
        
            //создание пустых боксов в пустоте
            this.emptyManager.calculateEmpties()
        
            if(this.kitchenSizesStore.type == 'left'){
              this.emptyManager.calculateEmptiesLeft()
            }
            
           
        
            this.sceneSetup.requestRender();
          }

   calculateSlotsNew(){
    plannerConfig.newSlotsDirect.length = 0
    plannerConfig.newSlotsLeft.length = 0

     plannerConfig.modelsDirect.sort((a, b) => a.root.position.x - b.root.position.x);
     plannerConfig.modelsLeft.sort((a, b) => a.root.position.z - b.root.position.z);

     plannerConfig.modelsDirect.forEach((el, index)=>{
     el.index = index 
      plannerConfig.newSlotsDirect.push({index:el.index,
         center:Number((el.root.position.x).toFixed(3)),
        width:el.width})
     })
       plannerConfig.modelsLeft.forEach((el, index)=>{
     el.index = index 
      plannerConfig.newSlotsLeft.push({index:el.index,
         center:Number((el.root.position.z).toFixed(3)),
        width:el.width})
     })

   //  console.log('modelsDirect', plannerConfig.modelsDirect)
     this.calculateCornerBounds()
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


      //оперделяем какой модуль зашёл в угол
    const leftEdge = plannerConfig.newSlotsLeft[0].center - plannerConfig.newSlotsLeft[0].width/2
    if (leftEdge < 0.59) {
   //   console.log('left yes')
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
    if(leftEdge >= 0.6 && directEdge >= 0.6){
      plannerConfig.isAngleRow = 'none'
    }
    }

 
   

      
  }

   calculateSlotPositions() {

       let offsetDirect
    let offsetLeft = 0;

    if(this.kitchenSizesStore.type == 'direct'){
     offsetDirect = this.penalStore.penalOffsets.directLeft
    }

    if(this.kitchenSizesStore.type == 'left'){
     
      if(algorithmConfig.sideSink == 'direct'){
     //    console.log(1)
        offsetDirect = 0.6
        if(algorithmConfig.sinkSize == 1){
          offsetDirect = 0
          offsetLeft = 0.6
        }
      }
      if(algorithmConfig.sideSink == 'left' && algorithmConfig.sinkSize == 0.6){
      //  console.log(3)
        offsetDirect = 0
        offsetLeft = 0.6
      }
       if(algorithmConfig.sideSink == 'left' && algorithmConfig.sinkSize == 1){
      //  console.log(3)
        offsetDirect = 0.6
        offsetLeft = 0
      }
      
    }
   // console.log('offsetDirect', offsetDirect)

    // offsetDirect =  this.kitchenType == "direct"  ? 0 + this.penalStore.penalOffsets.directLeft  : 0.6;
    

    plannerConfig.slotsDirect.length = 0;
    plannerConfig.slotsLeft.length = 0;

    plannerConfig.modelsDirect.sort((a, b) => a.slot - b.slot);
    plannerConfig.modelsDirect.forEach((el) => {
      if (el.name == "penal") return;
      el.center = Number((el.objectSize.x / 2 + offsetDirect).toFixed(3));
      plannerConfig.slotsDirect.push({
        index: el.slot,
        center: el.center,
        width: el.objectSize.x,
      });
      offsetDirect += el.objectSize.x;
    });

    plannerConfig.modelsLeft.sort((a, b) => a.slot - b.slot);
    plannerConfig.modelsLeft.forEach((el) => {
      el.center = Number((el.objectSize.x / 2 + offsetLeft).toFixed(3));
      plannerConfig.slotsLeft.push({
        index: el.slot,
        center: el.center,
        width: el.objectSize.x,
      });
      offsetLeft += el.objectSize.x;
    });

  //  console.log("slotsDirect", plannerConfig.slotsDirect);
  //  console.log("slotsLeft", plannerConfig.slotsLeft);
  }
      
    
}