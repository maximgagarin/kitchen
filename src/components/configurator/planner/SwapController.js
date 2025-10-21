import { plannerConfig } from "./planerConfig";
import * as THREE from "three";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../pinia/penals";
import { gsap } from "gsap";
import { algorithmConfig } from "../builders/Algorithm/algorithmConfig";
import { TableTop } from "../builders/Algorithm/TableTop";

export class SwapController {
  constructor(sceneSetup) {
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();

    this.sceneSetup = sceneSetup;
    this.tableTop = new TableTop(this.sceneSetup)

    this.scene = sceneSetup.scene;
    this.isDragging = false;
    this.lastSwapCandidate = null;
    this.movingProcess = true;
    this.swapDone = true;
    this.swapSelected = false;
    this.swapSelectedInSector = false;

    this.swapInProgress = false;
    this.firstCollision = null;
    this.firstCollisionInSector = null;

    this.movingDirection = null

  }

  doSwap() {
    const swapCandidate = this.checkSwapCandidate();
    this.checkCollision(plannerConfig.selectedObject)

 //   console.log('this.firstCollision', this.firstCollision)
   
    if(this.lastSwapCandidate && this.movingDirection !== plannerConfig.movingDirection){
      this.lastSwapCandidate = swapCandidate
    }

    
    if (swapCandidate && swapCandidate !== this.lastSwapCandidate) {
      console.log("swapcand", swapCandidate);

       this.swapSelected = true;
     
      console.log("Обмен модулей");

      const side = plannerConfig.selectedObject.side;
      const isLeft = side === 'left';

     
      this.lastSwapCandidate = swapCandidate;

   
      const widthA = plannerConfig.selectedObject.width
      const widthB = swapCandidate.width

      console.log('widthA', widthA)
      console.log('widthB', widthB)



      const centerA = this.firstCollision.selected
      const centerB = isLeft ? swapCandidate.root.position.z: swapCandidate.root.position.x;

      console.log('centerA', centerA)
      console.log('centerB', centerB)

      

      const movingRight = centerB > centerA;

      this.movingDirection = plannerConfig.movingDirection

     

      if(movingRight){
        this.newPosA = centerB + (widthB - widthA) / 2;
        this.newPosB = centerA - (widthA - widthB) / 2;
      } else {
        this.newPosA = centerB - (widthB - widthA) / 2;
        this.newPosB = centerA + (widthA - widthB) / 2;
      }
    

      console.log('newB', this.newPosB)
      console.log('newA', this.newPosA)


      this.firstCollision = null

     gsap.to(swapCandidate.root.position, {
      [isLeft ? 'z' : 'x']: this.newPosB,
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => this.sceneSetup.requestRender(),
      onComplete: () => {
        this.movingProcess = false;
        this.firstCollision = null;
       
        },
      });

      this.sceneSetup.requestRender();
    } else {
      this.swapDone = false;
    }
  }

  doSwapInSector() {
    this.checkCollisionInSector(plannerConfig.selectedInSector)
      console.log('firstCollisionInSector', this.firstCollisionInSector)
    const swapCandidate = this.checkSwapCandidateInSector();
 //   console.log('swapCand', swapCandidate)

    if ( swapCandidate &&  swapCandidate !== this.lastSwapCandidate  ) {
       this.lastSwapCandidate = swapCandidate;
        this.swapSelectedInSector = true;



      const heightA = plannerConfig.selectedInSector.objectSize.y
      const heightB = swapCandidate.objectSize.y


      const posA = this.firstCollisionInSector.selected 
      const posB = swapCandidate.root.position.y 

      const movingUp = posB > posA;

      console.log('movingUp',movingUp)

     console.log('heightA',heightA)
     console.log('heightB', heightB)

     console.log('posA', posA)
     console.log('posB', posB)

      this.firstCollisionInSector = null


      if(movingUp){
        this.newPosA = posB + heightB - heightA;
        this.newPosB =  posA ;
      } else {
         this.newPosA = posB
         this.newPosB = posA + heightA - heightB; //сдесь неправильно
      }
     
     console.log('newPosA' ,this.newPosA)
     console.log('newPosB', this.newPosB)

    

     
     

      gsap.to(swapCandidate.root.position, {
        y: this.newPosB,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => this.sceneSetup.requestRender(),
        onComplete: () => {
          this.movingProcess = false;
          this.swapInProgress = false; // 💡 разблокировка
          this.firstCollisionInSector = null
        },
      });
    }
  }

  checkSwapCandidate() {
    if(plannerConfig.selectedObject.name == 'penal') return
    const side = plannerConfig.selectedObject.side;
    const level = plannerConfig.selectedObject.level;

    const movingBox = new THREE.Box3().setFromObject(
      plannerConfig.selectedObject.raycasterBox
    );

    let modelsArray;
    if (level == 1) {
      modelsArray =
        side == "direct"
          ? plannerConfig.modelsDirect
          : plannerConfig.modelsLeft;
    }

    if (level == 2) {
      modelsArray =
        side == "direct"
          ? plannerConfig.modelsDirect2L
          : plannerConfig.modelsLeft2L;
    }

    for (let model of modelsArray) {
      if (model.root.uuid === plannerConfig.selectedObject.root.uuid) continue;

      const staticBox = new THREE.Box3().setFromObject(model.raycasterBox);

      let overlap, staticSize;

      if (side === "direct") {
        overlap =
          Math.min(movingBox.max.x, staticBox.max.x) -
          Math.max(movingBox.min.x, staticBox.min.x);
        staticSize = staticBox.max.x - staticBox.min.x;
      } else if (side === "left" || side === "right") {
        overlap =
          Math.min(movingBox.max.z, staticBox.max.z) -
          Math.max(movingBox.min.z, staticBox.min.z);
        staticSize = staticBox.max.z - staticBox.min.z;
      } else {
        console.warn("checkSwapCandidate: Unknown kitchenType", side);
        continue;
      }

            const movingSize = side === "direct"
        ? movingBox.max.x - movingBox.min.x
        : movingBox.max.z - movingBox.min.z;

      const minSize = Math.min(staticSize, movingSize);

      // допустим, 40% перекрытия считается достаточным
      const overlapThreshold = minSize * 0.5;

      if (overlap > overlapThreshold) {
        return  model;
      }

      // if (overlap > staticSize / 2) {
      //   return model;
      // }
    }

    return null;
  }

  moveSelectedAfterSwap() {
    if(plannerConfig.selectedObject.name == 'penal') return
    
     const side = plannerConfig.selectedObject.side;
      const isLeft = side === 'left';
  

    

  //  console.log("movefterPos", newPos);
    gsap.to(plannerConfig.selectedObject.root.position, {
      x: isLeft? plannerConfig.selectedObject.root.position.x :this.newPosA ,
      z: isLeft? this.newPosA : plannerConfig.selectedObject.root.position.z,

    
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
        this.swapSelected = false;
        
          this.tableTop.create()  // создаём общую столешницу
           plannerConfig.modelsDirect.forEach(item => {
             if(item.name =='penal') return
            item.tabletop.visible = false}) // отключам столешницу у модулей

           plannerConfig.modelsLeft.forEach(item => {
             if(item.name =='penal') return

            item.tabletop.visible = false}) // отключам столешницу у модулей

          this.sceneSetup.requestRender();
          console.log('end')

     
         
      
        
      },
    });

    this.sceneSetup.requestRender();
  }

  moveAfterSwapInSectror() {
   
    gsap.to(plannerConfig.selectedInSector.root.position, {
      y: this.newPosA,

      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
            this.swapSelectedInSector = false;
;
      },
    });

    this.sceneSetup.requestRender();
  }

  calculateSlotPositions() {
    let offsetDirect
    let offsetLeft = 0;

    if(this.kitchenSizesStore.type == 'direct'){
     offsetDirect = this.penalStore.penalOffsets.directLeft
    }

    if(this.kitchenSizesStore.type == 'left'){
     
      if(plannerConfig.isAngleRow == 'direct'){
        offsetLeft = 0.6
        offsetDirect = 0
      }

      if(plannerConfig.isAngleRow == 'left'){
        offsetLeft = 0
        offsetDirect = 0.6
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

  checkSwapCandidateInSector() {
    const movingBox = new THREE.Box3().setFromObject(
      plannerConfig.selectedInSector.raycasterBox
    );

    let modelsArray = plannerConfig.selectedSector.modules;

    for (let model of modelsArray) {
      if (model.root.uuid === plannerConfig.selectedInSector.root.uuid) continue;

      const staticBox = new THREE.Box3().setFromObject(model.raycasterBox);

      let overlap, staticSize;

      overlap =
        Math.min(movingBox.max.y, staticBox.max.y) -
        Math.max(movingBox.min.y, staticBox.min.y);
      staticSize = staticBox.max.y - staticBox.min.y;

      //  console.log('overlap', overlap)

      if (overlap > staticSize / 2) {
          console.log('есть')
        return model;
      }
    }

    return null;
  }

  setSlot() {
    plannerConfig.selectedSector.modules.forEach((el, index) => {
      el.slot = index;
    });
  }

  calculateSlotPosInSector() {
    plannerConfig.selectedSector.slots.length = 0;
    let offset = 0;

    plannerConfig.selectedSector.modules.sort((a, b) => a.slot - b.slot);
    plannerConfig.selectedSector.modules.forEach((el) => {
      el.center = Number((el.objectSize.y / 2 + offset).toFixed(3));
      plannerConfig.selectedSector.slots.push({
        slot: el.slot,
        center: el.center,
        width: el.objectSize.x,
      });
      offset += el.objectSize.y;
    });
  }

  setIndex() {
    plannerConfig.modelsDirect2L.forEach((el, index) => {
      el.index = index;
      el.slot = index;
    });
    plannerConfig.modelsLeft2L.forEach((el, index) => {
      el.index = index;
      el.slot = index;
    });
  }

  calculateSlotPositions2L() {
   

     let offsetDirect =
      this.kitchenType == "direct"
        ? 0 + this.penalStore.penalOffsets.directLeft
        : 0.6;

    
    let offsetLeft = 0;

    if(this.kitchenSizesStore.type == 'left'){
      if(plannerConfig.isAngleRow2L == 'direct'){
        offsetLeft = 0.3
        offsetDirect = 0
      }
      if(plannerConfig.isAngleRow2L == 'left'){
        offsetLeft = 0
        offsetDirect = 0.3
      }
    }


    plannerConfig.slotsDirect2L.length = 0;
    plannerConfig.slotsLeft2L.length = 0;


    plannerConfig.modelsDirect2L.sort((a, b) => a.slot - b.slot);
    plannerConfig.modelsDirect2L.forEach((el) => {
      if (el.name == "penal") return;
      el.center = Number((el.objectSize.x / 2 + offsetDirect).toFixed(3));
      plannerConfig.slotsDirect2L.push({
        index: el.slot,
        center: el.center,
        width: el.objectSize.x,
      });
      offsetDirect += el.objectSize.x;
    });

     plannerConfig.modelsLeft2L.sort((a, b) => a.slot - b.slot);
    plannerConfig.modelsLeft2L.forEach((el) => {
      if (el.name == "penal") return;
      el.center = Number((el.objectSize.x / 2 + offsetLeft).toFixed(3));
      plannerConfig.slotsLeft2L.push({
        index: el.slot,
        center: el.center,
        width: el.objectSize.x,
      });
      offsetLeft += el.objectSize.x;
    });
  }

 checkCollision(testInstance) {
  const modelsArray = plannerConfig.models;
  const selectedBox = new THREE.Box3().setFromObject(testInstance.root);
  const gap = 0.01;

  selectedBox.expandByScalar(-gap); // уменьшаем объём коллизии

  const side = plannerConfig.selectedObject.side; // определим сторону

//  console.log('side', side)

  

  for (let model of modelsArray) {
    if (model.root.uuid === testInstance.root.uuid) continue;

    const otherBox = new THREE.Box3().setFromObject(model.root);

    if (selectedBox.intersectsBox(otherBox)) {
      console.log('collis')


      const selectedCenter = new THREE.Vector3();
      selectedBox.getCenter(selectedCenter);

      const otherCenter = new THREE.Vector3();
      otherBox.getCenter(otherCenter);
      let movingRight, selectedX;

      // рассчёт первой коллизиии и зопоминаем позицию в момент коллизии

          if (side === 'left') {
            //рассчёт по z
            console.log('z')
            movingRight = selectedCenter.z > otherCenter.z;

            console.log('movRig', movingRight)

            selectedX = movingRight
              ? otherBox.max.z + testInstance.objectSize.x / 2
              : otherBox.min.z - testInstance.objectSize.x / 2;
          } else {
            // расчёт по X
            movingRight = selectedCenter.x > otherCenter.x;

        //    console.log('movingRight', movingRight)
         //   console.log('otherBox', otherBox)
        //    console.log('testInstance', testInstance.objectSize.x/2)

            selectedX = movingRight
              ? otherBox.max.x + testInstance.objectSize.x / 2
              : otherBox.min.x - testInstance.objectSize.x / 2;
          }



      const isNewTarget =
        !this.firstCollision || this.firstCollision.target.root.uuid !== model.root.uuid;

      if (isNewTarget) {
        this.firstCollision = {
       //   selected: otherBox.min.x - testInstance.objectSize.x / 2,
          selected: selectedX,

          other: model.root.position.clone(),
          target: model,
        };
      //  console.log("обновил первое столкновение:", this.firstCollision);
      }

      return {
        isCollision: true,
        target: model,
      };
    }
  }

  return false;
 }

 checkCollisionInSector(testInstance) {
    let modelsArray = plannerConfig.selectedSector.modules;
  const selectedBox = new THREE.Box3().setFromObject(testInstance.root);
  const gap = 0.01;

  selectedBox.expandByScalar(-gap); // уменьшаем объём коллизии



  for (let model of modelsArray) {
    if (model.root.uuid === testInstance.root.uuid) continue;

    const otherBox = new THREE.Box3().setFromObject(model.root);

    if (selectedBox.intersectsBox(otherBox)) {


      const selectedCenter = new THREE.Vector3();
      selectedBox.getCenter(selectedCenter);

      const otherCenter = new THREE.Vector3();
      otherBox.getCenter(otherCenter);
      let  selectedY;
      const movingUp = testInstance.root.position.y < model.root.position.y;


      console.log('movingUpInCollis' , movingUp)

  
      selectedY = movingUp
        ? model.root.position.y-  testInstance.objectSize.y 
        : model.root.position.y+model.objectSize.y;
         
      const isNewTarget =
        !this.firstCollisionInSector || this.firstCollisionInSector.target.root.uuid !== model.root.uuid;

      if (isNewTarget) {

        this.firstCollisionInSector = {
       //   selected: otherBox.min.x - testInstance.objectSize.x / 2,
          selected: selectedY,

          other: model.root.position.clone(),
          target: model,
        };
        console.log("обновил первое столкновение:", this.firstCollisionInSector);
      }

    }
  }
 }


}
