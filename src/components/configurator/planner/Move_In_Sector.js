import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { useMouseStore } from "../../../pinia/mouseStore";

export class MoveInSector {
  constructor(sceneSetup) {
    this.isMoving = false;
    this.objectSize = new THREE.Vector3();
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.raycaster = new THREE.Raycaster();
    this.offset = new THREE.Vector3();
    this.mouse = new THREE.Vector2();
    this.camera = this.sceneSetup.camera;
    this.kitchenStore = useKitchenSizesStore();
    this.mouseStore = useMouseStore();
    this.log = [];
  }

  set(intersect) {
    this.mouse.set(this.mouseStore.normalizedX, this.mouseStore.normalizedY);
    this.raycaster.setFromCamera(this.mouse, this.camera);
   
    const worldPos = new THREE.Vector3();
    plannerConfig.selectedInSector.root.getWorldPosition(worldPos);

    // Прибавляем половину высоты по Y
    const hitPoint = intersect.point.clone();
    const hitPointClone = hitPoint.clone();

    

    // Записываем в offset
    this.offset = worldPos.clone().sub(hitPoint);


    plannerConfig.selectedInSector.boxHelper.visible = true;

  }

  move() {
    this.mouse.set(this.mouseStore.normalizedX, this.mouseStore.normalizedY);
    this.raycaster.setFromCamera(this.mouse, this.camera);

 //   console.log("this.offset", this.offset);

    let intersects;
    if (plannerConfig.selectedSector.side === "direct") {
      intersects = this.raycaster.intersectObject(
        plannerConfig.directPlane2level
      );
    } else if (plannerConfig.selectedSector.side === "left") {
      intersects = this.raycaster.intersectObject(plannerConfig.leftPlane);
    }

    if (!intersects.length) return;

    const size = plannerConfig.selectedInSector.objectSize;
    const is900 = this.kitchenStore.modules_height.height2level == 0.9;
    // const minY = 1.41;
    // const maxY = is900 ? 2.31 - size.y : 2.11 - size.y;

        const height = plannerConfig.selectedInSector.height;

    const minY = 0;
    const maxY = is900 ? 0.9 - height : 0.7 - height;

    // мировая точка касания + offset
    
    const worldPoint = intersects[0].point.clone();
    const worldPointCopy = worldPoint.clone();

    // ограничение по Y
     worldPoint.y = THREE.MathUtils.clamp(worldPoint.y, minY, maxY);
    //worldPointCopy.z = 0.15;

    // переводим мировую точку в локальные координаты родителя
    const localPoint = plannerConfig.selectedInSector.root.parent.worldToLocal(worldPointCopy);
   
    localPoint.y += this.offset.y

    localPoint.y = THREE.MathUtils.clamp(localPoint.y, minY, maxY);




    // обновляем позицию
    plannerConfig.selectedInSector.root.position.y = localPoint.y;

    this.snapToNearby(
      plannerConfig.selectedInSector,
      plannerConfig.selectedObject.modules
    );
    this.sceneSetup.requestRender();
  }

  moveAround() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObject(
      plannerConfig.directPlane2level
    );

    if (intersects.length > 0) {
      const worldPoint = intersects[0].point.clone();
      plannerConfig.modelToGroup.position.copy(worldPoint);
      plannerConfig.modelToGroup.position.z = 0.15;

      this.sceneSetup.requestRender();
    }
  }

  snapToNearby(selectedObject, models) {
    const snapThreshold = 0.04;
    const unsnapDistance = 0.04;

    const selected = selectedObject;
    if (!selected) return;

    if (!selected.prevPosition) {
      selected.prevPosition = selected.root.position.clone();
    }

    const movedDistance = selected.root.position.distanceTo(
      selected.prevPosition
    );

    if (selected.wasSnapped && movedDistance > unsnapDistance) {
      selected.wasSnapped = false;
      return;
    }

    // Высота двигаемого объекта
    const movingBox = new THREE.Box3().setFromObject(selected.raycasterBox);
    const movingSize = new THREE.Vector3();
    movingBox.getSize(movingSize);
    const movingHeight = movingSize.y;

    for (let model of models) {
      if (model.root.uuid === selected.root.uuid) continue;

      // Высота статичного модуля
      const staticBox = new THREE.Box3().setFromObject(model.raycasterBox);
      const staticSize = new THREE.Vector3();
      staticBox.getSize(staticSize);
      const staticHeight = staticSize.y;

      const topOfStatic = model.root.position.y + staticHeight;
      const bottomOfMoving = selected.root.position.y;
      const topOfMoving = selected.root.position.y + movingHeight;
      const bottomOfStatic = model.root.position.y;

      // Прилипание "сверху" (ставим на модуль)
      const dy = Math.abs(topOfStatic - bottomOfMoving);
      if (dy < snapThreshold) {
        selected.root.position.y = topOfStatic;
        selected.wasSnapped = true;
        selected.prevPosition = selected.root.position.clone();
        return;
      }

      // Прилипание "снизу" (подвешиваем под модулем)
      const dy2 = Math.abs(topOfMoving - bottomOfStatic);
      if (dy2 < snapThreshold) {
        selected.root.position.y = bottomOfStatic - movingHeight;
        selected.wasSnapped = true;
        selected.prevPosition = selected.root.position.clone();
        return;
      }
    }

    selected.wasSnapped = false;
  }
}
