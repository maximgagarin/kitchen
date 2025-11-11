import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { snapToNearby } from "./utils/snapToNearby";
import { useMouseStore } from "../../../pinia/mouseStore";

export class MoveController {
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

    intersects = this.raycaster.intersectObject(plannerConfig.directPlane1level );

  

  

    if (intersects.length > 0) {
      const point = intersects[0].point.clone().add(this.offset);
     
      console.log('point', point)


  

      const currentPos = plannerConfig.selectedObject.root.position.clone();

      const bounds =   plannerConfig.roomBounds
      const halfWidth = plannerConfig.selectedObject.objectSize.x / 2;
     

      // Ограничим точку рамками
      point.x = THREE.MathUtils.clamp( point.x,  bounds.minX + halfWidth, bounds.maxX - halfWidth  );
      point.z = THREE.MathUtils.clamp(  point.z,  bounds.minZ + halfWidth,  bounds.maxZ - halfWidth  );

    
      const direction = point.clone().sub(currentPos);
      const distance = direction.length();

      if (distance < 0.01) return;

      const stepSize = 0.02; // 2 см шаг
     const steps = Math.round(distance / stepSize);
      const stepVec = direction.clone().normalize().multiplyScalar(stepSize);

    //  let finalPos = currentPos.clone();
    let finalPos = point

      // for (let i = 0; i < steps; i++) {
      //   const testPos = finalPos.clone().add(stepVec);

      //   if (this.checkFutureCollision(testPos)) {
      //     break;
      //   }

      //   finalPos.copy(testPos);
      // }

   

  

      if (this.kitchenStore.type == "direct") {
        console.log(finalPos.x)
        plannerConfig.selectedObject.root.position.x = finalPos.x;
      }

      if (this.kitchenStore.type == "left") {
        if (plannerConfig.selectedObject.side == "direct") {
          plannerConfig.selectedObject.root.position.z =
            plannerConfig.selectedObject.level == 1 ? 0.3 : 0.15;
          plannerConfig.selectedObject.root.position.x = finalPos.x;
        }

        if (plannerConfig.selectedObject.side == "left") {
          plannerConfig.selectedObject.root.position.x =
            plannerConfig.selectedObject.level == 1 ? 0.3 : 0.15;
          plannerConfig.selectedObject.root.position.z = finalPos.z;
        }
      }

      //   highlightIfCollision(plannerConfig.selectedObject, this.scene, plannerConfig.models);
     snapToNearby(plannerConfig.selectedObject);
      this.sceneSetup.requestRender();
    }
  }


  freeMove() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(plannerConfig.directPlane1level);
    if (intersects.length > 0) {
      const point = intersects[0].point.clone().add(this.offset);
      const desiredPos = new THREE.Vector3(point.x, 0, point.z);
      const halfWidth = this.objectSize.x / 2;
      const halfDepth = this.objectSize.z / 2;
    
      plannerConfig.selectedObject.root.position.copy(point);
    //  highlightIfCollision(plannerConfig.selectedObject, this.scene, plannerConfig.models);
    //  snapToNearby(plannerConfig.selectedObject, plannerConfig.models);
      this.sceneSetup.requestRender();
    }
  }

  bounds2level() {
    if (this.kitchenStore.type == "direct") {
      plannerConfig.roomBounds = {
        minX: 0,
        maxX: this.kitchenStore.sideSizes.side_a,
        minZ: 0.3,
        maxZ: 0.3,
      };
    }

    if (this.kitchenStore.type == "left") {
      if (plannerConfig.selectedObject.side == "direct") {
        plannerConfig.roomBounds = {
          minX: 0, // ограничение движения если левый ряд до угла
          maxX: this.kitchenStore.sideSizes.side_a,
          minZ: 0.3,
          maxZ: 0.3,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minZ: 0, // ограничение движения если левый ряд до угла
          maxZ: this.kitchenStore.sideSizes.side_c,
          minX: 0.3,
          maxX: 0.3,
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
          minZ: 0.3,
          maxZ: 0.3,
        };
      }
      if (plannerConfig.selectedObject.side == "left") {
        plannerConfig.roomBounds = {
          minZ: plannerConfig.isAngleRow == "direct" ? 0.6 : 0, // ограничение движения если левый ряд до угла
          maxZ: plannerConfig.penalsBorders.left,
          minX: 0.3,
          maxX: 0.3,
        };
      }
    }
  }

  checkCollision(testInstance) {
    let box = plannerConfig.selectedEmpty2L;

    const arrays = {
      direct: plannerConfig.modelsDirect2L,
      left: plannerConfig.modelsLeft2L,
    };

    const rule = this.rules[box.name];
    console.log("rule", rule);
    const modelsArray = arrays[rule.side];
    console.log("modelsArray", modelsArray);

    const gap = 0.01;

    const selectedBox = new THREE.Box3().setFromObject(testInstance.root);
    selectedBox.expandByScalar(-gap); // уменьшаем на зазор

    console.log("selected", selectedBox);

    for (let model of modelsArray) {
      if (model.root.uuid === testInstance.root.uuid) continue;

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

  checkFutureCollision(desiredPosition) {
    const selectedObject = plannerConfig.selectedObject.root;
    const currentPosition = selectedObject.position.clone();

    // Получаем габариты
    const selectedBox = new THREE.Box3().setFromObject(selectedObject);
    const size = new THREE.Vector3();
    const side = plannerConfig.selectedObject.side;
    selectedBox.getSize(size);

    const futureCenter = new THREE.Vector3(desiredPosition.x,  currentPosition.y, desiredPosition.z );
    const futureSize = size.clone();

    const futureBox = new THREE.Box3().setFromCenterAndSize(futureCenter,   futureSize  );

   
   const movementDirection = desiredPosition.clone().sub(currentPosition);

    for (const module of plannerConfig.arraysToCheck) {
      if (module.root.uuid === selectedObject.uuid) continue;

      const moduleBox = new THREE.Box3().setFromObject(module.root);

      // Проверяем пересечение только по X и Z
      const intersectsX =   futureBox.max.x > moduleBox.min.x && futureBox.min.x < moduleBox.max.x;

      const intersectsZ =   futureBox.max.z > moduleBox.min.z && futureBox.min.z < moduleBox.max.z;

      if (intersectsX && intersectsZ) {
        if ( (Math.abs(movementDirection.z) > 0.001) || (Math.abs(movementDirection.x) > 0.001)) {
          return true;
        }
      }
    }

    return false;
  }



  checkCollisionManual() {
    if (plannerConfig.selectedObject.name == "penal") return;
    let collision;
    const side = plannerConfig.selectedObject.side;
    const movingPosX = plannerConfig.selectedObject.root.position.x;
    const movingPosZ = plannerConfig.selectedObject.root.position.z;

    const movingWidth = plannerConfig.selectedObject.width;
    let modelsArray = plannerConfig.penalsArray;

    if (side == "direct")
      modelsArray = modelsArray.filter((model) => model.side == "direct");
    if (side == "left")
      modelsArray = modelsArray.filter((model) => model.side == "left");

    //     console.log('penalArray', modelsArray)

    const movingRightSide = movingPosX + movingWidth / 2;
    const movingLeftSide = movingPosX - movingWidth / 2;
    const movingLeftSideZ = movingPosZ + movingWidth / 2;

    // console.log('movingLeftSide', movingLeftSideZ)

    for (let model of modelsArray) {
      // if (model.root.uuid === plannerConfig.selectedObject.root.uuid) continue;

      const otherBoxX = model.root.position.x;
      const otherBoxZ = model.root.position.z;

      const otherWidth = model.width;
      const otherLeftSide = otherBoxX - otherWidth / 2;
      const otherRightSide = otherBoxZ - otherWidth / 2;

      //     console.log('otherRight', otherRightSide)

      if (side == "left" && movingLeftSideZ > otherRightSide) return "left";

      if (side == "direct" && movingRightSide > otherLeftSide) return "direct";
    }
  }
}
