import * as THREE from "three";
//import { models } from "../../utils.js/models";



export function snapToNearby(selectedObject, models) {
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
    if (Math.abs(staticCenter.z - movingCenter.z) < snapThreshold) {
      const dx = Math.abs(staticBox.max.x - movingBox.min.x);
      if (dx < snapThreshold) {
        selected.root.position.x = model.root.position.x + staticSize.x / 2 + movingSize.x / 2;
        selected.wasSnapped = true;
        selected.prevPosition = selected.root.position.clone();
        return;
      }

      const dx2 = Math.abs(movingBox.max.x - staticBox.min.x);
      if (dx2 < snapThreshold) {
        selected.root.position.x = model.root.position.x - staticSize.x / 2 - movingSize.x / 2;
        selected.wasSnapped = true;
        selected.prevPosition = selected.root.position.clone();
        return;
      }
    }

    // По X (для глубины)
    if (Math.abs(staticCenter.x - movingCenter.x) < snapThreshold) {
      const dz = Math.abs(staticBox.max.z - movingBox.min.z);
      if (dz < snapThreshold) {
        selected.root.position.z = model.root.position.z + staticSize.z / 2 + movingSize.z / 2;
        selected.wasSnapped = true;
        selected.prevPosition = selected.root.position.clone();
        return;
      }

      const dz2 = Math.abs(movingBox.max.z - staticBox.min.z);
      if (dz2 < snapThreshold) {
        selected.root.position.z = model.root.position.z - staticSize.z / 2 - movingSize.z / 2;
        selected.wasSnapped = true;
        selected.prevPosition = selected.root.position.clone();
        return;
      }
    }

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
