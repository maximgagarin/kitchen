<template>
    <div class="flex gap-1">
        <button class="compact-btn bg-amber-500 hover:bg-amber-600"
         @click="changeVariant(-1)" :disabled="index <= 0">←</button>
         
        <button class="compact-btn bg-amber-500 hover:bg-amber-600"
         @click="changeVariant(+1)" :disabled="index >= algStore.variants.length - 1" >→</button>
    </div>

</template>
<script setup>

import { inject , ref } from 'vue';
import { useAlgorithmStore } from '../../../pinia/Algorithm';
import { useKitchenSizesStore } from '../../../pinia/kitchenSizes';

const algStore = useAlgorithmStore()
const kitchenStore = useKitchenSizesStore()
const algorithmManager = inject("algorithmManager");
let index = ref(0)


function changeVariant(value){
    index.value += value
   
    algorithmManager.value.algorithm1level.new(index.value)
 

    
    Object.keys(algStore.variantIndex.level1).forEach(key => {
        algStore.variantIndex.level1[key] = 0
    })

    Object.keys(algStore.variantIndex.level2).forEach(key => {
        algStore.variantIndex.level2[key] = 0
    })

    algorithmManager.value.algorithm2level.createParts()

    algorithmManager.value.algorithm2level.buildDirect();
    if(kitchenStore.type === "left") algorithmManager.value.algorithm2level.buildLeft();
}

</script>