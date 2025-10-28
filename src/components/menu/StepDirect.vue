<template>
  <div class="space-y-6 p-1 max-w-3xl mx-auto">
    <h2 class="text-sm font-medium text-gray-800 mb-4">варианты</h2>

    <div class="flex space-x-4  overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
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

    <div class="mt-6">
      <!-- <Select3levelHeight /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import config from "../config/config";
import Select3levelHeight from "./components/Select3levelHeight.vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";

const kitchenStore = useKitchenSizesStore()

const options = ref([
  { value: "d1", label: "1" },
  {
    value: "d2",
    label: "2",
   
  },
 // { value: "d3", label: "3-й уровень", image: "img/button/direct/3.jpg" },
]);

const cabinetBuilder = inject("cabinetBuilder");

const selectedOption = ref(null);

function updateConfig() {

  if(kitchenStore.sink.isSet) clear()


  if (selectedOption.value === "d1") {
    cabinetBuilder.value.executeConfig("direct1");
    
    config.kitchen_size.height = 2.118;
    config.level3 = false
    config.kitchen_levels = 1
    kitchenStore.levels.direct1 = true
    kitchenStore.levels.direct2 = false

    
    
  } else if (selectedOption.value === "d2") {
    cabinetBuilder.value.executeConfig("direct1_direct2");
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)).toFixed(3)
    
    config.level3 = false
    config.kitchen_levels = 2

    kitchenStore.levels.direct1 = true
    kitchenStore.levels.direct2 = true
   // config.penals.size = 2.1;
  } else if (selectedOption.value === "d3") {
    cabinetBuilder.value.executeConfig("direct1_direct2_direct3");
    config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level)+ Number(config.panels_size.height3level)).toFixed(3)
   // config.penals.size = 2.4;
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

<style scoped>
h2 {
  margin-bottom: 15px;
}

input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  border-radius: 50%;
  width: 20px;
  height: 20px;

  border: 2px solid #999;

  outline: none;
  margin-right: 5px;

  position: relative;
  top: 4px;
}

input:hover {
  border: 4px solid #005cc8;
}

input:checked {
  border: 4px solid #005cc8;
}
</style>
