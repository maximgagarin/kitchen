<template>
  <!-- Левая панель с изображением -->


    <!-- Блок превью -->
  <div
    class="fixed top-20 right-[70vh] w-[300px] h-[350px] bg-gray-100 pointer-events-none rounded-md shadow-lg overflow-hidden transition-all duration-100"
    :style="{
      
      opacity: hoveredItem ? 1 : 0,
      transform: hoveredItem ? 'scale(1)' : 'scale(0.95)',
    }"
  >
    <transition name="fade" mode="out-in">
      <img
        v-if="hoveredItem"
        :key="hoveredItem.src"
        :src="hoveredItem.src"
        alt="Модуль"
        class="w-full h-full object-contain p-4"
      />
    </transition>
  </div>

  <div  class="max-w-4xl mx-auto p-1">
 

  <!-- Выбор типа пенала -->
  <div class="mb-8">
    <p class="text-xs ">Тип пенала</p>

    <!-- Контейнер со скроллом -->
    <div
      class="flex space-x-4 pb-4 overflow-x-auto scroll-smooth p-1 select-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      @wheel.prevent="(e) => {
        if (e.shiftKey) return
        e.currentTarget.scrollLeft += e.deltaY
      }"
      >
      <label
        v-for="option in penalOptions"
        :key="option.value"
        class="flex-none w-12  h-20 cursor-pointer rounded-md border p-1 text-center transition duration-150 ease-in-out"
        :class="{
          'border-blue-500 bg-blue-50 scale-105 shadow-md': selectedOption === option.value,
          'border-gray-300 hover:border-gray-400 hover:bg-gray-50': selectedOption !== option.value
        }"
        @mouseenter="hoveredItem = option"
        @mouseleave="hoveredItem = null"
      >
        <input
          class="hidden"
          type="radio"
          name="penal_type"
          :value="option.value"
          v-model="selectedOption"
        />
        <div class="flex flex-col items-center">
          <!-- Пример иконки (можно заменить на свой SVG или изображение) -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 mb-1 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect x="6" y="4" width="12" height="16" rx="1" />
          </svg>
          <p class="text-sm font-medium text-gray-700">{{ option.label }}</p>
        </div>
      </label>
    </div>
  </div>

  <!-- Выбор ширины -->
  <div v-if="selectedOption != 10" class="mb-3">
   
    <div class="flex space-x-3">
       <p class="text-xs flex  font-semibold text-gray-700  items-center">Ширина</p>
      <button
        v-for="width in ['400', '450', '600']"
        :key="width"
        @click="selectedWidth = width"
        :class="[
          'px-1 py-1 rounded-lg border text-xs font-medium  transition',
          selectedWidth === width
            ? 'bg-gray-100 text-brand '
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        ]"
      >
        {{ width }} мм
      </button>
    </div>
  </div>

  <!-- Выбор положения -->
  <div class="mb-3">
   
    <div class="flex space-x-4 max-h-12">
     
      <button
        
        @click="addLeft"
        :class="[
          ' py-1 px-1  rounded-lg border text-xs font-medium transition flex items-center gap-2',
      
        ]"

        :disabled="(isLeftEndPenal && selectedOption == 10 && selectedPosition === 'left') ||
         ((kitchenStore.fridge.side === 'left' || kitchenStore.fridge.side === 'directLeft') && selectedOption === 10 && selectedPosition === 'left' && kitchenStore.fridge.isSet) 
        "
      > добавить слева
      </button>

      <button
        @click="addRight"
        :class="[
          'px-1 py-1 rounded-lg border text-sm text-xs font-medium transition flex items-center gap-2',
        ]"
        :disabled = " (isRightEndPenal && selectedOption == 10 && selectedPosition === 'right') ||
          ((kitchenStore.fridge.side === 'right' || kitchenStore.fridge.side == 'directRight') && selectedOption === 10 && selectedPosition === 'right' && kitchenStore.fridge.isSet)"

      >  добавить справа
      </button>
    </div>



      

  </div>


  <!-- Список добавленных пеналов -->

<div class="mt-8" v-if="penalStore.penals.length > 0">
  <h3 class="text-xs font-semibold text-gray-700 mb-3">Добавленные пеналы</h3>

  <div class="grid grid-cols-2 gap-4 max-h-32 overflow-y-auto">
    <!-- Левая колонка -->
    <div>
      
      <ul class="space-y-2">
        <li
          v-for="(penal, index) in leftPenals"
          :key="penal.id"
          class="flex justify-between items-center bg-gray-100   pl-2  rounded-lg  shadow-sm"
          :class="{ 'bg-gray-200': hoveredPenalId === penal.id }"
          @mouseenter="highlightPenal(penal.id)"
          @mouseleave="clearHighlight()"
        >
          <div class="text-gray-700 font-medium text-xs ">
            <span>{{ penal.width * 1000 }} мм</span>
            <span> левый</span>
          </div>
          <button
            class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
            @click="delPenal(penal.id, penal.side)"
            title="Удалить"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </div>

    <!-- Правая колонка -->
    <div>
  
      <ul class="space-y-2">
        <li
          v-for="(penal, index) in rightPenals"
          :key="penal.id"
          class="flex justify-between items-center bg-gray-100  pl-2 rounded-lg  shadow-sm"
           :class="{ 'bg-gray-200': hoveredPenalId === penal.id }"
          @mouseenter="highlightPenal(penal.id)"
          @mouseleave="clearHighlight()"
        >
          <div class="text-gray-700 font-medium  text-xs">
            <span>{{ penal.width * 1000 }} мм</span>
            <span> правый</span>
          </div>
          <button
            class="text-red-500 hover:text-red-700 p-1  rounded-full hover:bg-red-50 transition-colors"
            @click="delPenal(penal.id, penal.side)"
            title="Удалить"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>

   
  </div> 


   <!-- холодильник -->
  <fridge
    :isLeftEndPenal="isLeftEndPenal"
    :isRightEndPenal="isRightEndPenal"
   />

  


  
</template>
<script setup>
import config4 from "../config/config4";
import config from "../config/config";
import { usePenalStore } from "../../pinia/penals";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { useRowSegmentsStore } from "../../pinia/RowSegments";
import { ref, inject, computed } from "vue";
import fridge from "./components/fridge.vue";
import { algorithmConfig } from "../configurator/builders/Algorithm/algorithmConfig";
import { useAlgorithmStore } from "../../pinia/Algorithm";
import { plannerConfig } from "../configurator/planner/planerConfig";

const penalOptions = [
  { value: "1", label: "1" , src:"/img/penals/penal1.png"},
  { value: "2", label: "2" , src:"/img/penals/penal2.png" },
  { value: "3", label: "3" , src:"/img/penals/penal3.png" },
  { value: "4", label: "4" , src:"/img/penals/penal1.png" },
  { value: "10", label: "т" , src:"/img/penals/penal2.png" },
  { value: "6", label: "5" , src:"/img/penals/penal3.png"},
  // { value: "7", label: "Встроенный холодильник" },
  // { value: "8", label: "2 пенала со встроенным хол. и мор." },
];

const penalStore = usePenalStore();
const kitchenStore = useKitchenSizesStore(); 
const rowSegmentsStore = useRowSegmentsStore();
const algStore  = useAlgorithmStore()

const cabinetBuilder = inject("cabinetBuilder");
const penalBuilder = inject("penalBuilder");

const selectedOption = ref("1");
const selectedPosition = ref(null);
const selectedWidth = ref("450");
const show = ref(false)
const hoveredPenalId = ref(null)

const selectedPositionFirdge = ref('left')

const hoveredItem = ref(null);


// есть торцевой пенал
const isLeftEndPenal = ref(false)
const isRightEndPenal = ref(false)

const leftPenals = computed(() =>
  penalStore.penals.filter(p => p.side === 'left' || p.side === 'directLeft')
)

const rightPenals = computed(() =>
  penalStore.penals.filter(p => p.side === 'right' || p.side === 'directRight')
)

const PENAL_END = 200 // размер торцевого пенала


// если шкаф торцевой(10) то ширина 450
const effectiveWidth = computed(() => {
  return selectedOption.value == 10 ? PENAL_END : selectedWidth.value
})

const select = computed(() => {
  return "penal" + effectiveWidth.value + "-" + selectedOption.value;
});

const PANEL_WIDTH = computed(() => {
  return Number(effectiveWidth.value) / 1000;
});

const PANEL_DEPTH = 0.6;
const maxPanels = 3;




function addLeft() {
  selectedPosition.value = 'left'

  const option = Number(selectedOption.value)

  // 1. Если уже есть левый конечный пенал — не добавляем
  if (isLeftEndPenal.value && option === 10 && selectedPosition.value === 'left') return

  // 2. Если с этой стороны стоит холодильник — тоже не добавляем
  if (
    (kitchenStore.fridge.side === 'left' || kitchenStore.fridge.side === 'directLeft') &&
    option === 10 &&
    selectedPosition.value === 'left' &&
    kitchenStore.fridge.isSet
  ) return

  // 3. Добавляем пенал
  addPenal()
}

function addRight() {
  selectedPosition.value = 'right'

  const option = Number(selectedOption.value)


  if (isRightEndPenal.value && option === 10 && selectedPosition.value === 'right') return

 
  if (
    (kitchenStore.fridge.side === 'right' || kitchenStore.fridge.side === 'directRight') &&
    option === 10 &&
    selectedPosition.value === 'right' &&
    kitchenStore.fridge.isSet
  ) return

 
  addPenal()
}


function delPenal(id, side) {
  clear()

  kitchenStore.isOvenPenal = ["1", "2", "3"].includes(selectedOption.value); // пенал с духовкой ? 
  rowSegmentsStore.removeSegment(id);
  penalBuilder.value.deletePenal(id, side);
  penalBuilder.value.builder();
  cabinetBuilder.value.executeConfig("actual", "currect");
  cabinetBuilder.value;
 // penalStore.penals.sort((a,b)=> a.index - b.index)


  // вычисление есть ли торцевой слева или справа
   const foundLeft = penalStore.penals.find(obj => (obj.side == "left" || obj.side == 'directLeft') && obj.oven == 10)
   const foundRight = penalStore.penals.find(obj => (obj.side == "right" || obj.side == 'directRight') && obj.oven == 10)
   if(!foundLeft) isLeftEndPenal.value = false
   if(!foundRight) isRightEndPenal.value = false

}



function addPenal() {
  clear()


  if (kitchenStore.type === "left") {
    if (selectedPosition.value === "left" && penalStore.countLeft < maxPanels) {
      if(kitchenStore.rowSizesCurrect.side_c < 0.6) return // если осталоась мало места в ряду выходим
      addLeftPenal();
    }
    if (
      selectedPosition.value === "right" && penalStore.countRightDirect < maxPanels) {
      if((kitchenStore.rowSizesCurrect.side_a) - 0.6 < 0.6) return // если осталоась мало места в ряду выходим
      addRightDirectPenal();
    }
  } else if (kitchenStore.type === "uShaped") {
    if (selectedPosition.value === "left" && penalStore.countLeft < maxPanels) {
      addLeftPenal();
    }
    if (
      selectedPosition.value === "right" &&
      penalStore.countRight < maxPanels
    ) {
      addRighPenal();
    }
  } else if (kitchenStore.type === "direct") {
    if (selectedPosition.value === "right" &&penalStore.countRightDirect < maxPanels) {
       if(kitchenStore.rowSizesCurrect.side_a   < 1) return // если осталоась мало места в ряду выходим
      addRightDirectPenal();
    }
    if (selectedPosition.value === "left" && config.countMaxDirectLeft < maxPanels) {
       if(kitchenStore.rowSizesCurrect.side_a  < 1) return // если осталоась мало места в ряду выходим
      addDirectLeftPenal();
    }
  }
}

function addLeftPenal() {

  const penalId = "penal_" + Date.now();
  let z = Number((kitchenStore.sideSizes.side_c - PANEL_WIDTH.value / 2 - penalStore.penalOffsetsState.left -0.01 ).toFixed(3));

  //если торцевой пенал сдвигаем другие
  if(selectedOption.value == 10){
    isLeftEndPenal.value = true

    const leftPenals = penalStore.penals.filter(penal => penal.side === 'left')

    leftPenals.forEach(penal =>{
      penal.z -=PENAL_END  / 1000
    })


    z =  kitchenStore.sideSizes.side_c - PANEL_WIDTH.value / 2 
  }

  penalStore.addPenal({
    x: Number(PANEL_DEPTH / 2).toFixed(3) ,
    y: 0,
    z: z,
    type: select.value,
    rotate: 0,
    side: "left",
    width: PANEL_WIDTH.value,
    id: penalId,
    isLevel2: false,
    isLevel3: false,
    level3height: 0,
    index:  config.countMaxLeft,
    oven: selectedOption.value,
  });




  penalBuilder.value.builder();
  cabinetBuilder.value.executeConfig("actual", "currect");

  console.log(PANEL_WIDTH.value)

}

function addRightDirectPenal() {
  const penalId = "penal_" + Date.now();
  let x =     kitchenStore.sideSizes.side_a -    penalStore.penalOffsetsState.directRight -    PANEL_WIDTH.value / 2;


    if(selectedOption.value == 10){
    isRightEndPenal.value = true

    const rightPenals = penalStore.penals.filter(penal => penal.side === 'directRight')
    rightPenals.forEach(penal =>{
      penal.x -=PENAL_END  / 1000
    })
    x =  kitchenStore.sideSizes.side_a - PANEL_WIDTH.value / 2 






  }


  penalStore.addPenal({
    x: x,
    y: 0,
    z: PANEL_DEPTH / 2 - 0.02,
    type: select.value,
    rotate: selectedOption.value == 10? 3 :2,
    side: "directRight",
    width: PANEL_WIDTH.value,
    id: penalId,
    isLevel2: false,
    isLevel3: false,
    level3height: 0,
    index: config.countMaxLeft,
    oven: selectedOption.value,
  });

  const start = x - PANEL_WIDTH.value / 2;
  const end = x + PANEL_WIDTH.value / 2;


  penalBuilder.value.builder();
  cabinetBuilder.value.executeConfig("actual", "currect");
}

function addRighPenal() {
  const penalId = "penal_" + Date.now();
  let z = Number((kitchenStore.sideSizes.side_d - PANEL_WIDTH.value / 2 - penalStore.penalOffsetsState.right).toFixed(3));


   //если торцевой пенал
  if(selectedOption.value == 10){
    isRightEndPenal.value = true

    const rightPenals = penalStore.penals.filter(penal => penal.side === 'right')
    rightPenals.forEach(penal =>{
      penal.z -=PENAL_END  / 1000
    })
    z =  kitchenStore.sideSizes.side_d - PANEL_WIDTH.value / 2 



  }


  



  penalStore.addPenal({
    x: kitchenStore.sideSizes.side_a - PANEL_DEPTH / 2 + 0.02,
    y: 0,
    z: z,
    type: select.value,
    rotate: selectedOption.value == 10? 0: 1,
    side: "right",
    width: PANEL_WIDTH.value,
    id: penalId,
    isLevel2: false,
    isLevel3: false,
    level3height: 0,
    index: config.countMaxLeft,
    oven: selectedOption.value,
  });

  const start = z - Number(PANEL_WIDTH.value / 2);
  const end = z + Number(PANEL_WIDTH.value / 2);


  penalBuilder.value.builder();
  cabinetBuilder.value.executeConfig("actual", "currect");
}

function addDirectLeftPenal() {
  const penalId = "penal_" + Date.now();
  let x = penalStore.penalOffsetsState.directLeft + PANEL_WIDTH.value / 2;


    if(selectedOption.value == 10){
    isLeftEndPenal.value = true

    const leftPenals = penalStore.penals.filter(penal => penal.side === 'directLeft')
    leftPenals.forEach(penal =>{
      penal.x +=PENAL_END  / 1000
    })
    x =   PANEL_WIDTH.value / 2 

 
  }


  penalStore.addPenal({
    x: x,
    y: 0,
    z: PANEL_DEPTH / 2 - 0.02,
    type: select.value,
    rotate: 2,
    side: "directLeft",
    width: PANEL_WIDTH.value,
    id: penalId,
    isLevel2: false,
    isLevel3: false,
    level3height: 0,
    index: config.countMaxLeft,
    oven: selectedOption.value,
  });

  const start = x - PANEL_WIDTH.value / 2;
  const end = x + PANEL_WIDTH.value / 2;


  penalBuilder.value.builder();
  cabinetBuilder.value.executeConfig("actual", "currect");
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

    rowSegmentsStore.segments.direct.length = 0
    rowSegmentsStore.segments.left.length = 0
    rowSegmentsStore.segments.right.length = 0


    // this.KitchenSizes.dishwasher.size = 0
    // this.KitchenSizes.oven.size = 0
}
function highlightPenal(id) {
  hoveredPenalId.value = id
  console.log('id', id)

  // Скрыть все подсветки
  plannerConfig.penalsArray.forEach(p => {
    if (p.boxHelper) p.boxHelper.visible = false
  })

  // Найти нужный пенал и включить подсветку
  const penal =  plannerConfig.penalsArray.find(p => p.id === id)
  if (penal && penal.boxHelper) {
    penal.boxHelper.visible = true
  }

  penalBuilder.value.sceneSetup.requestRender()
}

// Очистка подсветки
function clearHighlight() {
  hoveredPenalId.value = null
   plannerConfig.penalsArray.forEach(p => {
    if (p.boxHelper) p.boxHelper.visible = false
  })
  penalBuilder.value.sceneSetup.requestRender()

}



</script>
<style scoped>


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



.radio-card {
  @apply border-2 border-gray-300 rounded-lg cursor-pointer transition-all duration-200;
  @apply flex items-center justify-center text-center;
  @apply hover:shadow-md;
  min-height: 120px;
}

.radio-card.active {
  @apply border-blue-500 bg-blue-50;
}

.card-title {
  @apply transition-colors duration-200;
}
</style>
