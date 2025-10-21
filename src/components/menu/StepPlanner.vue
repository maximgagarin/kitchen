<template>
  <!--  панель с характеристиками -->
  <div
    class="fixed bottom-10 left-[600px] w-[600px] h-[200px] p-3 mr-4 bg-white pointer-events-none rounded-md z-50 pointer-events-auto border-2 border-gray-400"
    v-if="plannerStore.objectMenu"
  >
    <span>{{ plannerStore.selectedObject.name }}</span>
    <!-- <p>Возможные варианты:</p> -->
    <div class="flex flex-row justify-between gap-3 mb-3 mt-3">
      <p>выбрать модуль</p>
      <div>
        <!-- <button class="border-b" @click="deleteSelected">удалить✕</button> -->
      </div>
    </div>

    <div class="flex flex-row gap-3">
      <div>
       
        <select v-model="selectedType" name="выбрать" id="">
          <option disabled value="">Выберите тип</option>
          <option v-if="!plannerStore.onlyPenal" value="cd">с</option>
          <option v-if="!plannerStore.onlyPenal" value="c1">1 ящ</option>
          <option v-if="!plannerStore.onlyPenal" value="c2">2 ящ</option>
          <option v-if="!plannerStore.onlyPenal" value="c3">3 ящ</option>
          <option v-if="!plannerStore.onlyPenal" value="su">su</option>

          <option
            v-if="plannerStore.anyModule || plannerStore.onlyPenal"
            value="penal"
          >
            пенал
          </option>
        </select>
      </div>
      <div>
        
        <select
          v-if="selectedType !== 'penal'"
          v-model="selectedWidth"
          @change="changeModule()"
          class="border px-2 py-1"
        >
          <option
            v-for="(type, index) in plannerStore.modelsList[selectedType]"
            :key="index"
            :value="type"
          >
            {{ type }}
          </option>
        </select>

        <select v-if="selectedType === 'penal'" v-model="selectedPenal">
          <option
            v-for="(item, index) in plannerStore.modelsList.penal"
            :key="index"
            :value="item"
          >
            {{ item.description }}
          </option>
        </select>

        <select
          v-if="selectedPenal"
          v-model="selectedSize"
          @change="changeModule()"
        >
          <option
            v-for="(size, idx) in selectedPenal.sizes"
            :key="idx"
            :value="size"
          >
            {{ size }}
          </option>
        </select>
      </div>
      <div>
        <!-- <button class="border-b" @click="rotate(false)">⟲</button>
      <button class="border-b" @click="rotate(true)">⟳</button> -->
      </div>
    </div>
    <!-- <div>
      <span>мойка</span>
      <input type="checkbox" id="sink"  value="Bike" @click="setSink()">

    </div> -->
  </div>

  <div
    class="fixed bottom-10 left-[600px] w-[600px] h-[200px] p-3 mr-4 bg-white pointer-events-none rounded-md z-50 pointer-events-auto border-2 border-gray-400"
    v-if="plannerStore.objectMenuL2"
  >
     <p class="mb-2">Вставить модуль</p>

    <div class="flex flex-row gap-3">
      <div>
        <select v-model="selectedType" name="выбрать" id="">
          <option disabled value="">Выберите тип</option>
          <option value="ВП">ВП</option>
          <option value="ВПС">ВПС</option>
          <option value="ВПГ">ВПГ</option>
          <option value="ВПГС">ВПГС</option>
          <option value="ПЛД">ПЛД</option>




          <option value="ОПМ">ОПМ</option>
          <option value="ПГС">ПГС</option>
          <option value="ПЛВ">ПЛВ</option>
          <option value="ОПМГ">ОПМГ</option>
         
        </select>
      </div>
      <div>
        <select
          v-if="selectedType"
          v-model="selectedWidth"
          @change="changeModule()"
          class="border px-2 py-1"
        >
          <option
            v-for="(type, index) in filteredWidths"
            :key="index"
            :value="type"
          >
            {{ type }}
          </option>
        </select>
      </div>
      <div>
        <!-- <button class="border-b" @click="rotate(false)">⟲</button>
      <button class="border-b" @click="rotate(true)">⟳</button> -->
      </div>
    </div>
    <!-- <div>
      <span>мойка</span>
      <input type="checkbox" id="sink"  value="Bike" @click="setSink()">

    </div> -->
  </div>

  <!-- <AccordionMenu @select="handleSelectModule" /> -->
  <CollisionAlert />

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

  <div class="text-xs">
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
  </div>


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



// const props = defineProps({
//   moduleGroups: {
//     type: Array,
//   },
// });

const plannerStore = usePlannerStore();
const plannerManager = inject("plannerManager");
const kitchenStore = useKitchenSizesStore();

setTimeout(()=>{
  plannerManager.value.start();
  console.log('planner start')
}, 2000)



function restart() {
  location.reload(true);
}


function changeHandle(){
  
  plannerManager.value.menuController.changeHandle(selectedHandle.value)
}

function changeColor(){
  plannerManager.value.menuController.changeColor(selectedColor.value)
  
}

function changeFacade(){
  plannerManager.value.menuController.changeFacade(selectedFacade.value)
  
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
