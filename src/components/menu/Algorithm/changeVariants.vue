<template>

  <div class="flex flex-col gap-1 mt-3">
    <!-- Уровень 2 -->
    <div class="bg-white p-1 rounded-lg shadow-xs">
         <p class="text-xs font-medium text-gray-600">второй уровень</p>
      
      <div class="grid grid-cols-3 gap-3">
        <!-- Группы кнопок -->
 
         <div v-if="algStore.filtredLevel2.leftPart2?.length" class="space-y-1">
       
          <div class="flex gap-1">
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft2l2(-1)" :disabled="index2level.left2 <= 0">←</button>
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft2l2(+1)" :disabled="index2level.left2 >= algStore.filtredLevel2.leftPart2.length - 1">→</button>
          </div>
        </div>


        <div v-if="algStore.filtredLevel2.leftPart1?.length" class="space-y-1">
         
          <div class="flex gap-1">
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft1l2(-1)" :disabled="index2level.left1 <= 0">←</button>
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft1l2(+1)" :disabled="index2level.left1 >= algStore.filtredLevel2.leftPart1.length - 1">→</button>
          </div>
        </div> 


        <div v-if="algStore.filtredLevel2.directPart1?.length" class="space-y-1">
       
          <div class="flex gap-1">
            <button class="compact-btn" @click="changeVariantDirectl2(-1)" :disabled="index2level.direct1 <= 0">←</button>
            <button class="compact-btn" @click="changeVariantDirectl2(+1)" :disabled="index2level.direct1 >= algStore.filtredLevel2.directPart1.length - 1">→</button>
          </div>
        </div>

        <div v-if="algStore.filtredLevel2.directPart2?.length" class="space-y-1">
        
          <div class="flex gap-1">
            <button class="compact-btn " @click="changeVariantDirect2l2(-1)" :disabled="index2level.direct2 <= 0">←</button>
            <button class="compact-btn" @click="changeVariantDirect2l2(+1)" :disabled="index2level.direct2 >= algStore.filtredLevel2.directPart2.length - 1">→</button>
          </div>
        </div>

    
      </div>
    </div>

    <!-- Уровень 1 -->
    <div class="bg-white p-1 rounded-lg shadow-xs">

      <p class="text-xs font-medium text-gray-600">первый уровень</p>
      
      <div class="grid grid-cols-3 gap-2">
        <!-- Аналогичные группы кнопок для уровня 1 -->

        <div v-if="algStore.filtredLeftPart2?.length" class="space-y-1">
   
          <div class="flex gap-1">
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft2(-1)" :disabled="index.left2 <= 0">←</button>
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft2(+1)" :disabled="index.left2 >= algStore.filtredLeftPart2.length - 1">→</button>
          </div>
        </div>

        <div v-if="algStore.filtredLeftPart1?.length" class="space-y-1">
    
          <div class="flex gap-1">
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft1(-1)" :disabled="index.left1 <= 0">←</button>
            <button class="compact-btn bg-amber-500 hover:bg-amber-600" @click="changeVariantLeft1(+1)" :disabled="index.left1 >= algStore.filtredLeftPart1.length - 1">→</button>
          </div>
        </div>

     


        <div v-if="algStore.filtredDirectPart1?.length" class="space-y-1">

          <div class="flex gap-1">
            <button class="compact-btn" @click="changeVariantDirect(-1)" :disabled="index.direct1 <= 0">←</button>
            <button class="compact-btn" @click="changeVariantDirect(+1)" :disabled="index.direct1 >= algStore.filtredDirectPart1.length - 1">→</button>
          </div>
        </div>

        <div v-if="algStore.filtredDirectPart2?.length" class="space-y-1">
     
          <div class="flex gap-1">
            <button class="compact-btn" @click="changeVariantDirect2(-1)" :disabled="index.direct2 <= 0">←</button>
            <button class="compact-btn" @click="changeVariantDirect2(+1)" :disabled="index.direct2 >= algStore.filtredDirectPart2.length - 1">→</button>
          </div>
        </div>

     
      </div>
    </div>
  </div>
</template>

<style>
.compact-btn {
@apply max-w-[50px] px-2 py-1 text-sm bg-emerald-500 text-white rounded 
         hover:bg-emerald-600 transition-colors disabled:opacity-40 
         disabled:cursor-not-allowed flex-1 text-center;
}
</style>

<script setup>
import { inject, ref} from "vue";
import { useAlgorithmStore } from "../../../pinia/Algorithm";
import { algorithmConfig } from "../../configurator/builders/Algorithm/algorithmConfig";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { plannerConfig } from "../../configurator/planner/planerConfig";


const algorithmManager = inject("algorithmManager");
const plannerManager = inject("plannerManager");
const algStore = useAlgorithmStore()
const kithenStore = useKitchenSizesStore()

const index = algStore.variantIndex.level1
const index2level = algStore.variantIndex.level2

const kithcenType = kithenStore.type


function changeVariantDirect(delta)  {
 const oldOvenPos = algorithmConfig.oven.position
 index.direct1 +=delta 
 algorithmManager.value.algorithm1level.variantDirect(index.direct1,index.direct2 );
 const currentOvenPos = algorithmConfig.oven.position

 const isChangedOvenPos = oldOvenPos === currentOvenPos
 // меняем верхний ряд если сдвинулась духовка 

 console.log(oldOvenPos, currentOvenPos, isChangedOvenPos)
 if(!isChangedOvenPos && algorithmConfig.oven.side == 'direct'){
    console.log('смена')
     algorithmManager.value.algorithm2level.createParts()
    algorithmManager.value.algorithm2level.buildDirect();
   if(kithcenType === 'left') algorithmManager.value.algorithm2level.buildLeft()
      index2level.direct1 = 0
      index2level.direct2 = 0

 }
  plannerManager.value.tableTop.create() 
  calcEmpties()
};

function changeVariantDirect2(delta)  {
 const oldOvenPos = algorithmConfig.oven.position
 index.direct2 +=delta 
 algorithmManager.value.algorithm1level.variantDirect(index.direct1,index.direct2 );
 const currentOvenPos = algorithmConfig.oven.position
 const isChangedOvenPos = oldOvenPos === currentOvenPos
 // меняем верхний ряд если сдвинулась духовка 

 console.log(oldOvenPos, currentOvenPos, isChangedOvenPos)
 if(!isChangedOvenPos && algorithmConfig.oven.side == 'direct'){
    console.log('смена2')
    algorithmManager.value.algorithm2level.createParts()
    algorithmManager.value.algorithm2level.buildDirect();
      if(kithcenType === 'left')  algorithmManager.value.algorithm2level.buildLeft();
    index2level.direct1 = 0
    index2level.direct2 = 0
 }

  plannerManager.value.tableTop.create() 
  calcEmpties()
};


function changeVariantLeft1(delta)  {
 const oldOvenPos = algorithmConfig.oven.position
 index.left1 +=delta 
 algorithmManager.value.algorithm1level.variantLeft(index.left1,index.left2 );
 const currentOvenPos = algorithmConfig.oven.position
 const isChangedOvenPos = oldOvenPos === currentOvenPos
  console.log(oldOvenPos, currentOvenPos, isChangedOvenPos)
 if(!isChangedOvenPos && algorithmConfig.oven.side == 'left'){
    console.log('смена')
    algorithmManager.value.algorithm2level.createParts()

    algorithmManager.value.algorithm2level.buildLeft();
    algorithmManager.value.algorithm2level.buildDirect(index2level.direct1,index2level.direct2);

    index2level.left1 = 0
    index2level.left2 = 0
 }

  plannerManager.value.tableTop.create()
  calcEmpties() 
};


function changeVariantLeft2(delta)  {
 const oldOvenPos = algorithmConfig.oven.position

 index.left2 +=delta 
 algorithmManager.value.algorithm1level.variantLeft(index.left1,index.left2 );
 const currentOvenPos = algorithmConfig.oven.position
 const isChangedOvenPos = oldOvenPos === currentOvenPos
  console.log(oldOvenPos, currentOvenPos, isChangedOvenPos)
 if(!isChangedOvenPos && algorithmConfig.oven.side == 'left'){
    console.log('смена')
    algorithmManager.value.algorithm2level.createParts()

     algorithmManager.value.algorithm2level.buildLeft();
    algorithmManager.value.algorithm2level.buildDirect(index2level.direct1,index2level.direct2);
    index2level.left1 = 0
    index2level.left2 = 0
 }

 plannerManager.value.tableTop.create() 
 calcEmpties()
};



function changeVariantDirectl2(delta)  {
  
 index2level.direct1 +=delta 
  algorithmManager.value.algorithm2level.createParts()
 algorithmManager.value.algorithm2level.buildDirect(index2level.direct1,index2level.direct2 );
    if(kithcenType === 'left')  algorithmManager.value.algorithm2level.buildLeft(index2level.left1,index2level.left2);

     filterModelsArray()

};
function changeVariantDirect2l2(delta)  {
  
 index2level.direct2 +=delta 
 algorithmManager.value.algorithm2level.createParts()
 algorithmManager.value.algorithm2level.buildDirect(index2level.direct1,index2level.direct2  );
    if(kithcenType === 'left')  algorithmManager.value.algorithm2level.buildLeft(index2level.left1,index2level.left2);

     filterModelsArray()

};


function changeVariantLeft1l2(delta)  {
 
 index2level.left1 +=delta 
 algorithmManager.value.algorithm2level.createParts()
 algorithmManager.value.algorithm2level.buildLeft(index2level.left1,index2level.left2 );
 algorithmManager.value.algorithm2level.buildDirect(index2level.direct1,index2level.direct2 );
  filterModelsArray()

};
function changeVariantLeft2l2(delta)  {
 
 index2level.left2 +=delta 
 algorithmManager.value.algorithm2level.createParts()
 algorithmManager.value.algorithm2level.buildLeft(index2level.left1,index2level.left2);
 algorithmManager.value.algorithm2level.buildDirect(index2level.direct1,index2level.direct2 );
  filterModelsArray()

};


function filterModelsArray(){
  const newArray = []
  plannerConfig.models.length = 0

     plannerConfig.models = [...plannerConfig.modelsLeft, ...plannerConfig.modelsDirect ,
       ...plannerConfig.modelsDirect2L, ...plannerConfig.modelsLeft2L, ...plannerConfig.penalsArray];

}


function calcEmpties(){
  plannerManager.value.emptyManager.calculateEmpties();

}
</script>