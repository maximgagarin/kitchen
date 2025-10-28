<template>
  <div class="space-y-6 p-1 max-w-3xl mx-auto">
    <h2 class="text-xs font-medium text-gray-800 mb-4">Варианты</h2>
    
<div
  class="flex space-x-4  overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
  @wheel.prevent="(e) => {
    const target = e.currentTarget
    target.scrollLeft += e.deltaY
  }"
>
  <label
    v-for="option in options"
    :key="option.value"
    class="w-16 flex-shrink-0 relative border-2 rounded-lg p-1 cursor-pointer transition-all duration-200"
    :class="{
      'border-gray-300 hover:border-gray-400': selectedOption !== option.value,
      'border-blue-500 ring-2 ring-blue-200': selectedOption === option.value
    }"
  >
    <input
      type="radio"
      class="absolute opacity-0"
      name="angle_blocks"
      :value="option.value"
      v-model="selectedOption"
      @change="updateConfig"
    />
    <div class="flex flex-col items-center space-y-2">
      <div class="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
        <span class="text-gray-500 text-xs">Изображение</span>
      </div>
      <!-- <span class="text-sm font-medium text-gray-700 text-center">{{ option.label }}</span> -->
    </div>
  </label>
</div>

    <!-- <div class="mt-2">
      <Select3levelHeight />
    </div> -->
  </div>
</template>

<script setup>
import { ref,inject  } from "vue";
import config from "../config/config";
import Select3levelHeight from "./components/Select3levelHeight.vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";


const options = [
  { value: 'direct1_left1', label: '1' },
  { value: 'direct1_direct2_left1', label: '2' },
  { value: 'direct1_left1_left2', label: '3' },
  { value: 'direct1_direct2_left1_left2', label: '4' },
 // { value: 'direct1_left1_left2_left3', label: 'Прямо низ лево 2ряд' },
 // { value: 'direct1_direct2_direct3_left1_left2_left3', label: 'Прямо низ лево 2ряд' }
];

const kitchenStore = useKitchenSizesStore()




const cabinetBuilder = inject('cabinetBuilder');


const selectedOption = ref(null);

function updateConfig() {

  if(kitchenStore.sink.isSet) clear()

  if (selectedOption.value === "direct1_left1") {
    cabinetBuilder.value.executeConfig("direct1_left1")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
    config.kitchen_levels = 2
    kitchenStore.levels.direct1 = true
    kitchenStore.levels.direct2 = false
    kitchenStore.levels.left1 = true
    kitchenStore.levels.left2 = false

  
  } else if (selectedOption.value === "direct1_direct2_left1") {
    cabinetBuilder.value.executeConfig("direct1_direct2_left1")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level) ).toFixed(3)
    config.level3 = false
    config.kitchen_levels = 2
    kitchenStore.levels.direct1 = true
    kitchenStore.levels.direct2 = true
    kitchenStore.levels.left1 = true
    kitchenStore.levels.left2 = false
    
  } else if (selectedOption.value === "direct1_left1_left2") {
    cabinetBuilder.value.executeConfig("direct1_left1_left2")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false 
    config.kitchen_levels = 2
    kitchenStore.levels.direct1 = true
    kitchenStore.levels.direct2 = false
    kitchenStore.levels.left1 = true
    kitchenStore.levels.left2 = true
  }
  else if (selectedOption.value === "direct1_direct2_left1_left2") {
    cabinetBuilder.value.executeConfig("direct1_direct2_left1_left2")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
    config.kitchen_levels = 2
    kitchenStore.levels.direct1 = true
    kitchenStore.levels.direct2 = true
    kitchenStore.levels.left1 = true
    kitchenStore.levels.left2 = true
  }
  else if (selectedOption.value === "direct1_left1_left2_left3") {
    cabinetBuilder.value.executeConfig("direct1_left1_left2_left3")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level) + Number(config.panels_size.height3level)).toFixed(3)
    config.level3 = true
    config.kitchen_levels = 3
   
   
  }
  else if (selectedOption.value === "direct1_direct2_direct3_left1_left2_left3") {
    cabinetBuilder.value.executeConfig("direct1_direct2_direct3_left1_left2_left3")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level) + Number(config.panels_size.height3level)).toFixed(3)
    config.level3 = true
    config.kitchen_levels = 3
  }
}


 function clear(){
    // удалить раковину
      ['SinkNormal', 'sinkModel'].forEach((name) => {
      cabinetBuilder.value.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => cabinetBuilder.value.scene.remove(element));
    })

    kitchenStore.parts.length = 0
    kitchenStore.rules.length = 0
    kitchenStore.filtredRules.length = 0,
    kitchenStore.filtredRulesTotal.length = 0

    kitchenStore.availableOven.length =  0
    kitchenStore.availableDish.length = 0
    kitchenStore.sink.isSet = false


    // this.KitchenSizes.dishwasher.size = 0
    // this.KitchenSizes.oven.size = 0
  }
</script>
