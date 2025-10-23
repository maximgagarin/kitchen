<template>
  <div class="space-y-6 p-1 max-w-3xl mx-auto">
    <h3 class="text-base font-medium text-gray-800">Выберите форму кухни</h3>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Прямая кухня -->
      <label
        for="direct"
        class="relative border-2 w-20 rounded-lg p-1 cursor-pointer transition-all duration-200"
        :class="{
          'border-gray-300 hover:border-gray-400':
            kitchenSizesStore.type !== 'direct',
          'border-blue-500 ring-2 ring-blue-200':
            kitchenSizesStore.type === 'direct',
        }"
      >
        <input
          type="radio"
          id="direct"
          name="kitchen_type"
          value="direct"
          v-model="kitchenSizesStore.type"
          @change="updateConfig"
          class="absolute opacity-0"
        />
        <div class="flex flex-col items-center space-y-2">
          <img
            src="/img/button/1.jpg"
            alt="Прямая кухня"
            class="w-16 h-16 object-cover rounded-md"
          />
          <span class="text-xs font-medium text-gray-700">Прямая</span>
        </div>
      </label>

      <!-- Угловая кухня -->
      <label
        for="left"
        class="relative border-2 w-20 rounded-lg p-1 cursor-pointer transition-all duration-200"
        :class="{
          'border-gray-300 hover:border-gray-400':
            kitchenSizesStore.type !== 'left',
          'border-blue-500 ring-2 ring-blue-200':
            kitchenSizesStore.type === 'left',
        }"
      >
        <input
          type="radio"
          id="left"
          name="kitchen_type"
          value="left"
          v-model="kitchenSizesStore.type"
          @change="updateConfig"
          class="absolute opacity-0"
        />
        <div class="flex flex-col items-center space-y-2">
          <img
            src="/img/button/2.jpg"
            alt="Угловая кухня"
            class="w-16 h-16 object-cover rounded-md"
          />
          <span class="text-xs font-medium text-gray-700">Угловая</span>
        </div>
      </label>

      <!-- П-образная кухня -->
      <!-- <label
        for="uShaped"
        class="relative border-2 w-20 rounded-lg p-1 cursor-pointer transition-all duration-200"
        :class="{
          'border-gray-300 hover:border-gray-400':
            kitchenSizesStore.type !== 'uShaped',
          'border-blue-500 ring-2 ring-blue-200':
            kitchenSizesStore.type === 'uShaped',
        }"
      >
        <input
          type="radio"
          id="uShaped"
          name="kitchen_type"
          value="uShaped"
          v-model="kitchenSizesStore.type"
          @change="updateConfig"
          class="absolute opacity-0"
        />
        <div class="flex flex-col items-center space-y-2">
          <img
            src="/img/button/4.jpg"
            alt="П-образная кухня"
            class="w-16 h-16 object-cover rounded-md"
          />
          <span class="text-xs font-medium text-gray-700">П-образная</span>
        </div>
      </label> -->
    </div>

    <div class="mt-8">
      <SetSize />
    </div>
  </div>
</template>

<script setup>
import * as XLSX from "xlsx";
import { ref, inject, onMounted } from "vue";
import config from "../config/config";
import SetSize from "./SetSize.vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { useRowSegmentsStore } from "../../pinia/RowSegments";
import { DimensionLine } from "../configurator/builders/DimensionLine";

const kitchenSizesStore = useKitchenSizesStore();

const cabinetBuilder = inject("cabinetBuilder");





 

function updateConfig() {
  if (kitchenSizesStore.type === "direct") {
    cabinetBuilder.value.executeConfig("direct");
    const lineLeft = config.lines.find(item => item.name === "lineLeft");
    const lineRight = config.lines.find(item => item.name === "lineRight");


    lineLeft.visibleOff()
    lineRight.visibleOff()

  
  } else if (kitchenSizesStore.type === "left") {
    cabinetBuilder.value.executeConfig("left");
      const lineLeft = config.lines.find(item => item.name === "lineLeft");
    const lineRight = config.lines.find(item => item.name === "lineRight");

    lineLeft.visibleOn()
    lineRight.visibleOff()
 
  
  } else if (kitchenSizesStore.type === "uShaped") {
    cabinetBuilder.value.executeConfig("uShaped");
     
    const lineRight = config.lines.find(item => item.name === "lineRight");
      const lineLeft = config.lines.find(item => item.name === "lineLeft");

   
    lineRight.visibleOn()
    lineLeft.visibleOn()

 
  }
}
</script>

<style scoped>
.set_size {
  margin-top: 40px;
}

h3 {
  color: #464646;
}

.radio-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.radio-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px;
  cursor: pointer;

  transition: all 0.3s ease;
  width: 120px;
  height: 120px;
}

.radio-card input {
  display: none;
}

.radio-card .card-content {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.radio-card .card-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 5px;
}

.radio-card .card-title {
  margin-top: 5px;
  font-size: 16px;
}

.radio-card:hover,
.radio-card input:checked + .card-content {
  border-color: #000000;
}

.radio-card.active {
  border-color: #000000;
}
</style>
