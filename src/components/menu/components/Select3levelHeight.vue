<template>
  <div class="space-y-1">
    <div class="flex items-center gap-2 mt-3">
      <!-- Второй ряд -->
      <p class="text-sm whitespace-nowrap">второй ряд</p>
      <label v-for="height in height2Options" :key="height.value"
        class="relative border-2 w-14 rounded-lg p-1 cursor-pointer" :class="{
          'border-gray-300 hover:border-gray-400': config.panels_size.height2level !== height.value,
          'border-blue-500 ring-2 ring-blue-200': config.panels_size.height2level === height.value
        }">
        <input type="radio" class="absolute opacity-0" name="height2level" :value="height.value"
          v-model.number="config.panels_size.height2level" v-model="kitchenStore.modules_height.height2level"
          @change="updateHeight2level" />
        <div class="flex flex-col items-center">
          <span class="text-xs font-medium text-gray-700">{{ height.label }}  см</span>
        </div>
      </label>
    </div>

    <!-- Третий ряд (если доступен) -->
    <div v-if="config.level3" class="grid grid-cols-2 gap-4 mt-4">
      <label v-for="height in height3Options" :key="height.value"
        class="relative border-2 rounded-lg p-3 cursor-pointer transition-all duration-200" :class="{
          'border-gray-300 hover:border-gray-400': config.panels_size.height3level !== height.value,
          'border-blue-500 ring-2 ring-blue-200': config.panels_size.height3level === height.value
        }">
        <input type="radio" class="absolute opacity-0" name="height3level" :value="height.value"
          v-model.number="config.panels_size.height3level" @change="updateHeight3level" />
        <div class="flex flex-col items-center">
          <span class="text-sm font-medium text-gray-700">{{ height.label }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { compile, inject } from 'vue';
import config from '../../config/config';
import { useKitchenSizesStore } from '../../../pinia/kitchenSizes';
const cabinetBuilder = inject("cabinetBuilder");
const penalBuilder = inject("penalBuilder");

const kitchenStore = useKitchenSizesStore()

const height2Options = [
  { value: 0.7, label: '700' },
  { value: 0.9, label: '900' }
];

const height3Options = [
  { value: 0.35, label: 'Третий ряд 350' },
  { value: 0.45, label: 'Третий ряд 450' }
];



function updateHeight3level() {
  const value = parseFloat(event.target.value);
  config.kitchen_size.height = Number((1.418 + Number(config.panels_size.height2level) + Number(config.panels_size.height3level)).toFixed(3));

  cabinetBuilder.value.executeConfig("actual", "currectActual")
  penalBuilder.value.builder()
}

function updateHeight2level() {
   if(kitchenStore.sink.isSet) clear()
  const value = parseFloat(event.target.value);
  config.kitchen_size.height = (1.418 + Number(config.panels_size.height2level) + (config.kitchen_levels == 3 ? Number(config.panels_size.height3level) : 0)).toFixed(3);

  const y = Number(config.kitchen_size.height)
  console.log('y', y)
  const lineHeight = config.lines.find(item => item.name === "lineHeight");

  const start = lineHeight.start
  const end = lineHeight.end


  lineHeight.update({ x: start.x, y: 0, z: start.z }, { x: end.x, y: y, z: end.z })

  cabinetBuilder.value.executeConfig("actual", "currectActual")
  penalBuilder.value.builder()
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

<style>
.height_3level {
  margin-top: 15px;
  border: 1px solid gray;
  border-radius: 5px;

  height: 60px;
}

.height_2level {
  margin-top: 15px;
  border: 1px solid gray;
  border-radius: 5px;

  height: 60px;
}
</style>