<template @click="openMenu($event)">


  <Menu1level />
  <Menu2level />
  <Menu1levelChange />
  <MenuSector />
  <Rules />
  <Materials />
  <ControlTitle />


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
import Menu2level from "./Planner/Menu2level.vue";
import Menu1levelChange from "./Planner/Menu1levelChange.vue";
import Menu1level from "./Planner/Menu1level.vue";
import MenuSector from "./Planner/MenuSector.vue";
import Rules from "./Planner/Rules.vue";
import Materials from "./Planner/Materials.vue";
import ControlTitle from "./Planner/ControlTitle.vue";



const plannerStore = usePlannerStore();
const plannerManager = inject("plannerManager");
const kitchenStore = useKitchenSizesStore();

setTimeout(() => {
  plannerManager.value.start();
  console.log(plannerManager.value.sceneSetup.scene)
  console.log("planner start");
}, 500);

function restart() {
  location.reload(true);
}









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
