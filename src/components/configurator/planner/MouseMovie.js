import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { useMouseStore } from "../../../pinia/mouseStore";
import { usePlannerStore } from "../../../pinia/PlannerStore";

export class MouseMove {
  constructor(sceneSetup) {
    this.sceneSetup = sceneSetup;
    this.camera = sceneSetup.camera;
    this.raycaster = new THREE.Raycaster();
    this.mouseStore = useMouseStore();
    this.mouse = new THREE.Vector2();
    this.moduleID;
    this.plannerStore = usePlannerStore();
  }

  showControls() {
    if(this.plannerStore.movingModule) return
    
    // Set the raycaster based on the mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Find the objects that the raycaster intersects
    const intersectsModules = this.raycaster.intersectObjects(
      plannerConfig.models.map((m) => m.raycasterBox),
      false
    );

    if (intersectsModules.length > 0) {
      // Get the ID of the module the mouse is hovering over
      const id = intersectsModules[0].object.userData.id;

      // If the module ID is different, hide controls of the previous module
      if (this.plannerStore.hoveredModuleID) {
        if (this.plannerStore.hoveredModuleID !== id) {
          const lastModule = plannerConfig.models.find(
            (m) => m.id === this.plannerStore.hoveredModuleID
          );
          lastModule.controls.forEach((item) => {
            item.visible = false;
          });
        }
      }

      // Set the new module ID
      this.plannerStore.hoveredModuleID = id;
      //  console.log("id", id);

      // Find the module by its ID and show its controls
      const module = plannerConfig.models.find((m) => m.id === id);
      //   console.log("module", module);

      module.controls.forEach((item) => {
        item.visible = true;
      });

      const intersectsControls = this.raycaster.intersectObjects(
        module.controls,
        false
      );

      // пересечение с кнопоками управления
   if (intersectsControls.length > 0) {
  const btn = intersectsControls[0].object;
  const name = btn.name;

  // Позиция подсказки
  const worldPos = new THREE.Vector3();
  btn.getWorldPosition(worldPos);
  const screenPos = worldPos.clone().project(this.camera);
  const canvas = this.sceneSetup.renderer.domElement;

  this.plannerStore.controls.position.x = Math.round((screenPos.x * 0.5 + 0.5) * canvas.clientWidth);
  this.plannerStore.controls.position.y = Math.round((-screenPos.y * 0.5 + 0.5) * canvas.clientHeight);
  this.plannerStore.controls.title = btn.userData.name;
  this.plannerStore.controls.show = true;

  this.sceneSetup.renderer.domElement.style.cursor = "pointer";

  // Hover
  module.controls.forEach(b => {
    const bName = b.name;
    if (b === btn) {
      if (b.userData.state !== "hover") {
        b.material.map = module.controlTextures[bName].hover;
        b.material.needsUpdate = true;
        b.userData.state = "hover";
      }
    } else {
      // Все остальные кнопки возвращаем в normal
      if (b.userData.state !== "normal") {
        b.material.map = module.controlTextures[bName].normal;
        b.material.needsUpdate = true;
        b.userData.state = "normal";
      }
    }
  });

} else {
  // Мышь не над кнопками → сброс всех кнопок в normal
  this.sceneSetup.renderer.domElement.style.cursor = "default";
  this.plannerStore.controls.show = false;

  module.controls.forEach(btn => {
    const name = btn.name;
    if (btn.userData.state !== "normal") {
      btn.material.map = module.controlTextures[name].normal;
      btn.material.needsUpdate = true;
      btn.userData.state = "normal";
    }
  });
}

    } else {
      // If no module is being intersected, hide the controls of the previous module
      if (this.plannerStore.hoveredModuleID) {
        const module = plannerConfig.models.find(
          (m) => m.id === this.plannerStore.hoveredModuleID
        );
        module.controls.forEach((item) => {
          item.visible = false; // Hide controls when mouse leaves
        });

        this.plannerStore.hoveredModuleID = null; // Clear the stored module ID
        this.plannerStore.controls.show = false;
      }
    }
  }

  epmtyBoxesMouseOver() {
    this.mouse.set(this.mouseStore.normalizedX, this.mouseStore.normalizedY);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsControls = this.raycaster.intersectObjects(
      plannerConfig.iconsArray1L,
      true
    );

    if (intersectsControls.length > 0) {
      document.body.style.cursor = "pointer"; //  "pointer" как на кнопках
    } else {
      document.body.style.cursor = "default";
    }
  }

  epmtyBoxesMouseOver2() {
    this.mouse.set(this.mouseStore.normalizedX, this.mouseStore.normalizedY);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsControls = this.raycaster.intersectObjects(
      plannerConfig.iconsArray2L,
      true
    );

    if (intersectsControls.length > 0) {
      document.body.style.cursor = "pointer"; //  "pointer" как на кнопках
    } else {
      document.body.style.cursor = "default";
    }
  }

  epmtySectorOver() {
    this.mouse.set(this.mouseStore.normalizedX, this.mouseStore.normalizedY);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsEmpties2L = this.raycaster.intersectObjects(
      plannerConfig.selectedObject.empties,
      false
    );

    let found = false;
    if (intersectsEmpties2L.length > 0) {
      const obj = intersectsEmpties2L[0].object;
      if (this.hoveredObject !== obj) {
        if (this.hoveredObject) {
          this.hoveredObject.material.opacity = 0.0;
          this.hoveredObject.material.color.set(0x00ff00);
          this.hoveredObject.children[0].visible = false;
        }
        this.hoveredObject = obj;
        this.hoveredObject.material.opacity = 0.5;
        this.hoveredObject.material.color.set(0xffff00);
        this.hoveredObject.children[0].visible = true;
      }
      found = true;
    }

    if (!found && this.hoveredObject) {
      this.hoveredObject.children[0].visible = false;
      this.hoveredObject.material.opacity = 0.0;
      this.hoveredObject.material.color.set(0x00ff00);
      this.hoveredObject = null;
    }
  }

  showPointer() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectsControls = this.raycaster.intersectObjects(
      plannerConfig.selectedObject.controls,
      false
    );

    if (intersectsControls.length > 0) {
      document.body.style.cursor = "pointer"; //  "pointer" как на кнопках
    } else {
      document.body.style.cursor = "default";
    }
  }

  show() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersectsModules = this.raycaster.intersectObjects(
      plannerConfig.models.map((m) => m.raycasterBox),
      false
    );
    if (intersectsModules.length > 0) {
      //   console.log("intersectModule", intersectsModules[0].object);
      if (
        this.object &&
        intersectsModules[0].object.userData.controller.root.uuid !==
          this.object.root.uuid
      ) {
        this.object.controls.forEach((elem) => (elem.visible = false));
        this.object = intersectsModules[0].object.userData.controller;
        this.object.controls.forEach((elem) => (elem.visible = true));
      }
      this.object = intersectsModules[0].object.userData.controller;
      this.object.controls.forEach((elem) => (elem.visible = true));
      plannerConfig.selectedObject = this.object;
      this.setSelectObjectSettings(this.object);
    } else {
      if (this.object) {
        this.object.controls.forEach((elem) => (elem.visible = false));
        this.clearSettings();
      }
    }

    this.sceneSetup.requestRender();
  }

  // epmtyBoxesMouseOver2() {
  //   this.raycaster.setFromCamera(this.mouse, this.camera);
  //   const intersectsEmpties2L = this.raycaster.intersectObjects(
  //   [...plannerConfig.empties2levelDirect, ...plannerConfig.empties2levelLeft],
  //   false
  // );

  // let found = false;
  //     if (intersectsEmpties2L.length > 0) {
  //         const obj = intersectsEmpties2L[0].object;
  //         if (this.hoveredObject !== obj) {
  //             if (this.hoveredObject) {
  //                 this.hoveredObject.material.opacity = 0.0;
  //                 this.hoveredObject.material.color.set(0x00ff00);
  //                 this.hoveredObject.children[0].visible = false
  //             }
  //             this.hoveredObject = obj;
  //             this.hoveredObject.material.opacity = 0.5;
  //             this.hoveredObject.material.color.set(0xffff00);
  //             this.hoveredObject.children[0].visible = true

  //         }
  //         found = true;
  //     }

  //     if (!found && this.hoveredObject) {
  //       this.hoveredObject.children[0].visible = false
  //         this.hoveredObject.material.opacity = 0.0;
  //         this.hoveredObject.material.color.set(0x00ff00);
  //         this.hoveredObject = null;

  //     }
  // }

  // epmtyBoxesMouseOver() {

  //   this.raycaster.setFromCamera(this.mouse, this.camera);
  //   const intersectsControls = this.raycaster.intersectObjects(
  //      [...plannerConfig.boxesArrayDirect, ...plannerConfig.boxesArrayLeft],
  //     false
  //   );

  //   let found = false;
  //     if (intersectsControls.length > 0) {
  //         const obj = intersectsControls[0].object;
  //        // console.log(obj)
  //         if (this.hoveredObject1level !== obj) {
  //             if (this.hoveredObject1level) {
  //                 this.hoveredObject1level.material.opacity = 0.0;
  //                 this.hoveredObject1level.material.color.set(0x00ff00);
  //                 this.hoveredObject1level.children[0].visible = false

  //             }
  //             this.hoveredObject1level = obj;
  //             this.hoveredObject1level.material.opacity = 0.5;
  //             this.hoveredObject1level.material.color.set(0xffff00);
  //             this.hoveredObject1level.children[0].visible = true

  //         }
  //         found = true;
  //     }

  //     if (!found && this.hoveredObject1level) {
  //       this.hoveredObject1level.children[0].visible = false

  //         this.hoveredObject1level.material.opacity = 0.0;
  //         this.hoveredObject1level.material.color.set(0x00ff00);
  //         this.hoveredObject1level = null;

  //     }
  // }
}
