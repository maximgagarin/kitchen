<template>
  <div class=" grid grid-cols-2 gap-4 ">
  
   

    <!-- Духовка и её положение -->
    <div >
      <div>
        <label for="selectedOven" class="block text-xs font-medium text-gray-700 mb-1">Плита:</label>
        <select 
          id="selectedOven" 
          v-model="kitchenSizesStore.oven.size"
          class="w-20 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          @change =  "$emit('select' ,  'oven')"
        >
          <!-- <option value="0">нет</option>  -->
          <option value="0.45">45 см</option>
          <option value="0.6">60 см</option>
        </select>
      </div>
    </div>


     <div >
      <div>
        <label for="selectedOven" class="block text-xs font-medium text-gray-700 mb-1">Плита:</label>
        <select 
          id="selectedOven" 
          v-model="kitchenSizesStore.oven.side"
          class="w-30 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          @change =  "$emit('select' ,  'change_side_oven')"
        >
          <!-- <option value="0">нет</option>  -->
          <option value="direct">справа</option>
          <option value="left">слева</option>
        </select>
      </div>
    </div>

     <div >
      <div v-if="!penalStore.isOven">
        <label for="selectedOven" class="block text-xs font-medium text-gray-700 mb-1">дух тип:</label>
        <select 
          id="selectedOven" 
        
          class="w-30 px-3 py-2 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          @change =  "$emit('select' ,  'oven_type')"
        >
          <option value="1">встр.</option> 
          <option value="2">обыч.</option>
         
        </select>
      </div>
    </div>

    <!-- Посудомойка -->
    <div>
      <label for="selectedDishwasher" class="block text-xs font-medium text-gray-700 mb-1">Посудомойка:</label>
      <select 
        id="selectedDishwasher" 
        v-model="kitchenSizesStore.dishwasher.size"
        class="w-30 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
         @change =  "$emit('select' , 'dishwasher')"
      >
        <option value="0">нет</option>
        <option value="0.45">45 см</option>
        <option value="0.6">60 см</option>
      </select>
    </div>
  </div>

</template>
<script setup>
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../pinia/penals";
const emit = defineEmits(["select"]);
const penalStore = usePenalStore()
const kitchenSizesStore = useKitchenSizesStore();
let sinkOptions;
if (kitchenSizesStore.type == "direct") {
  sinkOptions = [0.5, 0.6, 0.8];
} else {
  sinkOptions = [1];
}
// Варианты размеров мойки
</script>
