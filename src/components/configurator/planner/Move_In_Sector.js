import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { useMouseStore } from "../../../pinia/mouseStore";


export class MoveInSector {
  constructor(sceneSetup) {
    this.isMoving = false
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

  move() {
    this.mouse.set(this.mouseStore.normalizedX , this.mouseStore.normalizedY )
    const is900 = this.kitchenStore.modules_height.height2level == 0.9
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let intersects

    if(plannerConfig.selectedSector.side == 'direct'){
      intersects = this.raycaster.intersectObject(plannerConfig.directPlane2level);
    }

    

    if(plannerConfig.selectedSector.side == 'left'){
      intersects = this.raycaster.intersectObject(plannerConfig.leftPlane);
    }

    if (intersects.length > 0) {
      

      const size = plannerConfig.selectedInSector.objectSize;
    

      // const minX = bounds.min.x + halfSizeX;
      // const maxX = bounds.max.x - halfSizeX;
      // const minY = bounds.min.y ;
      // const maxY = bounds.max.y - size.y;

   
      const minY = 1.41 ;
      const maxY = is900? 2.31 - size.y :2.11 - size.y;

     // console.log('maxY', maxY)

      const worldPoint = intersects[0].point.clone();
    //  worldPoint.x = THREE.MathUtils.clamp(worldPoint.x, minX, maxX);
      worldPoint.y = THREE.MathUtils.clamp(worldPoint.y, minY, maxY);
      worldPoint.z = 0.15;

      const localPoint =
        plannerConfig.selectedInSector.root.parent.worldToLocal(worldPoint);
      plannerConfig.selectedInSector.root.position.y = localPoint.y

      this.snapToNearby(plannerConfig.selectedInSector, plannerConfig.selectedObject.modules);

      this.sceneSetup.requestRender();
    }
  }

  moveAround() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObject(
      plannerConfig.directPlane2level
    );

    if (intersects.length > 0) {
      const worldPoint = intersects[0].point.clone();
      plannerConfig.modelToGroup.position.copy(worldPoint);
      plannerConfig.modelToGroup.position.z = 0.15

      this.sceneSetup.requestRender();
    }
  }

  snapToNearby(selectedObject, models) {
    const snapThreshold = 0.06;
    const unsnapDistance = 0.06;
  
    const selected = selectedObject;
    if (!selected) return;
  
    if (!selected.prevPosition) {
      selected.prevPosition = selected.root.position.clone();
    }
  
    const movedDistance = selected.root.position.distanceTo(selected.prevPosition);
  
    if (selected.wasSnapped && movedDistance > unsnapDistance) {
      selected.wasSnapped = false;
      return;
    }
  
    const movingBox = new THREE.Box3().setFromObject(selected.raycasterBox);
    const movingCenter = new THREE.Vector3();
    movingBox.getCenter(movingCenter);
    const movingSize = new THREE.Vector3();
    movingBox.getSize(movingSize);
  
    for (let model of models) {
      if (model.root.uuid === selected.root.uuid) continue;
  
      const staticBox = new THREE.Box3().setFromObject(model.raycasterBox);
      const staticCenter = new THREE.Vector3();
      staticBox.getCenter(staticCenter);
      const staticSize = new THREE.Vector3();
      staticBox.getSize(staticSize);
  
      // По Z
   
  
      // По X (для глубины)
    
  
      // По Y (для вертикального прилипания)
      if (Math.abs(staticCenter.x - movingCenter.x) < snapThreshold &&
          Math.abs(staticCenter.z - movingCenter.z) < snapThreshold) {
        
        const dy = Math.abs(staticBox.max.y - movingBox.min.y);
        if (dy < snapThreshold) {
          selected.root.position.y = model.root.position.y + staticSize.y / 2 + movingSize.y / 2;
          selected.wasSnapped = true;
          selected.prevPosition = selected.root.position.clone();
          return;
        }
  
        const dy2 = Math.abs(movingBox.max.y - staticBox.min.y);
        if (dy2 < snapThreshold) {
          selected.root.position.y = model.root.position.y - staticSize.y / 2 - movingSize.y / 2;
          selected.wasSnapped = true;
          selected.prevPosition = selected.root.position.clone();
          return;
        }
      }
    }
  
    selected.wasSnapped = false;
  }
}
