import { plannerConfig } from "./planerConfig";
import * as THREE from "three";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../pinia/penals";
import { gsap } from "gsap";
import { algorithmConfig } from "../builders/Algorithm/algorithmConfig";
import { TableTop } from "../builders/Algorithm/TableTop";
import { array } from "three/tsl";

export class SwapController {
  constructor(sceneSetup) {
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();

    this.sceneSetup = sceneSetup;
    this.tableTop = new TableTop(this.sceneSetup);

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

    this.movingDirection = null;
    this.rules = {
      direct: {
        array: "modelsDirect",
        axis: "x",
      },
      left: {
        array: "modelsLeft",
        axis: "z",
      },
    };
  }

  doSwap() {
    const selectedBox = plannerConfig.selectedObject;

    const collis = this.checkSimpleCollision(selectedBox);
    //  console.log("collis", collis);
    if (collis) {
      plannerConfig.isCollision = true;
    } else {
      plannerConfig.isCollision = false;
    }

    //  console.log(plannerConfig.isCollision);

    const level = selectedBox.level;
    const side = selectedBox.side;
    const models = plannerConfig.arraySwap;
    const index = models.findIndex(
      (m) => m.root.uuid === selectedBox.root.uuid
    );
    const axis = side === "direct" ? "x" : "z";
    if (index === -1) return;

    // --- Левый сосед ---
    if (index > 0) {
      const leftBox = models[index - 1];
      const leftSide = selectedBox.root.position[axis] - selectedBox.width / 2;

      if (leftSide < leftBox.root.position[axis]) {
        // если уже свапались с этим кубом — пропускаем
        if (this.lastCollision === leftBox.root.uuid) return;
        this.swapRight(index, index - 1, models, axis, side, level);
        this.swapSelected = true;
        this.lastCollision = leftBox.root.uuid; // запоминаем, с кем свапнулись
        return;
      }
    }

    // --- Правый сосед ---
    if (index < models.length - 1) {
      const rightBox = models[index + 1];
      const rightSide = selectedBox.root.position[axis] + selectedBox.width / 2;

      if (rightSide > rightBox.root.position[axis]) {
        // если уже свапались с этим кубом — пропускаем
        if (this.lastCollision === rightBox.root.uuid) return;

        this.swapLeft(index, index + 1, models, axis, side, level);
        this.swapSelected = true;
        this.lastCollision = rightBox.root.uuid; // запоминаем
        return;
      }
    }

    // если ни с кем не пересекаемся — сбрасываем "последнего столкнувшегося"
    this.lastCollision = null;

    //  console.log("collis", plannerConfig.isCollision);

    this.sceneSetup.requestRender();
  }

  swapLeft(i, j, models, axis, side, level) {
    const HALF_DEPTH = level === 1 ? 0.3 : 0.15;
    const centerB = models[j].root.position[axis];
    const widthB = models[j].width;
    const centerA = models[i].root.position[axis];
    const widthA = models[i].width;

    const point = centerB - widthB / 2 - widthA;
    const newPos = point + widthB / 2;

    this.newPos = newPos;

 //   console.log("newPOsSwap", newPos);

    gsap.to(models[j].root.position, {
      x: side === "direct" ? newPos : HALF_DEPTH,
      z: side === "left" ? newPos : HALF_DEPTH,
      duration: 0.1,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
        this.sceneSetup.requestRender();
        this.swapSelected = false;
        //  this.tableTop.create()
      },
    });

    const temp = models[i];
    models[i] = models[j];
    models[j] = temp;
  }

  swapRight(i, j, models, axis, side, level) {
    const HALF_DEPTH = level === 1 ? 0.3 : 0.15;
    const centerB = models[j].root.position[axis];
    const widthB = models[j].width;
    const centerA = models[i].root.position[axis];
    const widthA = models[i].width;

    const moveRight = centerB > centerA;

    const point = centerB + widthB / 2 + widthA;
    const newPos = point - widthB / 2;

    this.newPos = newPos;

  //  console.log("newPOsSwap", newPos);

    gsap.to(models[j].root.position, {
      x: side === "direct" ? newPos : HALF_DEPTH,
      z: side === "left" ? newPos : HALF_DEPTH,
      duration: 0.1,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
        this.sceneSetup.requestRender();
        this.swapSelected = false;
        //   this.tableTop.create()
      },
    });

    const temp = models[i];
    models[i] = models[j];
    models[j] = temp;
  }

  doSwap2() {
    const selectedBox = plannerConfig.selectedInSector;

     const collis = this.checkCollisionInSector(selectedBox);
 //    console.log("collis", collis);
    if (collis) {
      plannerConfig.isCollisionInSector = true;
    } else {
      plannerConfig.isCollisionInSector = false;
    }

    const models = plannerConfig.selectedSector.modules;
    const index = models.findIndex(
      (m) => m.root.uuid === selectedBox.root.uuid
    );
    const axis = "y";
    if (index === -1) return;

    // --- Левый сосед ---
    if (index > 0) {
      const leftBox = models[index - 1];
      const leftSide = selectedBox.root.position[axis];

      if (leftSide < leftBox.root.position[axis] + leftBox.height / 2) {
        // если уже свапались с этим кубом — пропускаем
        if (this.lastCollision === leftBox.root.uuid) return;
        this.swapRight2(index, index - 1, models, axis);
        this.swapSelectedInSector = true;
        this.lastCollision = leftBox.root.uuid; // запоминаем, с кем свапнулись
        return;
      }
    }

    // --- Правый сосед ---
    if (index < models.length - 1) {
      const rightBox = models[index + 1];
      const rightSide = selectedBox.root.position[axis] + selectedBox.height;

      if (rightSide > rightBox.root.position[axis] + rightBox.height / 2) {
        // если уже свапались с этим кубом — пропускаем
        if (this.lastCollision === rightBox.root.uuid) return;

        this.swapLeft2(index, index + 1, models, axis);
        this.swapSelectedInSector = true;
        this.lastCollision = rightBox.root.uuid; // запоминаем
        return;
      }
    }

    // если ни с кем не пересекаемся — сбрасываем "последнего столкнувшегося"
    this.lastCollision = null;

    //  console.log("collis", plannerConfig.isCollision);

    this.sceneSetup.requestRender();
  }

  swapLeft2(i, j, models, axis) {
    const centerB = models[j].root.position[axis];
    const widthB = models[j].height;
    const centerA = models[i].root.position[axis];
    const widthA = models[i].height;

    const point = centerB - widthB / 2 - widthA;
    const newPos = point + widthB / 2;

    this.newPos = newPos;

    console.log("newPOsSwap", newPos);

    gsap.to(models[j].root.position, {
      y: newPos,
      duration: 0.1,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
        this.sceneSetup.requestRender();
        this.swapSelectedInSector = false;
        //  this.tableTop.create()
      },
    });

    const temp = models[i];
    models[i] = models[j];
    models[j] = temp;
  }

  swapRight2(i, j, models, axis) {
    const centerB = models[j].root.position[axis];
    const widthB = models[j].height;
    const centerA = models[i].root.position[axis];
    const widthA = models[i].height;

    const moveRight = centerB > centerA;

    const point = centerB + widthB / 2 + widthA;
    const newPos = point - widthB / 2;

    this.newPos = newPos;

    console.log("newPOsSwap", newPos);

    gsap.to(models[j].root.position, {
      y: newPos,
      duration: 0.1,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
        this.sceneSetup.requestRender();
        this.swapSelectedInSector = false;
        //   this.tableTop.create()
      },
    });

    const temp = models[i];
    models[i] = models[j];
    models[j] = temp;
  }

  moveBackInSector(isSwap) {
    console.log("isSwap", isSwap);
    console.log("this.collissionModule", this.collissionModule);

    const selected = plannerConfig.selectedInSector;

    let posX, posZ, centerB, newPos;

    if (this.collissionModule) {
      const heightA = plannerConfig.selectedInSector.height;
      const heightB = this.collissionModule.height;

      console.log('heigA', heightA)
      console.log('heigB', heightB)

      const centerA = selected.root.position.y + selected.height/2;

      if (!isSwap) {
        console.log('!isSwap')
        centerB = this.collissionModule.root.position.y + this.collissionModule.height/2;
      }

      if (isSwap) {  
        console.log('isSwap')

        centerB = this.newPos;
      }

      console.log('centerB', centerB)

      const movingUp = centerB > centerA;

      if (movingUp) {
        console.log("moveUp");
        newPos = centerB - heightB / 2 - heightA ;
       
      } else {
         console.log("MoveDown");
        newPos = centerB + heightB / 2  ;
      }

      console.log('newPos', newPos)

      gsap.to(plannerConfig.selectedInSector.root.position, {
        y: newPos,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          this.sceneSetup.requestRender();
        },
        onComplete: () => {
          this.movedBack = false;
          plannerConfig.moveBack.otherBox = null;
          plannerConfig.isCollision = false;
          this.sceneSetup.requestRender()
        
        },
      });
    }

    //  console.log('posX', posX)
  }

  moveBack(isSwap) {
 //   console.log("isSwap", isSwap);
  //  console.log("first", this.lastCollision);

    const selected = plannerConfig.selectedObject;
    const level = selected.level;

    const side = plannerConfig.selectedObject.side;
    const isLeft = side === "left";
    const HALF_DEPTH = level === 1 ? 0.3 : 0.15;

    let posX, posZ, centerB, newPos;

    if (this.collissionModule) {
      const widthA = plannerConfig.selectedObject.width;
      const widthB = this.collissionModule.width;

      const centerA = isLeft
        ? selected.root.position.z
        : selected.root.position.x;

      if (!isSwap) {
        centerB = isLeft
          ? this.collissionModule.root.position.z
          : this.collissionModule.root.position.x;
      }

      if (isSwap) {
        centerB = isLeft ? this.newPos : this.newPos;
      }

  //    console.log("newposBack", this.newPos);

      const movingRight = centerB > centerA;

      if (movingRight) {
     //   console.log("moveright");
        newPos = centerB - widthA / 2 - widthB / 2;
      //  console.log("notMoveRight");
      } else {
        newPos = centerB + widthA / 2 + widthB / 2;
      }

      gsap.to(plannerConfig.selectedObject.root.position, {
        x: side == "direct" ? newPos : HALF_DEPTH,
        z: side == "left" ? newPos : HALF_DEPTH,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          this.sceneSetup.requestRender();
        },
        onComplete: () => {
          this.movedBack = false;
          plannerConfig.moveBack.otherBox = null;
          plannerConfig.isCollision = false;
          this.tableTop.create();
        },
      });
    }

    //  console.log('posX', posX)
  }

  checkSimpleCollision(testInstance) {
    const gap = 0.01;

    const selectedBox = new THREE.Box3().setFromObject(
      testInstance.raycasterBox
    );
    selectedBox.expandByScalar(-gap); // уменьшаем на зазор

    for (let model of plannerConfig.arraySwap) {
      if (model.root.uuid === testInstance.root.uuid) continue;

      const otherBox = new THREE.Box3().setFromObject(model.raycasterBox);

      if (selectedBox.intersectsBox(otherBox)) {
        this.collissionModule = model;

        return true;
      } else {
        this.collissionModule = null;
      }
    }

    return false;
  }

  checkCollisionInSector(testInstance) {
    const gap = 0.005;

    const models = plannerConfig.selectedSector.modules;

    const selectedBox = new THREE.Box3().setFromObject(testInstance.raycasterBox);
    selectedBox.expandByScalar(-gap); // уменьшаем на зазор

   // console.log("selected", selectedBox);

    for (let model of models) {
       if (model.root.uuid === testInstance.root.uuid) continue;
      const otherBox = new THREE.Box3().setFromObject(model.raycasterBox);
      //  otherBox.expandByScalar(gap); // увеличиваем на зазор

      if (selectedBox.intersectsBox(otherBox)) {
        this.collissionModule = model;

        return true;
      } else {
        this.collissionModule = null;
      }
    }

    return false;
  }
}
