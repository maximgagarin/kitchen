<template>
  <!-- Блок превью -->
  <div
    class="fixed w-[350px] h-[350px] bg-gray-100 pointer-events-none rounded-md shadow-lg overflow-hidden transition-all duration-300"
    :style="{
      top: (plannerStore.emptyPosition.y + 150) + 'px',
      left: (plannerStore.emptyPosition.x + 30) + 'px',
      opacity: hoveredItem ? 1 : 0,
      transform: hoveredItem ? 'scale(1)' : 'scale(0.95)',
    }"
  >
    <transition name="fade" mode="out-in">
      <img
        v-if="hoveredItem"
        :key="hoveredItem.src"
        :src="hoveredItem.src"
        alt="Модуль"
        class="w-full h-full object-contain p-4"
      />
    </transition>
  </div>

  <!-- Меню -->
  <div
    class="fixed w-[350px] p-3 bg-white rounded-lg shadow-lg border border-gray-300 z-50 pointer-events-auto text-[13px]"
    v-if="plannerStore.sectorMenu"
    :style="{
      top: plannerStore.emptyPosition.y + 'px',
      left: (plannerStore.emptyPosition.x + 30) + 'px',
    }"
  >
    <p class="mb-2 text-gray-600">вставить в сектор</p>

    <!-- Выбор типа -->
    <div class="flex flex-wrap gap-2 mb-3">
      <label
        v-for="type in moduleTypes"
        :key="type.value"
        class="cursor-pointer border rounded-lg px-2 py-1 flex items-center text-xs transition hover:bg-gray-100 hover:shadow-sm border-gray-300"
        :class="
          selectedType === type.value
            ? 'bg-blue-100 border-blue-500 text-blue-700'
            : 'hover:bg-gray-100'
        "
        @mouseenter="hoveredItem = type"
        @mouseleave="hoveredItem = null"
      >
        <input
          type="radio"
          v-model="selectedType"
          :value="type.value"
          class="hidden"
        />
        {{ type.label }}
      </label>
    </div>

    <!-- Выбор ширины -->
    <div v-if="selectedType" class="flex flex-wrap gap-2">
      <label
        v-for="(width, index) in filteredWidths"
        :key="index"
        class="cursor-pointer border rounded-lg px-2 py-1 flex items-center text-xs transition hover:bg-gray-100 hover:shadow-sm border-gray-300"
        :class="
          selectedWidth === width
            ? 'bg-green-500 text-white border-green-500'
            : 'hover:bg-gray-100'
        "
      >
        <input
          type="radio"
          v-model="selectedWidth"
          :value="width"
          class="hidden"
          @change="changeModule"
        />
        {{ width * 100 + ' см' }}
      </label>
    </div>
  </div>
</template>
<script setup>
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { inject, ref, computed } from "vue";

const plannerManager = inject("plannerManager");

const plannerStore = usePlannerStore();

const selectedType = ref("");
const selectedWidth = ref(null);
const hoveredItem = ref(null);

const moduleTypes = [
  { value: "ВП", label: "ВП" , src:"/img/2level/ВПС.png" },
  { value: "ВПС", label: "ВПС" ,src:"/img/2level/ВП.png"},
  { value: "ВПГ", label: "ВПГ", src:"/img/2level/ВПГ.png" },
  { value: "ВПГС", label: "ВПГС" , src:"/img/2level/ВПС.png"},
  { value: "ПЛД", label: "ПЛД" , src:"/img/2level/ВПС.png"},
  { value: "ОПМ", label: "ОПМ" , src:"/img/2level/ВПС.png"},
  { value: "ПГС", label: "ПГС" , src:"/img/2level/ВПС.png"},
  { value: "ПЛВ", label: "ПЛВ" , src:"/img/2level/ВПС.png"},
  { value: "ОПМГ", label: "ОПМГ" , src:"/img/2level/ВПС.png"},
];

const filteredWidths = computed(() => {
  if (!selectedType.value || !plannerStore.modelsListL2[selectedType.value])
    return [];
  if (!plannerStore.sectorReady) {
    return plannerStore.modelsListL2[selectedType.value];
  }
  if (plannerStore.sectorReady) {
    return plannerStore.modelsListL2[selectedType.value].filter(
      (width) => width == plannerStore.sectorWidth
    );
  }
});

function changeModule() {
  console.log("elsr");
  plannerManager.value.addModule("sector", selectedType.value, selectedWidth.value);

  plannerStore.objectMenu = false;
  selectedType.value = "";
  selectedWidth.value = null;

  plannerStore.sectorMenu = false;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
