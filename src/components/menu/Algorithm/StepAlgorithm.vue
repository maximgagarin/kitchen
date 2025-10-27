<template>


  <div v-if="showModal">
    <allVaraints
      :filtred1="filtred1"
      :filtred2="filtred2"
      @escapePressed="escapePressed"
    />
  </div>



  

  <h2 class="text-xs font-bold text-gray-800">Готовые варианты расстановки</h2>
  <Combinations />
  <changeVariants  />

 
  <!-- <Options @select="changeOvenDish" /> -->


  <div class="border-t-2 border-gray-300 my-4 pt-3">
    <StepPlanner />
  </div>



 

 
 
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, watch } from "vue";
import Options from "./Options.vue";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useAlgorithmStore } from "../../../pinia/Algorithm";
import allVaraints from "./allVaraints.vue";
import changeVariants from "./changeVariants.vue";
import Combinations from "./Combinations.vue";
import StepPlanner from "../StepPlanner.vue";

import { algorithmConfig } from "../../configurator/builders/Algorithm/algorithmConfig";
import { plannerConfig } from "../../configurator/planner/planerConfig";


// Pinia и зависимости
const kitchenStore = useKitchenSizesStore();
const plannerStore = usePlannerStore();
const cabinetBuilder = inject("cabinetBuilder");
const algorithmManager = inject("algorithmManager");
const plannerManager = inject("plannerManager");


// Состояние

const showModal = ref(false);
const algorithmOn = ref(false);
const showLowRules = ref(false);



// Данные

const filtred1 = ref({});
const filtred2 = ref({});

const rulesName = ref();

//запуск планнировщика

function escapePressed() {
  showModal.value = false;
}

function startPlanner() {
  kitchenStore.step = 6;
}

//перезапуск программы
function restart() {
  location.reload(true);
}
// Запуск алгоритма
function run() {
  cabinetBuilder.value.deleteAll2();
  algorithmManager.value.run();
  algorithmOn.value = true;
  

}




//смена духовки или посудомойки
function changeOvenDish(value) {
  console.log(value);


  if(value == "change_side_oven"){
    
    algorithmManager.value.algorithm1level.createParts()
    algorithmManager.value.algorithm1level.addRules();

    algorithmManager.value.algorithm1level.buildSideRowDirect();
    algorithmManager.value.algorithm1level.buildSideRowLeft();

    if(kitchenStore.levels.direct2) {
     // algorithmManager.value.algorithm2level.deleteLeft()
      algorithmManager.value.algorithm2level.buildDirect();
    }  
  
    if(kitchenStore.levels.left2){
    //    algorithmManager.value.algorithm2level.deleteDirect()
      algorithmManager.value.algorithm2level.buildLeft();
    } 

  }

  if (algorithmConfig.dishwasher.side == "direct" && value == "dishwasher") {
    console.log("direct");
    //algorithmManager.value.algorithm2level.buildDirect()
     algorithmManager.value.algorithm1level.addRules();
    algorithmManager.value.algorithm1level.buildSideRowDirect();

    algorithmManager.value.algorithm2level.buildDirect();
  

  }
  if (algorithmConfig.dishwasher.side == "left" && value == "dishwasher") {
    console.log("left");
     algorithmManager.value.algorithm1level.addRules();
    algorithmManager.value.algorithm1level.buildSideRowLeft();

      algorithmManager.value.algorithm2level.buildLeft()
  }

  if (algorithmConfig.oven.side == "direct" && value == "oven") {
    console.log("direct2");

      algorithmManager.value.algorithm1level.addRules();
    algorithmManager.value.algorithm1level.buildSideRowDirect();
    algorithmManager.value.algorithm2level.createParts();

    algorithmManager.value.algorithm2level.buildDirect();
  }
  if (algorithmConfig.oven.side == "left" && value == "oven") {
    console.log("left2");

       algorithmManager.value.algorithm1level.addRules();
    algorithmManager.value.algorithm1level.buildSideRowLeft();
    algorithmManager.value.algorithm2level.createParts();

    algorithmManager.value.algorithm2level.buildLeft();
  }
}

run();

// Показ модального окна
const showVariants = () => {
  showModal.value = true;
};
</script>

<style scoped>
.button {
  margin-bottom: 5px;
  background-color: #ffffff;
  border: 1px solid black;

  border-radius: 5px;
  color: #000000;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;

  padding: 10px 10px;
  text-align: center;
}

.sinkButton:hover {
}
</style>
