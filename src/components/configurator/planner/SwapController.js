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

   // console.log("newPOs", newPos);

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

   // console.log("newPOs", newPos);

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
      },
    });

    const temp = models[i];
    models[i] = models[j];
    models[j] = temp;
  }

  layoutBoxes(animated = false, moveSelected = false) {
    for (const box of plannerConfig.modelsDirect) {
      const targetX = box.root.position.x;
      // Пропускаем выбранный куб — его положение управляется мышкой
      if (box.root.uuid === plannerConfig.selectedObject.root.uuid) {
        continue;
      }

      if (animated) {
        gsap.to(box.root.position, {
          x: targetX,
          duration: 0.3,
          ease: "power2.out",
          onUpdate: () => {
            this.sceneSetup.requestRender();
          },
          onComplete: () => {
            this.sceneSetup.requestRender();
          },
        });
      } else {
        box.root.position.x = targetX;
      }
    }
  }

  doSwapInSector() {
    this.checkCollisionInSector(plannerConfig.selectedInSector);
    console.log("firstCollisionInSector", this.firstCollisionInSector);
    const swapCandidate = this.checkSwapCandidateInSector();
    //   console.log('swapCand', swapCandidate)

    if (swapCandidate && swapCandidate !== this.lastSwapCandidate) {
      this.lastSwapCandidate = swapCandidate;
      this.swapSelectedInSector = true;

      const heightA = plannerConfig.selectedInSector.objectSize.y;
      const heightB = swapCandidate.objectSize.y;

      const posA = this.firstCollisionInSector.selected;
      const posB = swapCandidate.root.position.y;

      const movingUp = posB > posA;

      console.log("movingUp", movingUp);

      console.log("heightA", heightA);
      console.log("heightB", heightB);

      console.log("posA", posA);
      console.log("posB", posB);

      this.firstCollisionInSector = null;

      if (movingUp) {
        this.newPosA = posB + heightB - heightA;
        this.newPosB = posA;
      } else {
        this.newPosA = posB;
        this.newPosB = posA + heightA - heightB; //сдесь неправильно
      }

      console.log("newPosA", this.newPosA);
      console.log("newPosB", this.newPosB);

      gsap.to(swapCandidate.root.position, {
        y: this.newPosB,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: () => this.sceneSetup.requestRender(),
        onComplete: () => {
          this.movingProcess = false;
          this.swapInProgress = false; // 💡 разблокировка
          this.firstCollisionInSector = null;
        },
      });
    }
  }

  checkSwapCandidate() {
    if (plannerConfig.selectedObject.name == "penal") return;
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

      const movingSize =
        side === "direct"
          ? movingBox.max.x - movingBox.min.x
          : movingBox.max.z - movingBox.min.z;

      const minSize = Math.min(staticSize, movingSize);

      // допустим, 40% перекрытия считается достаточным
      const overlapThreshold = minSize * 0.5;

      if (overlap > overlapThreshold) {
        return model;
      }

      // if (overlap > staticSize / 2) {
      //   return model;
      // }
    }

    return null;
  }

  moveSelectedAfterSwap() {
    if (plannerConfig.selectedObject.name == "penal") return;

    const side = plannerConfig.selectedObject.side;
    const isLeft = side === "left";

    //  console.log("movefterPos", newPos);
    gsap.to(plannerConfig.selectedObject.root.position, {
      x: isLeft ? plannerConfig.selectedObject.root.position.x : this.newPosA,
      z: isLeft ? this.newPosA : plannerConfig.selectedObject.root.position.z,

      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        this.sceneSetup.requestRender();
      },
      onComplete: () => {
        this.swapSelected = false;

        this.tableTop.create(); // создаём общую столешницу
        plannerConfig.modelsDirect.forEach((item) => {
          if (item.name == "penal") return;
          item.tabletop.visible = false;
        }); // отключам столешницу у модулей

        plannerConfig.modelsLeft.forEach((item) => {
          if (item.name == "penal") return;

          item.tabletop.visible = false;
        }); // отключам столешницу у модулей

        this.sceneSetup.requestRender();
        // console.log('end')
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
      },
    });

    this.sceneSetup.requestRender();
  }

  checkSwapCandidateInSector() {
    const movingBox = new THREE.Box3().setFromObject(
      plannerConfig.selectedInSector.raycasterBox
    );

    let modelsArray = plannerConfig.selectedSector.modules;

    for (let model of modelsArray) {
      if (model.root.uuid === plannerConfig.selectedInSector.root.uuid)
        continue;

      const staticBox = new THREE.Box3().setFromObject(model.raycasterBox);

      let overlap, staticSize;

      overlap =
        Math.min(movingBox.max.y, staticBox.max.y) -
        Math.max(movingBox.min.y, staticBox.min.y);
      staticSize = staticBox.max.y - staticBox.min.y;

      //  console.log('overlap', overlap)

      if (overlap > staticSize / 2) {
        console.log("есть");
        return model;
      }
    }

    return null;
  }

  moveBack() {
    console.log("first", this.lastCollision);

    const selected = plannerConfig.selectedObject;
    const level = selected.level;

    const side = plannerConfig.selectedObject.side;
    const isLeft = side === "left";
    const HALF_DEPTH = level === 1 ? 0.3 : 0.15;

    let posX, posZ, targetPositionX, newPos;

    if (this.collissionModule) {
      const widthA = plannerConfig.selectedObject.width;
      const widthB = this.collissionModule.width;

      const centerA = isLeft
        ? selected.root.position.z
        : selected.root.position.x;

      const centerB = isLeft
        ? this.collissionModule.root.position.z
        : this.collissionModule.root.position.x;

      const movingRight = centerB > centerA;

      if (movingRight) {
        newPos = centerB - widthA / 2 - widthB / 2;
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
          //   console.log('moveBack')
          this.movedBack = false;
          plannerConfig.moveBack.otherBox = null;
          plannerConfig.isCollision = false;
        },
      });
    }

    //  console.log('posX', posX)
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
        console.log("collis");
        plannerConfig.isCollision = true;

        const selectedCenter = new THREE.Vector3();
        selectedBox.getCenter(selectedCenter);

        const otherCenter = new THREE.Vector3();
        otherBox.getCenter(otherCenter);
        let movingRight, selectedX;

        // рассчёт первой коллизиии и зопоминаем позицию в момент коллизии

        if (side === "left") {
          //рассчёт по z
          console.log("z");
          movingRight = selectedCenter.z > otherCenter.z;

          console.log("movRig", movingRight);

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
          !this.firstCollision ||
          this.firstCollision.target.root.uuid !== model.root.uuid;

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
      } else {
        plannerConfig.isCollision = false;
      }
    }

    return false;
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
        let selectedY;
        const movingUp = testInstance.root.position.y < model.root.position.y;

        console.log("movingUpInCollis", movingUp);

        selectedY = movingUp
          ? model.root.position.y - testInstance.objectSize.y
          : model.root.position.y + model.objectSize.y;

        const isNewTarget =
          !this.firstCollisionInSector ||
          this.firstCollisionInSector.target.root.uuid !== model.root.uuid;

        if (isNewTarget) {
          this.firstCollisionInSector = {
            //   selected: otherBox.min.x - testInstance.objectSize.x / 2,
            selected: selectedY,

            other: model.root.position.clone(),
            target: model,
          };
          console.log(
            "обновил первое столкновение:",
            this.firstCollisionInSector
          );
        }
      }
    }
  }
}
