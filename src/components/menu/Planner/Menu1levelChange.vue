<template>
    <div
    class="fixed top-20 right-[70vh] w-[350px] h-[350px] mr-4 bg-gray-100 pointer-events-none rounded-md shadow-lg"
    v-if="hoveredItem"
      :style="{
      top: (plannerStore.emptyPosition.y  - 360) + 'px',
      left: (plannerStore.emptyPosition.x +50  ) + 'px',
    }"
  >
    <img src="/img/penals/penal2.png" alt="Модуль" class="w-full h-full object-contain p-4">
  </div>

  <!-- Панель с характеристиками -->
  <div
    v-if="plannerStore.changeMenu"
    class="fixed  w-[400px] p-3 bg-white rounded-lg shadow-lg border border-gray-300 z-50 pointer-events-auto text-[13px]"
        :style="{
      top: plannerStore.emptyPosition.y + 'px',
      left: (plannerStore.emptyPosition.x +50 ) + 'px',
    }"
  >

    <div class="flex items-center justify-between mb-2">
      <p class="text-gray-600">Сменить модуль</p>
    </div>

    <!-- Карточки выбора типа -->
    <div class="flex flex-wrap gap-1.5 mb-2">
      <label
        v-for="option in typeOptions"
        :key="option.value"
        class="cursor-pointer border rounded-lg px-2 py-1 flex items-center text-xs transition hover:bg-gray-100 hover:shadow-sm border-gray-300"
        :class="{
          'bg-blue-100 border-blue-500 text-blue-700':
            plannerStore.selectedType === option.value,
        }"
        @mouseenter="hoveredItem = option"
        @mouseleave="hoveredItem = null"
      >
        <input
          type="radio"
          class="hidden"
          name="moduleType"
          :value="option.value"
          v-model="plannerStore.selectedType"
          @change="onTypeChange"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>

    <!-- Контейнер для выбора размера/пенала -->
    <div class="flex flex-col gap-2">
      <!-- 👉 карточки выбора ширины (обычные модули) -->
      <div v-if="plannerStore.selectedType !== 'penal'" class="flex flex-wrap gap-1.5">
        <label
          v-for="(type, index) in plannerStore.modelsList[plannerStore.selectedType]"
          :key="index"
          class="cursor-pointer select-none px-2 py-1 border rounded-md text-xs transition hover:bg-gray-100 border-gray-300"
          :class="{
            'bg-blue-100 border-blue-500 text-blue-700 shadow-sm':
              plannerStore.selectedWidth === type,
          }"
        >
          <input
            type="radio"
            class="hidden"
            name="module-width"
            :value="type"
            v-model="plannerStore.selectedWidth"
            @change="changeModule"
          />
          {{ type * 100 + " см" }}
        </label>
      </div>

      <!-- 👉 карточки выбора пенала -->
      <div v-if="plannerStore.selectedType === 'penal'" class="flex flex-wrap gap-1.5">
        <label
          v-for="(item, index) in plannerStore.modelsList.penal"
          :key="index"
          class="cursor-pointer select-none px-2 py-1 border rounded-md text-xs transition hover:bg-gray-100 border-gray-300 flex items-center justify-center text-center"
          :class="{
            'bg-blue-100 border-blue-500 text-blue-700 shadow-sm':
              selectedPenal === item,
          }"
        >
          <input
            type="radio"
            class="hidden"
            name="penal-type"
            :value="item"
            v-model="selectedPenal"
            @change="
              () => {
                selectedSize = '';
              }
            "
          />
          {{ item.description }}
        </label>
      </div>

      <!-- 👉 карточки выбора размера пенала -->
      <div v-if="selectedPenal" class="flex flex-wrap gap-1.5">
        <label
          v-for="(size, idx) in selectedPenal.sizes"
          :key="idx"
          class="cursor-pointer select-none px-2 py-1 border rounded-md text-xs transition hover:bg-gray-100 border-gray-300"
          :class="{
            'bg-blue-100 border-blue-500 text-blue-700 shadow-sm':
              selectedSize === size,
          }"
        >
          <input
            type="radio"
            class="hidden"
            name="penal-size"
            :value="size"
            v-model="selectedSize"
            @change="changeModule"
          />
          {{ size * 100 + " см" }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>

import { usePlannerStore } from '../../../pinia/PlannerStore';
import { inject, ref, computed, watch } from 'vue';

const plannerManager = inject("plannerManager");



const plannerStore = usePlannerStore()




const selectedPenal = ref(null);
const selectedSize = ref(null);
const hoveredItem = ref(null);



const typeOptions = computed(() => [
  { value: "cd", label: "с" },
  { value: "c1", label: "1 ящ" },
  { value: "c2", label: "2 ящ" },
  { value: "c3", label: "3 ящ" },
  { value: "ms", label: "мойка" },

  { value: "su", label: "su" },
  { value: "penal", label: "Пенал" },
]);



function changeModule() {
  if (plannerStore.selectedType.value == "penal") {
    plannerManager.value.addModule(
       "changeL1",
      selectedPenal.value.name,
      selectedSize.value,
      "penal"
    );
  } else {
    console.log("change");
    console.log('type' , plannerStore.selectedType)
    console.log('selectedWidth' , plannerStore.selectedWidth)
    
    plannerManager.value.addModule("changeL1", plannerStore.selectedType, plannerStore.selectedWidth);
  }

 // plannerStore.objectMenu = false;
  plannerStore.selectedType = null;
  plannerStore.selectedWidth = null;
 
  selectedPenal.value = null;
  plannerStore.changeMenu = false;
}


// watch(plannerStore.selectedType, (newVal) => {
//   if (newVal !== "penal") {
//     selectedPenal.value = null;
//     selectedSize.value = null;
//   }
// });

</script>