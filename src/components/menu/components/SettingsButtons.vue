<template>
      <!-- <div
    class="fixed top-4 left-[5vh] w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"
    @click="showLines()"
    title="Показать / скрыть линии"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 8h16M4 16h16"
      />
    </svg>
  </div>

 

  <div
    class="fixed top-4 left-[10vh] w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"
    @click="toggleShadows"
    title="Вкл / Выкл тени"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 3l18 18M4 4h16v16H4V4z"
      />
    </svg>
  </div> -->
</template>

<script setup>
import { lines } from '../../config/lines';

function showLines() {
  showLinesVisible = !showLinesVisible;
  lines.forEach((line) => {
    line.visible = showLinesVisible;
    cabinetBuilder.value.sceneSetup.requestRender();
  });
}

function toggleShadows() {
  console.log("123");
}
</script>