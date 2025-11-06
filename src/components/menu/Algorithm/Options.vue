<template>
  <div class=" grid grid-cols-2 gap-4 ">
  
   

    <!-- Духовка и её положение -->
 
     <div >
      <div>
        <label for="selectedOven" class="block text-xs font-medium text-gray-700 mb-1">Плита:</label>
        <select 
          id="selectedOven" 
          v-model="kitchenSizesStore.oven.side"
          class="w-30 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
        
        >
          <!-- <option value="0">нет</option>  -->
          <option value="direct">справа</option>
          <option value="left">слева</option>
        </select>
      </div>
    </div>

     <div >

    </div>

    <!-- Посудомойка -->
    <div>
      <label for="selectedDishwasher" class="block text-xs font-medium text-gray-700 mb-1">Посудомойка:</label>
      <select 
        id="selectedDishwasher" 
        v-model="kitchenSizesStore.dishwasher.side"
        class="w-30 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
         
      >
         <option value="direct">справа</option>
          <option value="left">слева</option>
      </select>
    </div>
  </div>

</template>
<script setup>
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../pinia/penals";
import { useAlgorithmStore } from "../../../pinia/Algorithm";


const kitchenSizesStore = useKitchenSizesStore();


// Варианты размеров мойки
</script>
