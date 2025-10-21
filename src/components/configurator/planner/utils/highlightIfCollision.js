import * as THREE from "three";
import { plannerConfig } from "../planerConfig";

//import { models } from "../../utils.js/models";



function highlightWithBoxHelper(object, isHighlighted, scene) {
  if (isHighlighted) {
    if (!object.userData.helper) {
      const boxHelper = new THREE.BoxHelper(object, 0xff0000);
      boxHelper.name = 'collisionHelper';
      scene.add(boxHelper);
      object.userData.helper = boxHelper;
    }

    // Обновляем BoxHelper каждый раз, чтобы он соответствовал объекту
    object.userData.helper.update();
    object.userData.helper.visible = true;
    object.userData.helper.material.color.set(0xff0000);
  } else if (object.userData.helper) {
    object.userData.helper.visible = false;
  }
}

export function highlightIfCollision(selectedObject, scene, models) {
  const selected = selectedObject;
  if (!selected) return;

  const selectedBox = new THREE.Box3().setFromObject(selected.raycasterBox);
  let hasCollision = false;

  for (let model of models) {
    if (model.root.uuid === selected.root.uuid) continue;

    const otherBox = new THREE.Box3().setFromObject(model.raycasterBox);
    if (selectedBox.intersectsBox(otherBox)) {
      hasCollision = true;
      console.log('колизия')

      // Только если еще не была сохранена позиция — сохраняем
      if (!plannerConfig.oldPosition) {
        plannerConfig.oldPosition = selected.root.position.clone();
        console.log('Сохраняем позицию перед коллизией:', plannerConfig.oldPosition);
      }

      plannerConfig.isCollision = true;
      break;
    }
  }

  // Если коллизии нет, сбрасываем флаг и предыдущую позицию
  if (!hasCollision) {
    plannerConfig.isCollision = false;
    plannerConfig.oldPosition = null;
  }

 // highlightWithBoxHelper(selected.raycasterBox, hasCollision, scene);
}
