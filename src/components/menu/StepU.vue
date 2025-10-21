<template>
<div
  class="flex space-x-4 pb-4 overflow-x-auto scroll-smooth select-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      @wheel.prevent="(e) => {
        if (e.shiftKey) return
        e.currentTarget.scrollLeft += e.deltaY
      }"
      >
  <label
    v-for="option in options"
    :key="option.value"
    class="w-16 flex-shrink-0 relative border-2 rounded-lg p-2 cursor-pointer transition-all duration-200"
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
      <span class="text-sm font-medium text-gray-700 text-center">{{ option.label }}</span>
    </div>
  </label>
</div>
  <!-- <Select3levelHeight /> -->
</template>

<script setup>
import { ref,inject  } from "vue";
import config from "../config/config";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import Select3levelHeight from "./components/Select3levelHeight.vue";

const kitchenStore = useKitchenSizesStore()

const options = [
  { value: 'direct1_left1_right1', label: '0' },
  { value: 'direct1_direct_2_left1_right1', label: '1' },
  { value: 'direct1_direct_2_left1_left2_right1', label: '2' },
  { value: 'direct1_direct_2_left1_right1_right2', label: '3' },
  { value: 'direct1_left1_left2_right1_right2', label: '4' },
  { value: 'direct1_direct2_left1_left2_right1_right2', label: '5' },
  // { value: 'direct1_direct2_direct3_left1_right1', label: 'п2 л2 пр2' },
  // { value: 'direct1_direct2_direct3_left1_left2_left3', label: 'прямо 2 л 2ряд пр1' },
  // { value: 'direct1_direct2_direct3_right1_right2_right3', label: 'п2 л1 пр2' },
  // { value: 'direct1_left1_left2_left3_right1_right2_right3', label: 'п1 л2 пр2' },
  // { value: 'direct1_direct2_direct3_left1_left2_left3_right1_right2_right3', label: 'п2 л2 пр2' }
]


const cabinetBuilder = inject('cabinetBuilder');


const selectedOption = ref(null);

function updateConfig() {
  if (selectedOption.value === "direct1_left1_right1") {
    cabinetBuilder.value.executeConfig("direct1_left1_right1")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
     config.kitchen_levels = 2

   
    kitchenStore.levels.direct2 = false
    kitchenStore.levels.left2 = false
    kitchenStore.levels.right2 = false

  } else if (selectedOption.value === "direct1_direct_2_left1_right1") {
    cabinetBuilder.value.executeConfig("direct1_direct_2_left1_right1")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
    
    
    kitchenStore.levels.direct2 = true
    kitchenStore.levels.left2 = false
    kitchenStore.levels.right2 = false

     
  } else if (selectedOption.value === "direct1_direct_2_left1_left2_right1") {
    cabinetBuilder.value.executeConfig("direct1_direct_2_left1_left2_right1")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
     config.kitchen_levels = 2


    kitchenStore.levels.direct2 = true
    kitchenStore.levels.left2 = true
    kitchenStore.levels.right2 = false

  } else if (selectedOption.value === "direct1_direct_2_left1_right1_right2") {
    cabinetBuilder.value.executeConfig("direct1_direct_2_left1_right1_right2")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
     config.kitchen_levels = 2

    kitchenStore.levels.direct2 = true
    kitchenStore.levels.left2 = false
    kitchenStore.levels.right2 = true


  } else if (selectedOption.value === "direct1_left1_left2_right1_right2") {
    cabinetBuilder.value.executeConfig("direct1_left1_left2_right1_right2")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
     config.kitchen_levels = 2


      kitchenStore.levels.direct2 = false
    kitchenStore.levels.left2 = true
    kitchenStore.levels.right2 = true



  } else if (selectedOption.value === "direct1_direct2_left1_left2_right1_right2") {
    cabinetBuilder.value.executeConfig("direct1_direct2_left1_left2_right1_right2")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    config.level3 = false
     config.kitchen_levels = 2

          kitchenStore.levels.direct2 = true
    kitchenStore.levels.left2 = true
    kitchenStore.levels.right2 = true


  } else if (selectedOption.value === "direct1_direct2_direct3_left1_right1") {
    cabinetBuilder.value.executeConfig("direct1_direct2_direct3_left1_right1")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)+ Number(config.panels_size.height3level)).toFixed(3)
    config.level3 = false
    config.level3 = true
    config.kitchen_levels = 3
  } else if (selectedOption.value === "direct1_direct2_direct3_left1_left2_left3") {
    cabinetBuilder.value.executeConfig("direct1_direct2_direct3_left1_left2_left3")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)+ Number(config.panels_size.height3level)).toFixed(3)
    config.level3 = true
    config.kitchen_levels = 3
  } else if (selectedOption.value === "direct1_direct2_direct3_right1_right2_right3") {
    cabinetBuilder.value.executeConfig("direct1_direct2_direct3_right1_right2_right3")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)+ Number(config.panels_size.height3level)).toFixed(3)
    config.level3 = true
    config.kitchen_levels = 3
  } else if (selectedOption.value === "direct1_left1_left2_left3_right1_right2_right3") {
    cabinetBuilder.value.executeConfig("direct1_left1_left2_left3_right1_right2_right3")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)+ Number(config.panels_size.height3level)).toFixed(3)
    config.level3 = true
    config.kitchen_levels = 3
  } else if (selectedOption.value === "direct1_direct2_direct3_left1_left2_left3_right1_right2_right3") {
    cabinetBuilder.value.executeConfig("direct1_direct2_direct3_left1_left2_left3_right1_right2_right3")
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)+ Number(config.panels_size.height3level)).toFixed(3)
    config.level3 = true
    config.kitchen_levels = 3

  } 


  
// function updateConfig() {
//   const option = options.find(opt => opt.value === selectedOption.value);
//   if (option) {
//     cabinetBuilder.value.executeConfig(option.value);
//     config.penals.size = option.size;
//   }
// }
}
</script>
