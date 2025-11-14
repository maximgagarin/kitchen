<template>
  <!-- Блок превью -->
  <div
    class="fixed w-[280px] h-[350px] bg-gray-100 pointer-events-none rounded-md shadow-lg overflow-hidden transition-all duration-300 transform origin-top-left"
    :style="{
      top:( plannerStore.addModule.position.y - 100 ) + 'px',
      left: (plannerStore.addModule.position.x +350 )  + 'px',
      opacity: hoveredItem ? 1 : 0,
      scale: hoveredItem ? 1 : 0.95,
    }"
  >
    <transition name="fade" mode="out-in">
      <div
        v-if="hoveredItem"
        :key="hoveredItem.img"
        class="w-full h-full flex flex-col items-center justify-center p-2"
      >
         <p class="text-gray-600 text-center text-sm break-words mb-2">
          {{ hoveredItem.label }}
        </p>
        <img
          :src="hoveredItem.img"
          alt="Модуль"
          class="max-w-full max-h-[90%] object-contain "
        />
     
      </div>
    </transition>
  </div>

  <!-- Меню -->
  <div
    class="fixed w-[350px] p-3 bg-white rounded-lg shadow-lg border border-gray-300 z-50 pointer-events-auto text-[13px]"
    v-if="plannerStore.objectMenuL2"
    :style="{
      top: plannerStore.addModule.position.y + 'px',
      left: (plannerStore.addModule.position.x ) + 'px',
    }"
  >
    <p class="mb-2 text-gray-600">вставить 2й уровень</p>

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
              <img  :src="type.icon" alt="Описание иконки" width="32" height="32">
      </label>
    </div>

    <!-- Выбор ширины -->
    <div v-if="selectedType" class="flex flex-wrap gap-2">
      <label
        v-for="(width, index) in plannerStore.modelsListL2[selectedType]"
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
  { value: "ПС", label: "ПС"      , icon: '/img/icons/c.png',  img:"/img/modules/level2/ПС.png" },
  { value: "ПГС", label: "ПГС"   , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ПГС.png"},
  { value: "ПГ", label: "ПГ"   , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},
  { value: "П", label: "П"   , icon: '/img/icons/c.png'  , img: "/img/modules/level2/П.png"},

  { value: "ВП", label: "ВП"      , icon: '/img/icons/c.png',  img:"/img/modules/level2/ВПС.png" },
  { value: "ВПС", label: "ВПС"    , icon: '/img/icons/c.png' ,img: "/img/modules/level2/ВПС.png"},
  { value: "ВПГ", label: "ВПГ",     icon: '/img/icons/c.png' , img: "/img/modules/level2/ОПМВ.png" },
  { value: "ВПГС", label: "ВПГС" , icon: '/img/icons/c.png' , img: "/img/modules/level2/ОПМВ.png"},


  { value: "ПЛД", label: "ПЛД"    , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},

  { value: "ОПМ", label: "ОПМ"   , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},

  { value: "ПЛВ", label: "ПЛВ"   , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},
  { value: "ОПМГ", label: "ОПМГ" , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},
  { value: "ОПМВГ", label: "ОПМВГ" , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},
  { value: "ОПМВ", label: "ОПМВ" , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},
  { value: "ПК", label: "ПК"   , icon: '/img/icons/c.png'  , img: "/img/modules/level2/ОПМВ.png"},

];



function changeModule() {
  console.log("elsr");
  plannerManager.value.addModule("level2", selectedType.value, selectedWidth.value);

  plannerStore.objectMenu = false;
  selectedType.value = "";
  selectedWidth.value = null;

  plannerStore.objectMenuL2 = false;
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
