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
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { lines } from "../../config/lines";
import { plannerConfig } from "../../configurator/planner/planerConfig";

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
    line.visible = showEmpty
    cabinetBuilder.value.sceneSetup.requestRender();
  });
  plannerConfig.iconsArray2L.forEach((line) => {
    line.visible = showEmpty
    cabinetBuilder.value.sceneSetup.requestRender();
  });
}

function toggleShadows() {
  console.log("123");
}
</script>
