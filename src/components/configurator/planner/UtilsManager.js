
import { plannerConfig } from "./planerConfig";
import { ModelInstanse } from "./ModelInstanse";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";

export class UtilsManager {
  constructor(sceneSetup, loaderModels) {
    this.scene = sceneSetup.scene;
    this.sceneSetup = sceneSetup;
    this.loaderModels = loaderModels
    this.selectedObject = false;
    this.plannerStore = usePlannerStore()
    this.kitchenSizesStore - useKitchenSizesStore()
  }


  // рассчёт какой ряд до угла
calcCornerModules() {
  const leftModules = plannerConfig.modelsLeft2L;
  const directModules = plannerConfig.modelsDirect2L;

  if (!leftModules.length && !directModules.length) {
    plannerConfig.isAngleRow2L = 'none';
    return;
  }

  if (!leftModules.length) {
    const firstDirect = directModules.slice().sort((a, b) => a.root.position.z - b.root.position.z)[0];
    const directEdge = firstDirect.root.position.x - firstDirect.objectSize.x / 2;
    plannerConfig.isAngleRow2L = directEdge < 0.3 ? 'direct' : 'none';
    return;
  }

  if (!directModules.length) {
    const firstLeft = leftModules.slice().sort((a, b) => a.root.position.z - b.root.position.z)[0];
    const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;
    plannerConfig.isAngleRow2L = leftEdge < 0.3 ? 'left' : 'none';
    return;
  }

  // Если есть оба ряда
  const firstLeft = leftModules.slice().sort((a, b) => a.root.position.z - b.root.position.z)[0];
  const firstDirect = directModules.slice().sort((a, b) => a.root.position.z - b.root.position.z)[0];

  const directEdge = firstDirect.root.position.x - firstDirect.objectSize.x / 2;
  const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;

  if (directEdge < 0.29) {
    plannerConfig.isAngleRow2L = 'direct';
  } else if (leftEdge < 0.29) {
    plannerConfig.isAngleRow2L = 'left';
  } else {
    plannerConfig.isAngleRow2L = 'none';
  }
}

calcCornerModules2L() {
  const leftModules = plannerConfig.modelsLeft;
  const directModules = plannerConfig.modelsDirect;

  if (!leftModules.length && !directModules.length) {
    plannerConfig.isAngleRow2L = 'none';
    return;
  }

  if (!leftModules.length) {
    const firstDirect = directModules.slice().sort((a, b) => a.root.position.z - b.root.position.z)[0];
    const directEdge = firstDirect.root.position.x - firstDirect.objectSize.x / 2;
    plannerConfig.isAngleRow = directEdge < 0.6 ? 'direct' : 'none';
    return;
  }

  if (!directModules.length) {
    const firstLeft = leftModules.slice().sort((a, b) => a.root.position.z - b.root.position.z)[0];
    const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;
    plannerConfig.isAngleRow = leftEdge < 0.6 ? 'left' : 'none';
    return;
  }

  // Если есть оба ряда
  const firstLeft = leftModules.slice().sort((a, b) => a.root.position.z - b.root.position.z)[0];
  const firstDirect = directModules.slice().sort((a, b) => a.root.position.x - b.root.position.x)[0];

  const directEdge = firstDirect.root.position.x - firstDirect.objectSize.x / 2;
  const leftEdge = firstLeft.root.position.z - firstLeft.objectSize.x / 2;

  if (directEdge < 0.59) {
    plannerConfig.isAngleRow = 'direct';
  } else if (leftEdge < 0.59) {
    plannerConfig.isAngleRow = 'left';
  } else {
    plannerConfig.isAngleRow = 'none';
  }
}

createSlots(){
  plannerConfig.modelsDirect.sort((a,b) => a.root.position.x - b.root.position.x)

  plannerConfig.modelsDirect.forEach((model, index)=>{
    model.slot = index
  })

  
}
 

}