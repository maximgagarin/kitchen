<template>

  <div
  class="fixed top-4 left-[5vh] w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"
  @click="showLines()"
  title="Показать / скрыть линии"
  >
  <svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-5 w-5 text-gray-700"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  >
  <path
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  d="M4 8h16M4 16h16"
  />
  </svg>
  </div>

  <div
  class="fixed top-4 left-[10vh] w-[40px] h-[40px] mr-4 bg-gray-100 hover:bg-gray-300 transition-colors duration-200 cursor-pointer pointer-events-auto rounded-md shadow-lg flex items-center justify-center"

  @click="toggleShadows"
  title="Вкл / Выкл тени"
  >
  <svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-5 w-5 text-gray-700"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  >
  <path
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  d="M3 3l18 18M4 4h16v16H4V4z"
  />
  </svg>
  </div>

 

  <div v-if="kitchenSizes.step !=5" class="  fixed left-[50px] top-5 w-2/3 h-[100px] bg-white  text-xs  ">
    <div class="flex flex-row">
         <div 
      v-for="(item, index) in menuItems" 
      :key="index"
      :class="{
      'bg-blue-200': kitchenSizes.step  === index ,
      'px-4 py-2 rounded-md': true,
       'cursor-pointer': index >= maxStep || kitchenSizes.isSink,
       'opacity-50 pointer-events-none': index > maxStep || kitchenSizes.isSink
      }"
      @click="setStep(index)"
    >
    {{ item }}
    </div>
    </div>
 
  </div>
  
  
      
  <div class="wrapper" v-if="isPanelVisible">   
    <div class="content ">

      <Step1 v-if="kitchenSizes.step === 0" />
      <StepDirect v-if="kitchenSizes.type === 'direct' && kitchenSizes.step === 0" />
      <StepLeft v-if="kitchenSizes.type === 'left' && kitchenSizes.step === 0" />
      <StepU v-if="kitchenSizes.type === 'uShaped' && kitchenSizes.step === 0" />

      <StepPenal v-if="kitchenSizes.step === 1" />
      <StepSink v-if="kitchenSizes.step === 2" />
       <StepOven v-if="kitchenSizes.step === 3" />
      <StepDishWash v-if="kitchenSizes.step === 4" />
     
      <StepAlgorithm v-if="kitchenSizes.step === 5" />
      <Planner v-if="kitchenSizes.step === 6" />
      <Select3levelHeight v-if="kitchenSizes.step === 0"/>
          <div v-if="!kitchenSizes.algorythm.start &&  kitchenSizes.step !==5" class="buttons_wrapper">
      <!-- <div  class="buttons_wrapper"> -->
        <button class="" v-if="kitchenSizes.step > 0" @click="prev">Назад</button>
        <button class="" @click="next">Далее</button>
      </div>
         <button  @click="showConfig">конфиг</button>
    </div>
    
  </div>

  

 


  
</template>

<script setup>
import { ref, computed, inject } from "vue";
import Step1 from "./Step1.vue";
import config from "../config/config";

import StepDirect from "./StepDirect.vue";
import StepLeft from "./StepLeft.vue";

import StepU from "./StepU.vue";
import StepPenal from "./StepPenal.vue";
import StepSink from "./StepSink.vue";
import StepDishWash from "./StepDishWash.vue";
import StepOven from "./StepOven.vue";

import StepAlgorithm from "./Algorithm/StepAlgorithm.vue";
import Select3levelHeight from "./components/Select3levelHeight.vue";
import Planner from "./StepPlanner.vue";

import { lines } from "../config/lines";
import { algorithmConfig } from "../configurator/builders/Algorithm/algorithmConfig";
import { plannerConfig } from "../configurator/planner/planerConfig";

import { useKitchenSizesStore } from "../../pinia/kitchenSizes";







const kitchenSizes = useKitchenSizesStore();

const cabinetBuilder = inject("cabinetBuilder");

function showConfig() {
  console.log('algorithmConfig', algorithmConfig)
  console.log('plannerConfig', plannerConfig)
  console.log('scene', cabinetBuilder.value.scene)
}


const step = ref(0);
const maxStep = ref(0);
const totalSteps = ref(7);
const isPanelVisible = ref(true);


const setStep = (index) => {
  kitchenSizes.step = index;
};


const menuItems = ref([ 
  'размеры',
  'пеналы/холодильник',
  'мойка',
  'плита',
  'посудомойка',
  'алгоритм',
]);


let showLinesVisible = true;

const progress = computed(() => {
  return (kitchenSizes.step / totalSteps.value) * 100;
});



function togglePanel() {
  isPanelVisible.value = !isPanelVisible.value;
}

function next() {
  if (config.type) {
    kitchenSizes.step++;
    (kitchenSizes.step > maxStep.value) ? maxStep.value++ : maxStep.value
  //  console.log('maxStep', maxStep.value)
    config.step = step;
  } else {
    alert("Выберите тип кухни перед продолжением!");
  }
}

function prev() {
  if (kitchenSizes.step > 0) {
    kitchenSizes.step--;
    config.step = step;
  }
}

function showLines() {
  showLinesVisible = !showLinesVisible;
  lines.forEach((line) => {
    line.visible = showLinesVisible;
    cabinetBuilder.value.sceneSetup.requestRender();
  });
}


function toggleShadows(){
  console.log('123')
}

</script>

<style>
.wrapper {
  display: flex;
  justify-content: center;

  background-color: rgba(255, 255, 255, 1);
  width: 420px;
  top: 20px;
  bottom: 20px;
  right: 20px;
  box-sizing: border-box;
  position: absolute;

  color: #000000;
  z-index: 2;
  border-radius: 5px;
}

.buttons_wrapper {
  margin-bottom: 10px;
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
}

.content {
  margin-top: 10px;

  width: 100%;
  padding: 0 15px;
  position: relative;
}

h2 {
  margin-bottom: 15px;
}

.menuButton {
  font-size: small;
  margin-bottom: 5px;
  background-color: #ffffff;
  border: 1px solid #424242;
  border-radius: 4px;
  box-sizing: border-box;
  color: #0d172a;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  padding: 15px 25px;
  text-align: center;
  text-decoration: none #0d172a solid;
}

/* #1D4ED8 */

.menuButton:hover {
  color: rgb(255, 4, 4);
}

.hide-button {
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
}

.show-button {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
}

.progress-bar {
  height: 6px;
  background: #ffffff; /* Цвет фона */
  border-radius: 3px;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: #000000; /* Цвет заполнения */
  transition: width 0.3s ease; /* Плавная анимация */
}

/* Мобильная версия */
@media (max-width: 768px) {
  .hide-button {
    display: block;
  }

  .show-button {
    display: block;
  }

  .wrapper {
    width: 100%;
  }
}
</style>
