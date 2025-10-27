<template>


  <ShowError />


  <div
    v-if="kitchenSizes.step != 5"
    class="fixed left-[15%] top-5 w-1/2 h-[50px] bg-white text-md"
  >
    <div class="flex flex-row">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        :class="{
          'bg-blue-200': kitchenSizes.step === index,
          'px-4 py-2 rounded-md': true,
          'cursor-pointer': index >= maxStep || kitchenSizes.isSink,
          'opacity-50 pointer-events-none':
            index > maxStep || kitchenSizes.isSink,
        }"
        @click="setStep(index)"
      >
        {{ item }}
      </div>
    </div>
  </div>

  <div class="wrapper" v-if="isPanelVisible">
    <div class="content">
      <Step1 v-if="kitchenSizes.step === 0" />
      <StepDirect
        v-if="kitchenSizes.type === 'direct' && kitchenSizes.step === 0"
      />
      <StepLeft
        v-if="kitchenSizes.type === 'left' && kitchenSizes.step === 0"
      />
      <StepU
        v-if="kitchenSizes.type === 'uShaped' && kitchenSizes.step === 0"
      />

      <StepPenal v-if="kitchenSizes.step === 1" />
      <StepSink v-if="kitchenSizes.step === 2" />
      <StepOven v-if="kitchenSizes.step === 3" />
      <StepDishWash v-if="kitchenSizes.step === 4" />

      <StepAlgorithm v-if="kitchenSizes.step === 5" />
      <Planner v-if="kitchenSizes.step === 6" />
      <Select3levelHeight v-if="kitchenSizes.step === 0" />
      <div
        v-if="!kitchenSizes.algorythm.start && kitchenSizes.step !== 5"
        class="flex justify-between mt-6 mb-2.5 px-4"
      >
        <button
          v-if="kitchenSizes.step > 0"
          @click="prev"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Назад
        </button>
        <button
          @click="next"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          
        >
          Далее
        </button>
      </div>
       <button @click="showConfig">конфиг</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import Step1 from "./Step1.vue";
import config from "../config/config";
import ShowError from "./components/ShowError.vue";

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
import { useUiStore } from "../../pinia/Ui";

const kitchenSizes = useKitchenSizesStore();
const uiStore  = useUiStore()

const cabinetBuilder = inject("cabinetBuilder");

function showConfig() {
  console.log("algorithmConfig", algorithmConfig);
  console.log("plannerConfig", plannerConfig);
  console.log("scene", cabinetBuilder.value.scene);
}

const step = ref(0);
const maxStep = ref(0);
const totalSteps = ref(7);
const isPanelVisible = ref(true);

const setStep = (index) => {
  kitchenSizes.step = index;
};

const menuItems = ref([
  "размеры",
  "пеналы/холодильник",
  "мойка",
  "плита",
  "посудомойка",
  "алгоритм",
]);

const progress = computed(() => {
  return (kitchenSizes.step / totalSteps.value) * 100;
});

function togglePanel() {
  isPanelVisible.value = !isPanelVisible.value;
}

function next() {
console.log('123')
  if(kitchenSizes.step === 2 && !kitchenSizes.sink.isSet){
    console.log('123')
    uiStore.showError('установите раковину')
  }  else {

      if (config.type) {
    kitchenSizes.step++;
    kitchenSizes.step > maxStep.value ? maxStep.value++ : maxStep.value;
    //  console.log('maxStep', maxStep.value)
    config.step = step;
  } else {
    alert("Выберите тип кухни перед продолжением!");
  }

  }

 


}

function prev() {
  if (kitchenSizes.step > 0) {
    kitchenSizes.step--;
    config.step = step;
  }
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
