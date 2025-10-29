<template @click="openMenu($event)">
  <!--  панель с характеристиками -->
  <!-- Панель с характеристиками -->
  <div
    v-if="plannerStore.objectMenu"
    class="fixed bottom-24 left-[20%] w-[580px] p-3 bg-white rounded-lg shadow-lg border border-gray-300 z-50 pointer-events-auto text-[13px]"
  >
    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-2">
      <span class="font-medium text-gray-700 truncate">
        {{ plannerStore.selectedObject.name }}
      </span>
      <!-- <button class="text-gray-500 hover:text-red-500 text-xs" @click="deleteSelected">✕ удалить</button> -->
    </div>

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
      >
        <input
          type="radio"
          class="hidden"
          name="moduleType"
          :value="option.value"
          v-model="selectedType"
          @change="onTypeChange"
        />
        <span>{{ option.label }}</span>
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

  <div
    class="fixed w-[180px] p-3 bg-white rounded-lg shadow-lg border border-gray-300 z-50 pointer-events-auto text-[13px]"
    v-if="plannerStore.objectMenuL2"
    :style="{
      top: plannerStore.emptyPosition.y + 'px',
      left: plannerStore.emptyPosition.x + 'px',
    }"
  >
    <p class="mb-2 text-gray-600">Вставить модуль</p>



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

        {{ width * 100 + " см" }}
      </label>
    </div>
  </div>

  <!-- <AccordionMenu @select="handleSelectModule" /> -->

  <CollisionAlert />

  <p>delete - удалить модуль</p>

  <div class="mt-5 flex justify-between">
    <!-- Кнопка запуска -->
    <div class="text-center mb-6">
      <button
        class="px-1 py-1 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
        @click="restart"
      >
        начать с начала
      </button>
    </div>
    <!-- Кнопка показа модального окна -->
    <div class="text-center mb-6">
      <!-- <button
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      @click="startAlgorythm"
    >
      перейти в алгоритм
    </button> -->
    </div>
  </div>

  <!-- <div class="text-xs">
    <p >ручка</p>
       <select  
          id="selectedOven" 
          v-model="selectedHandle"
        
          class="w-16 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          @change =  "changeHandle()"
        >
          <option value="handle-1">ручка-1</option> 
          <option value="handle-2">ручка-2</option>
          <option value="handle-3">ручка-3</option>

         
        </select>
  </div>

   <div>
    <p class="text-xs">цвет</p>
       <select 
          id="selectedOven" 
          v-model="selectedColor"
        
          class="w-16 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          @change =  "changeColor()"
        >
          <option value="black">серый</option> 
          <option value="white">белый</option>

         
        </select>
  </div> -->

  <!-- <div>
    <p>фасад</p>
       <select 
          id="selectedOven" 
          v-model="selectedFacade"
        
          class="w-40 px-3 py-2 text-sm border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          @change =  "changeFacade()"
        >
          <option value="blackMaterial">серый</option> 
          <option value="whiteMaterial">белый</option>
        </select>
  </div> -->

  <!-- <button class="border-b" @click="showConfig()">конфиг</button> -->
</template>

<script setup>
import { ref, watch, inject, computed } from "vue";

import { usePlannerStore } from "../../pinia/PlannerStore";
import AccordionMenu from "./components/AccordionMenu.vue";
import CollisionAlert from "./components/CollisionAlert.vue";
import { plannerConfig } from "../configurator/planner/planerConfig";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { algorithmConfig } from "../configurator/builders/Algorithm/algorithmConfig";

const selectedType = ref("");
const selectedWidth = ref(null);

const selectedPenal = ref(null);
const selectedSize = ref(null);
const selectedHandle = ref(null);
const selectedColor = ref(null);
const selectedFacade = ref(null);

const typeOptions = computed(() => [
  { value: "cd", label: "с" },
  { value: "c1", label: "1 ящ" },
  { value: "c2", label: "2 ящ" },
  { value: "c3", label: "3 ящ" },
  { value: "ms", label: "мойка" },

  { value: "su", label: "su" },
  { value: "penal", label: "Пенал" },
]);

const moduleTypes = [
  { value: "ВП", label: "ВП" },
  { value: "ВПС", label: "ВПС" },
  { value: "ВПГ", label: "ВПГ" },
  { value: "ВПГС", label: "ВПГС" },
  { value: "ПЛД", label: "ПЛД" },
  { value: "ОПМ", label: "ОПМ" },
  { value: "ПГС", label: "ПГС" },
  { value: "ПЛВ", label: "ПЛВ" },
  { value: "ОПМГ", label: "ОПМГ" },
];

const menuX = ref(0);
const menuY = ref(0);

// const props = defineProps({
//   moduleGroups: {
//     type: Array,
//   },
// });

const plannerStore = usePlannerStore();
const plannerManager = inject("plannerManager");
const kitchenStore = useKitchenSizesStore();

setTimeout(() => {
  plannerManager.value.start();
  console.log("planner start");
}, 1000);

function restart() {
  location.reload(true);
}

function changeHandle() {
  plannerManager.value.menuController.changeHandle(selectedHandle.value);
}

function changeColor() {
  plannerManager.value.menuController.changeColor(selectedColor.value);
}

function changeFacade() {
  plannerManager.value.menuController.changeFacade(selectedFacade.value);
}

function startAlgorythm() {
  kitchenStore.step = 5;
}

function showConfig() {
  console.log("plannerConfig", plannerConfig);

  console.log("algorithmConfig", algorithmConfig);
  console.log(plannerManager.value.scene);
}

function setSink() {
  console.log("sink");

  if (plannerConfig.selectedObject.sinkOn === false) {
    console.log("включаем мойку");
    plannerConfig.selectedObject.sink.visible = true;
    plannerConfig.selectedObject.tabletopFull.visible = false;
    plannerConfig.selectedObject.sinkOn = true;
  } else {
    console.log("выключаем мойку");
    plannerConfig.selectedObject.sink.visible = false;
    plannerConfig.selectedObject.tabletopFull.visible = true;
    plannerConfig.selectedObject.sinkOn = false;
  }

  plannerManager.value.sceneSetup.requestRender();
}

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

function rotate(rotate) {
  plannerManager.value.rotation(rotate);
}

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

function deleteSelected() {
  plannerManager.value.deleteSelected();
}

function handleSelectModule(name) {
  // window.dispatchEvent(new CustomEvent('start-drag-module', { detail: name }))
  console.log("Выбран модуль:", name);
  //  plannerManager.value.addToScene(name)
}

watch(selectedType, (newVal) => {
  if (newVal !== "penal") {
    selectedPenal.value = null;
    selectedSize.value = null;
  }
});
</script>

<style scoped>



/* .fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
} */

.button-row {
  display: flex;
  gap: 8px; /* промежуток между кнопками */
  flex-wrap: wrap; /* если не помещаются — переносятся */
}

.button {
  margin-bottom: 5px;
  background-color: #fc0303;
  border: 0;
  border-radius: 5px;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;

  padding: 15px 25px;
  text-align: center;
}

.sinkButton:hover {
}
</style>
