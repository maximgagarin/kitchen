<template>
    <div
    class="fixed top-20 right-[70vh] w-[350px] h-[350px] mr-4 bg-gray-100 pointer-events-none rounded-md shadow-lg"
    v-if="hoveredItem"
      :style="{
      top: (plannerStore.emptyPosition.y  - 360) + 'px',
      left: (plannerStore.emptyPosition.x +10  ) + 'px',
    }"
  >
    <img src="/img/penals/penal2.png" alt="Модуль" class="w-full h-full object-contain p-4">
  </div>

  <!-- Панель с характеристиками -->
  <div
    v-if="plannerStore.objectMenu"
    class="fixed  w-[420px] p-3 bg-white rounded-lg shadow-lg border border-gray-300 z-50 pointer-events-auto text-[13px]"
        :style="{
      top: plannerStore.emptyPosition.y + 'px',
      left: plannerStore.emptyPosition.x + 'px',
    }"
  >
    <!-- Заголовок -->
    <!-- <div class="flex items-center justify-between mb-2">
      <span class="font-medium text-gray-700 truncate">
        {{ plannerStore.selectedObject.name }}
      </span>
      <button class="text-gray-500 hover:text-red-500 text-xs" @click="deleteSelected">✕ удалить</button>
    </div> -->

    <div class="flex items-center justify-between mb-2">
      <p class="text-gray-600">Добавить модуль</p>
    </div>

    <!-- Карточки выбора типа -->
    <div class="flex flex-wrap gap-1.5 mb-2">
      <label
        v-for="option in typeOptions"
        :key="option.value"
        class="cursor-pointer border rounded-lg px-2 py-1 flex items-center text-xs transition hover:bg-gray-100 hover:shadow-sm border-gray-300"
        :class="{
          'bg-blue-100 border-blue-500 text-blue-700':
            selectedType === option.value,
        }"
        @mouseenter="hoveredItem = option"
        @mouseleave="hoveredItem = null"
      >
        <input
          type="radio"
          class="hidden"
          name="moduleType"
          :value="option.value"
          v-model="selectedType"
          @change="onTypeChange"
        />
       <img  :src="option.src" alt="Описание иконки" width="32" height="32">
      </label>
    </div>
    

    <!-- Контейнер для выбора размера/пенала -->
    <div class="flex flex-col gap-2">
      <!-- 👉 карточки выбора ширины (обычные модули) -->
      <div v-if="selectedType !== 'penal'" class="flex flex-wrap gap-1.5">
        <label
          v-for="(type, index) in plannerStore.modelsList[selectedType]"
          :key="index"
          class="cursor-pointer select-none px-2 py-1 border rounded-md text-xs transition hover:bg-gray-100 border-gray-300"
          :class="{
            'bg-blue-100 border-blue-500 text-blue-700 shadow-sm':
              selectedWidth === type,
          }"
        >
          <input
            type="radio"
            class="hidden"
            name="module-width"
            :value="type"
            v-model="selectedWidth"
            @change="changeModule"
          />
          {{ type * 100 + " см" }}
        </label>
      </div>

      <!-- 👉 карточки выбора пенала -->
      <div v-if="selectedType === 'penal'" class="flex flex-wrap gap-1.5">
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


const selectedType = ref("");
const selectedWidth = ref(null);

const selectedPenal = ref(null);
const selectedSize = ref(null);
const hoveredItem = ref(null);



const typeOptions = computed(() => [
  { value: "cd", label: "с" , src: '/img/icons/c.png' },
  { value: "c1", label: "1 ящ" , src: '/img/icons/c1.png' },
  { value: "c2", label: "2 ящ" , src: '/img/icons/c2.png'},
  { value: "c3", label: "3 ящ" , src: '/img/icons/c3.png'},
  { value: "ms", label: "мойка" , src: '/img/icons/sink.png'},

  { value: "su", label: "su" ,  src: '/img/icons/cabinet_1.png' },
  { value: "penal", label: "Пенал" ,  src: '/img/icons/penal.png'},
]);



function changeModule() {
  if (selectedType.value == "penal") {
    plannerManager.value.addModule(
      selectedPenal.value.name,
      selectedSize.value,
      "penal"
    );
  } else {
    console.log("elsr");
    plannerManager.value.addModule(selectedType.value, selectedWidth.value);
  }

  plannerStore.objectMenu = false;
  selectedType.value = "";
  selectedWidth.value = null;
  selectedPenal.value = null;
  plannerStore.objectMenuL2 = false;
}


watch(selectedType, (newVal) => {
  if (newVal !== "penal") {
    selectedPenal.value = null;
    selectedSize.value = null;
  }
});

</script>