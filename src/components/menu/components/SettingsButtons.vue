<template>
  <div class="flex flex-column fixed top-4 left-[10vh]">
    <div
      class="w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"
      @click="showLines()"
      title="Показать / скрыть линии"
    ></div>

    <div
      class="w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"
      @click="toggleShadows"
      title="Вкл / Выкл тени"
    ></div>

    <div
      class="w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"
      @click="showEmptises"
      title="Вкл / Выкл добав"
    ></div>
    <div
      class="w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"
      @click="moveCamera"
      title="Вкл / Выкл добав"
    ></div>
  </div>
</template>

<script setup>
import { Vector3 } from "three";
import { ref, computed, inject } from "vue";
import { lines } from "../../config/lines";
import { plannerConfig } from "../../configurator/planner/planerConfig";
import { mod } from "three/tsl";

const cabinetBuilder = inject("cabinetBuilder");

let showLinesVisible = ref(true);
let showEmpty = ref(true);

function showLines() {
  showLinesVisible = !showLinesVisible;
  lines.forEach((line) => {
    line.visible = showLinesVisible;
    cabinetBuilder.value.sceneSetup.requestRender();
  });
}

function showEmptises() {
  showEmpty = !showEmpty;
  plannerConfig.iconsArray1L.forEach((line) => {
    line.visible = showEmpty;
    cabinetBuilder.value.sceneSetup.requestRender();
  });
  plannerConfig.iconsArray2L.forEach((line) => {
    line.visible = showEmpty;
    cabinetBuilder.value.sceneSetup.requestRender();
  });
}

function moveCamera() {
  //  this.camera.position.set(4, 5, 6);
  //  let targetPosition = new THREE.Vector3(2, 0, 0);
  //  this.camera.lookAt(targetPosition);
  //  this.controls.target.copy(targetPosition);

  cabinetBuilder.value.sceneSetup.moveCameraTo(
    new Vector3(7, 4, 7),
    new Vector3(1.5, 1, 0),
    1.5,
    () => {}
  );
}

let isShadowOn = false;

function toggleShadows() {
  const models = [
    ...plannerConfig.modelsDirect2L,
    ...plannerConfig.modelsLeft2L,
  ];
  isShadowOn = !isShadowOn;
  console.log(isShadowOn);

  if (isShadowOn) {
    models.forEach((model) => {
      model.root.traverse((child) => {
        if (child.isMesh) {
          if (child.name.toLowerCase().includes("glass")) return;
        
            child.castShadow = true;
            child.receiveShadow = false;
          


        }
      });
    });
  } else {
        models.forEach((model) => {
      model.root.traverse((child) => {
        if (child.isMesh) {
          if (child.name.toLowerCase().includes("glass")) return;
         
            child.castShadow = false;
            child.receiveShadow = false;
          


        }
      });
    });
  }

    cabinetBuilder.value.sceneSetup.requestRender();
  

  console.log("123");
}
</script>
