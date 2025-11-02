import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { snapToNearby } from "./utils/snapToNearby";
import { useMouseStore } from "../../../pinia/mouseStore";

export class MoveController2L {
  constructor(sceneSetup) {
    this.objectSize = new THREE.Vector3();
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.raycaster = new THREE.Raycaster();
    this.offset = new THREE.Vector3();
    this.mouse = new THREE.Vector2();
    this.camera = this.sceneSetup.camera;
    this.kitchenStore = useKitchenSizesStore();
    this.mouseStore = useMouseStore()

    
    
   
  }



moveNearWallsOnly() {
      this.mouse.set(this.mouseStore.normalizedX , this.mouseStore.normalizedY )
  this.raycaster.setFromCamera(this.mouse, this.camera);

  let intersects;

  if (plannerConfig.selectedObject.side === 'direct') {
    intersects = this.raycaster.intersectObject(plannerConfig.directPlane2level);
  } else if (plannerConfig.selectedObject.side === 'left') {
    intersects = this.raycaster.intersectObject(plannerConfig.leftPlane);
  }

  if (!intersects || intersects.length === 0) return;

  const point = intersects[0].point.clone().add(this.offset);
  const currentPos = plannerConfig.selectedObject.root.position.clone();

  const bounds = plannerConfig.kitchenBounds
  const halfWidth = plannerConfig.selectedObject.objectSize.x / 2;
  const halfDepth = plannerConfig.selectedObject.objectSize.z / 2 || 0.2;

  //console.log('bounds', bounds)

  // Ограничим точку рамками
  point.x = THREE.MathUtils.clamp(point.x, bounds.minX + halfWidth, bounds.maxX - halfWidth);
  point.z = THREE.MathUtils.clamp(point.z, bounds.minZ + halfWidth, bounds.maxZ - halfWidth);

 // console.log('point', point)

  const direction = point.clone().sub(currentPos);

  //   console.log('directtion2', direction)
  const distance = direction.length();

  if (distance < 0.001) return;

  const stepSize = 0.05; // 2 см шаг
      const steps = Math.round(distance / stepSize);
  const stepVec = direction.clone().normalize().multiplyScalar(stepSize);

  //  console.log('steps', steps)
  //    console.log('stepVec', stepVec)

  let finalPos = currentPos.clone();

 //   console.log('finalPos', finalPos.x)

  for (let i = 0; i < steps; i++) {
    const testPos = finalPos.clone().add(stepVec);

    if (this.checkFutureCollision(testPos)) {
      break;
    }

    finalPos.copy(testPos);
  }

//    console.log('finalPosAfter', finalPos.x)




  // Применим новую позицию
  if (this.kitchenStore.type === "direct") {
    plannerConfig.selectedObject.root.position.x = finalPos.x;
  }

  if (this.kitchenStore.type === "left") {
    if (plannerConfig.selectedObject.side === "direct") {
      plannerConfig.selectedObject.root.position.z = 0.15;
      plannerConfig.selectedObject.root.position.x = finalPos.x;
    } else if (plannerConfig.selectedObject.side === "left") {
      plannerConfig.selectedObject.root.position.x = 0.15;
      plannerConfig.selectedObject.root.position.z = finalPos.z;
    }
  }

  snapToNearby(plannerConfig.selectedObject, plannerConfig.models);
  this.sceneSetup.requestRender();
}

  checkRaycaster(){
    
  }

  bounds2level(){
    if (this.kitchenStore.type == "direct") {
      plannerConfig.roomBounds = {
        minX: 0 ,
        maxX: this.kitchenStore.sideSizes.side_a,
        minZ: 0.3,
        maxZ: 0.3,
      };
    }

    if (this.kitchenStore.type == "left") {
      if (plannerConfig.selectedObject.side == "direct") {
        plannerConfig.roomBounds = {
          minX:  0, // ограничение движения если левый ряд до угла
          maxX: this.kitchenStore.sideSizes.side_a,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minZ:   0.3 , // ограничение движения если левый ряд до угла
          maxZ: this.kitchenStore.sideSizes.side_c,
        };
      }
    }

  }

  bounds1level() {
    // диапазон движений модулей

    if (this.kitchenStore.type == "direct") {
      plannerConfig.roomBounds = {
        minX: 0 + plannerConfig.penalsBorders.directLeft,
        maxX: plannerConfig.penalsBorders.directRight,
        minZ: 0.3,
        maxZ: 0.3,
      };
    }

    if (this.kitchenStore.type == "left") {
      if (plannerConfig.selectedObject.side == "direct") {
        plannerConfig.roomBounds = {
          minX: plannerConfig.isAngleRow == "left" ? 0.6 : 0, // ограничение движения если левый ряд до угла
          maxX: plannerConfig.penalsBorders.directRight,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minZ: plannerConfig.isAngleRow == "direct" ? 0.6 : 0, // ограничение движения если левый ряд до угла
          maxZ: plannerConfig.penalsBorders.left,
        };
      }
    }
  }

  checkCollision(testInstance, nextPosition) {
     
      const modelsArray =plannerConfig.modelsDirect2L
   //   console.log('modelsArray', modelsArray)
      
  
      const selectedBox = new THREE.Box3().setFromObject(testInstance.root);
       const delta = new THREE.Vector3().subVectors(nextPosition, testInstance.root.position);
        selectedBox.translate(delta);
   
  
    //  console.log('selected', selectedBox)
  
      for (let model of modelsArray) {
        if (model.root.uuid === testInstance.root.uuid) continue;
  
        const otherBox = new THREE.Box3().setFromObject(model.root);

  
        if (selectedBox.intersectsBox(otherBox)) {
          console.log("коллизия с учётом зазора!");
          console.log('selectedBox', selectedBox)
          console.log('other', otherBox)
  
          return true;
  
          
        }
      }
  
      return false;
  }

 checkFutureCollision(desiredPosition) {
  const size = new THREE.Vector3();
  const selectedObject = plannerConfig.selectedObject.root;
  const currentPosition = selectedObject.position.clone();

  const selectedBox = new THREE.Box3().setFromObject(selectedObject);
  selectedBox.getSize(size);

  const futureBox = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(desiredPosition.x, currentPosition.y, desiredPosition.z),size);

   const side = plannerConfig.selectedObject.side;

   let arraysToCheck = [];

   arraysToCheck.push(...plannerConfig.penalsArray)

   



  // if(this.kitchenStore.type == 'left'){
  //     if(side == 'left'){
  //       arraysToCheck.push(...plannerConfig.modelsDirect2L)
  //     }
  //     if(side == 'direct'){
  //       arraysToCheck.push(...plannerConfig.modelsLeft2L)
  //     }
  //  }

  const movementDirection = desiredPosition.clone().sub(currentPosition);

  for (const module of arraysToCheck) {
    if (module.root.uuid === selectedObject.uuid) continue;

    const moduleBox = new THREE.Box3().setFromObject(module.root);

    if (futureBox.intersectsBox(moduleBox)) {
      // Только если есть движение по оси X — считаем это коллизией
      if (Math.abs(movementDirection.x) > 0.001) {
        return true;
      }
    }
  }

  return false;
}
  checkCollisionManual(){
    let collision
    const side = plannerConfig.selectedObject.side
    const movingPosX = plannerConfig.selectedObject.root.position.x
    const movingPosZ = plannerConfig.selectedObject.root.position.z

    const movingWidth = plannerConfig.selectedObject.width
    let modelsArray = plannerConfig.penalsArray

    if (side == 'direct') modelsArray = modelsArray.filter(model=> model.side == 'direct')
    if (side == 'left') modelsArray = modelsArray.filter(model=> model.side == 'left')

 //     console.log('penalArray', modelsArray)



    const movingRightSide = movingPosX + movingWidth/2
    const movingLeftSide = movingPosX - movingWidth/2
    const movingLeftSideZ = movingPosZ + movingWidth/2


   // console.log('movingLeftSide', movingLeftSideZ)


   

      for (let model of modelsArray) {
       // if (model.root.uuid === plannerConfig.selectedObject.root.uuid) continue;
  
        const otherBoxX = model.root.position.x
        const otherBoxZ = model.root.position.z

        const otherWidth = model.width
        const otherLeftSide =  otherBoxX - otherWidth/2
        const otherRightSide =  otherBoxZ - otherWidth/2

   //     console.log('otherRight', otherRightSide)


        if(side == 'left' && movingLeftSideZ > otherRightSide)   return  'left'     
      
        if(side == 'direct' && movingRightSide > otherLeftSide)  return 'direct'
      }
  }



   checkCollisionRay(testInstance, nextPosition ,movementDirection) {


    // направление движения
    const from = testInstance.root.position.clone();
    from.y = 1.55
    const to = nextPosition.clone();
    const direction = new THREE.Vector3(movementDirection.x, 0, 0).normalize();
    const distance = 2;



    const modelsArray = plannerConfig.penalsArray
    const raycaster = new THREE.Raycaster(from, direction, 0, distance);

    

    const targets = modelsArray
      .filter(model => model.root.uuid !== testInstance.root.uuid)
      .map(model => model.raycasterBox);


    const intersects = raycaster.intersectObjects(targets, false); // true — проверка всех потомков

    if (intersects.length > 0) {
      console.log(intersects[0].distance)
      const collision = intersects[0].distance - 0.3
    if (collision < 0.01){
       console.log('фиксируем дистанцию', intersects[0].distance)
       return true;
    } 
    }

    return false;
}
}
