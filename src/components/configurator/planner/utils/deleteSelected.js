import { plannerConfig } from "../planerConfig";

export function deleteSelected(scene) {
    const obj = plannerConfig.selectedObject;
    const side = plannerConfig.selectedObject.side;
  //  console.log(side);

    if (!obj || !obj.root) return;

    // Удаление из сцены
    scene.remove(obj.root);

    // Рекурсивно очищаем ресурсы (геометрию, материалы)
    obj.root.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      // if (child.material) {
      //   if (Array.isArray(child.material)) {
      //     child.material.forEach((m) => m.dispose());
      //   } else {
      //     child.material.dispose();
      //   }
      // }
      // if (child.texture) {
      //   child.texture.dispose();
      // }
    });

    // Удаление из массива models

    const index = plannerConfig.models.findIndex((m) => m.root.uuid === obj.root.uuid);
    if (index !== -1) {
      plannerConfig.models.splice(index, 1);
    }
 //   console.log("models", plannerConfig.models);
    // Удаление из массива modelsDirect

    if (side == "direct") {
      const index2 = plannerConfig.modelsDirect.findIndex(
        (m) => m.root.uuid === obj.root.uuid
      );
      if (index2 !== -1) {
        plannerConfig.modelsDirect.splice(index2, 1);
      }
    }

    if (side == "left") {
    //  console.log("goooo");
      const index2 = plannerConfig.modelsLeft.findIndex((m) => m.root.uuid === obj.root.uuid);
      if (index2 !== -1) {
        plannerConfig.modelsLeft.splice(index2, 1);
      }
    }


    plannerConfig.objectControls.length = 0;

    plannerConfig.selectedObject = false;
    this.plannerStore.selectedObject.isSelect = false;
    this.plannerStore.selectedObject.name = "";

     console.log('models', plannerConfig.models)
    console.log('modelsDirect', plannerConfig.modelsDirect)

    //создание пустых боксов в пустоте
    this.emptyManager.calculateEmpties()

    if(this.kitchenSizesStore.type == 'left'){
      this.emptyManager.calculateEmptiesLeft()
    }
    
   

    this.sceneSetup.requestRender();
  }
