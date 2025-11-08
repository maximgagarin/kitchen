<template>
  <div>
    <label
      for="selectedOven"
      class="block text-xs font-medium text-gray-700 mb-1"
      >Столешница:</label
    >
    <select
      id="selectedOven"
      class="w-30 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
      @change="change"
      v-model="selected"
    >
      <!-- <option value="0">нет</option>  -->
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { plannerConfig } from "../../configurator/planner/planerConfig";
import { materialManager } from "../../configurator/MaterialManager";

const plannerManager = inject("plannerManager");

const selected = ref(0);

function change() {
    console.log(selected.value)
  if (selected.value == 2) {
    plannerConfig.tabletops.forEach((item) => {
        console.log(item)
      const width = item.userData.width;
      const side = item.userData.side === 'x' ? "x" : "z";
      item.material = materialManager.setTexture2(width, side);
    });
  }
  plannerManager.value.sceneSetup.requestRender()
}
</script>
