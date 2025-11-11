import * as THREE from "three";
import { plannerConfig } from "./planerConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { useMouseStore } from "../../../pinia/mouseStore";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { controlsTextures } from "./controlsTextures";

export class MouseMove {
  constructor(sceneSetup) {
    this.sceneSetup = sceneSetup;
    this.camera = sceneSetup.camera;
    this.raycaster = new THREE.Raycaster();
    this.mouseStore = useMouseStore();
    this.mouse = new THREE.Vector2();
    this.moduleID;
    this.plannerStore = usePlannerStore();
    this.emptyBox = null
    this.emptyBoxInSector = null
  }




  showControls() {
    if (this.plannerStore.movingModule) return; // если движение модуля — выход

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Проверяем пересечение с основными модулями
    const intersectsModules = this.raycaster.intersectObjects(
      plannerConfig.models.map((m) => m.raycasterBox),
      false
    );

    console.log('mouse', this.mouse)



    if (intersectsModules.length > 0) {
      const id = intersectsModules[0].object.userData.id;

      // Если навели на другой модуль — сбрасываем предыдущий
      if (this.plannerStore.hoveredModuleID &&  this.plannerStore.hoveredModuleID !== id   ) {
        const lastModule = plannerConfig.models.find(
          (m) => m.id === this.plannerStore.hoveredModuleID
        );
        if (lastModule) {
          lastModule.controls.forEach((item) => (item.visible = false));
          if (lastModule.name === "sector") {
            lastModule.modules.forEach((model) => {
              model.centerControl.visible = false;
              model.centerControl.userData.state = "normal";
            });
          }
        }
      }

      this.plannerStore.hoveredModuleID = id;
      const module = plannerConfig.models.find((m) => m.id === id);
      if (!module) return;

      // ====== Обработка SECTOR ======
      if (module.name === "sector") {

        // this.boxesInSectorOver2(module)

        module.modules.forEach(item=>{
          item.centerControl.visible = true
        })

        const intersectsSubModules = this.raycaster.intersectObjects(
          module.modules.map((m) => m.raycasterBox),
          false
        );

        if (intersectsSubModules.length > 0) {
          const hoveredSubId = intersectsSubModules[0].object.userData.id;
          const model = module.modules.find((m) => m.id == hoveredSubId);

         //  model.centerControl.visible = true

      //    console.log('model', model)


          // пересечение с кнопкой centerControl
          const intersectControls = this.raycaster.intersectObject(model.centerControl,   false  );
          if(intersectControls.length > 0){
            const control = intersectControls[0].object

            if (control.userData.state !== "hover") {
              control.material.map = controlsTextures.inSector.hover;
              control.material.needsUpdate = true;
              control.userData.state = "hover";
            }

          } else {
            model.centerControl.material.map = controlsTextures.inSector.normal;
            model.centerControl.material.needsUpdate = true;
            model.centerControl.userData.state = "normal";
          }

         
        }
      }

     

      // ====== Отображение контролов модуля ======
      module.controls.forEach((item) => (item.visible = true));

      // ====== Проверка пересечения с кнопками управления ======
      const intersectsControls = this.raycaster.intersectObjects(
        module.controls,
        false
      );
      if (intersectsControls.length > 0) {
        const btn = intersectsControls[0].object;
        const name = btn.name;

        // Позиция подсказки
        const worldPos = new THREE.Vector3();
        btn.getWorldPosition(worldPos);
        const screenPos = worldPos.clone().project(this.camera);
        const canvas = this.sceneSetup.renderer.domElement;

        this.plannerStore.controls.position.x = Math.round(
          (screenPos.x * 0.5 + 0.5) * canvas.clientWidth
        );
        this.plannerStore.controls.position.y = Math.round(
          (-screenPos.y * 0.5 + 0.5) * canvas.clientHeight
        );
        this.plannerStore.controls.title = btn.userData.name;
        this.plannerStore.controls.show = true;

        this.sceneSetup.renderer.domElement.style.cursor = "pointer";

        // Hover эффект для кнопок управления
        module.controls.forEach((b) => {
          const bName = b.name;
          if (b === btn) {
            if (b.userData.state !== "hover") {
              b.material.map = controlsTextures[bName].hover;
              b.material.needsUpdate = true;
              b.userData.state = "hover";
            }
          } else if (b.userData.state !== "normal") {
            b.material.map = controlsTextures[bName].normal;
            b.material.needsUpdate = true;
            b.userData.state = "normal";
          }
        });
      } else {
        // Мышь не над кнопками
        this.sceneSetup.renderer.domElement.style.cursor = "default";
        this.plannerStore.controls.show = false;
        module.controls.forEach((btn) => {
          const name = btn.name;
          if (btn.userData.state !== "normal") {
            btn.material.map = controlsTextures[name].normal;
            btn.material.needsUpdate = true;
            btn.userData.state = "normal";
          }
        });
      }
    } else {
      // Мышь ушла со всех модулей — скрываем всё
      if (this.plannerStore.hoveredModuleID) {
        const module = plannerConfig.models.find(
          (m) => m.id === this.plannerStore.hoveredModuleID
        );
        if (module) {
          module.controls.forEach((item) => (item.visible = false));

          if (module.name === "sector") {
            module.modules.forEach((model) => {
              const name = model.centerControl.name;
              model.centerControl.visible = false;
              model.centerControl.userData.state = "normal";
              model.centerControl.material.map = controlsTextures[name].normal;
            });
          }
        }

        this.plannerStore.hoveredModuleID = null;
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



  epmtyBoxesOver() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(plannerConfig.empties1level, false);

    
    if (intersects.length > 0) {
      const obj = intersects[0].object;

      // если навели на другой бокс — сбросить прошлый
      if (this.emptyBox && this.emptyBox !== obj) {
        this.emptyBox.material.opacity = 0;
          this.plannerStore.controls.show = false;


      }

      this.emptyBox = obj;
      this.emptyBox.material.opacity = 0.2;

      const worldPos = new THREE.Vector3();
      this.emptyBox.getWorldPosition(worldPos);


      const screenPos = worldPos.clone().project(this.camera);
      const canvas = this.sceneSetup.renderer.domElement;

      this.plannerStore.controls.position.x = Math.round(
        (screenPos.x * 0.5 + 0.5) * canvas.clientWidth
      );
      this.plannerStore.controls.position.y = Math.round(
        (-screenPos.y * 0.5 + 0.5) * canvas.clientHeight
      );
      this.plannerStore.controls.title = 'вставить модуль';
      this.plannerStore.controls.show = true;


    } else if (this.emptyBox) {
      // если ушли со всех боксов — вернуть норму
      this.emptyBox.material.opacity = 0;
          this.plannerStore.controls.show = false;


      this.emptyBox = null;
    }
  }


  epmtyBoxesOver2() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(plannerConfig.empties2level, false);

    
    if (intersects.length > 0) {
      const obj = intersects[0].object;

      // если навели на другой бокс — сбросить прошлый
      if (this.emptyBox && this.emptyBox !== obj) {
        this.emptyBox.material.opacity = 0;
          this.plannerStore.controls.show = false;


      }

      this.emptyBox = obj;
      this.emptyBox.material.opacity = 0.2;

      const worldPos = new THREE.Vector3();
      this.emptyBox.getWorldPosition(worldPos);


      const screenPos = worldPos.clone().project(this.camera);
      const canvas = this.sceneSetup.renderer.domElement;

      this.plannerStore.controls.position.x = Math.round(
        (screenPos.x * 0.5 + 0.5) * canvas.clientWidth
      );
      this.plannerStore.controls.position.y = Math.round(
        (-screenPos.y * 0.5 + 0.5) * canvas.clientHeight
      );
      this.plannerStore.controls.title = 'вставить модуль';
      this.plannerStore.controls.show = true;


    } else if (this.emptyBox) {
      // если ушли со всех боксов — вернуть норму
      this.emptyBox.material.opacity = 0;
          this.plannerStore.controls.show = false;


      this.emptyBox = null;
    }
  }

  boxesInSectorOver() {

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(plannerConfig.selectedObject.empties, false);
   

    if (intersects.length > 0) {
      const obj = intersects[0].object;

      // если навели на другой бокс — сбросить прошлый
      if (this.emptyBoxInSector && this.emptyBoxInSector !== obj) {
        this.emptyBoxInSector.material.opacity = 0;
          this.plannerStore.controls.show = false;


      }

      this.emptyBoxInSector = obj;
      this.emptyBoxInSector.material.opacity = 0.2;

      const worldPos = new THREE.Vector3();
      this.emptyBoxInSector.getWorldPosition(worldPos);


      const screenPos = worldPos.clone().project(this.camera);
      const canvas = this.sceneSetup.renderer.domElement;

      this.plannerStore.controls.position.x = Math.round(
        (screenPos.x * 0.5 + 0.5) * canvas.clientWidth
      );
      this.plannerStore.controls.position.y = Math.round(
        (-screenPos.y * 0.5 + 0.5) * canvas.clientHeight
      );
      this.plannerStore.controls.title = 'вставить модуль';
      this.plannerStore.controls.show = true;


    } else if (this.emptyBoxInSector) {
      // если ушли со всех боксов — вернуть норму
      this.emptyBoxInSector.material.opacity = 0;
          this.plannerStore.controls.show = false;


      this.emptyBoxInSector = null;
    }
  }


    boxesInSectorOver2(model) {

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(model.empties, false);
   

    if (intersects.length > 0) {
      const obj = intersects[0].object;

      // если навели на другой бокс — сбросить прошлый
      if (this.emptyBoxInSector && this.emptyBoxInSector !== obj) {
        this.emptyBoxInSector.material.opacity = 0;
          this.plannerStore.controls.show = false;


      }

      this.emptyBoxInSector = obj;
      this.emptyBoxInSector.material.opacity = 0.2;

      const worldPos = new THREE.Vector3();
      this.emptyBoxInSector.getWorldPosition(worldPos);


      const screenPos = worldPos.clone().project(this.camera);
      const canvas = this.sceneSetup.renderer.domElement;

      this.plannerStore.controls.position.x = Math.round(
        (screenPos.x * 0.5 + 0.5) * canvas.clientWidth
      );
      this.plannerStore.controls.position.y = Math.round(
        (-screenPos.y * 0.5 + 0.5) * canvas.clientHeight
      );
      this.plannerStore.controls.title = 'вставить модуль';
      this.plannerStore.controls.show = true;


    } else if (this.emptyBoxInSector) {
      // если ушли со всех боксов — вернуть норму
      this.emptyBoxInSector.material.opacity = 0;
          this.plannerStore.controls.show = false;


      this.emptyBoxInSector = null;
    }
  }

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
