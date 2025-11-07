<template>
  <div class="mt-3">
    <p class="text-xs font-medium text-gray-600">пм и дх</p>
    <div class="flex gap-1">
      <button
        class="compact-btn bg-amber-500 hover:bg-amber-600"
        @click="changeVariant(-1)"
        :disabled="index <= 0"
      >
        ←
      </button>

      <button
        class="compact-btn bg-amber-500 hover:bg-amber-600"
        @click="changeVariant(+1)"
        :disabled="index >= algStore.variants.length - 1"
      >
        →
      </button>
    </div>
  </div>

  <div class="grid grid-column">
    <!-- Духовка и её положение -->
    <!-- <div>
      <div>
        <label
          for="selectedOven"
          class="block text-xs font-medium text-gray-700 mb-1"
          >Плита:</label
        >
        <select
          id="selectedOven"
          class="w-30 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          v-model="selectOvenSide"
          @change="ovenChange"
        >
          <option value="left">слева</option>
          <option value="direct">справа</option>
        </select>
      </div>
    </div> -->


    <!-- Посудомойка -->

    <!-- <div>
      <div>
        <label
          for="selectedOven"
          class="block text-xs font-medium text-gray-700 mb-1"
          >Посудомойка:</label
        >
        <select
          id="selectedOven"
          class="w-30 px-1 py-1 text-xs border-gray-300 rounded-md border focus:ring-indigo-500 focus:border-indigo-500"
          v-model="selectDishSide"
          @change="dishChange"
        >
          <option value="left">слева</option>
          <option value="direct">справа</option>
        </select>
      </div>
    </div> -->
  </div>
</template>
<script setup>
import { inject, ref } from "vue";
import { useAlgorithmStore } from "../../../pinia/Algorithm";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { plannerConfig } from "../../configurator/planner/planerConfig";

const algStore = useAlgorithmStore();
const kitchenStore = useKitchenSizesStore();
const algorithmManager = inject("algorithmManager");
const plannerManager = inject("plannerManager");
const selectOvenSide = ref(null);
const selectDishSide = ref(null);
const selectedType = ref(0);
let index = ref(0);

function changeVariant(value) {
  index.value += value;

  algorithmManager.value.algorithm1level.new(index.value);

  Object.keys(algStore.variantIndex.level1).forEach((key) => {
    algStore.variantIndex.level1[key] = 0;
  });

  Object.keys(algStore.variantIndex.level2).forEach((key) => {
    algStore.variantIndex.level2[key] = 0;
  });

  algorithmManager.value.algorithm2level.createParts();

  algorithmManager.value.algorithm2level.buildDirect();
  if (kitchenStore.type === "left")
    algorithmManager.value.algorithm2level.buildLeft();

  plannerManager.value.tableTop.create();

  plannerConfig.models.push(
    ...plannerConfig.modelsDirect2L,
    ...plannerConfig.modelsLeft2L
  );
}

function ovenChange() {
  // algStore.indexObj.oven.direct = [];
  // algStore.indexObj.oven.left = [];
  // algStore.indexObj.dishWasher.direct = [];
  // algStore.indexObj.dishWasher.left = [];

  if (selectOvenSide.value === "left") {
    const variants = algStore.indexObj.oven.left;
    console.log(variants);
    change(variants[0])
  }

  if (selectOvenSide.value === "direct") {
    const variants = algStore.indexObj.oven.direct;
    console.log(variants);
    change(variants[0])
  }
}

function dishChange() {
  // algStore.indexObj.oven.direct = [];
  // algStore.indexObj.oven.left = [];
  // algStore.indexObj.dishWasher.direct = [];
  // algStore.indexObj.dishWasher.left = [];

  if (selectDishSide.value === "left") {
    const variants = algStore.indexObj.dishWasher.left;
    console.log(variants);
    console.log('variantLeft', variants[0])
    change(variants[0])
     selectOvenSide.value = null
  }

  if (selectDishSide.value === "direct") {
    const variants = algStore.indexObj.dishWasher.direct;
    console.log(variants);
    console.log('variantDirect', variants[0])

    change(variants[0])
     selectDishSide.value = null
   
  }
}



function change(variant) {
  algorithmManager.value.algorithm1level.new(variant);

  Object.keys(algStore.variantIndex.level1).forEach((key) => {
    algStore.variantIndex.level1[key] = 0;
  });

  Object.keys(algStore.variantIndex.level2).forEach((key) => {
    algStore.variantIndex.level2[key] = 0;
  });

  algorithmManager.value.algorithm2level.createParts();

  algorithmManager.value.algorithm2level.buildDirect();
  if (kitchenStore.type === "left")
    algorithmManager.value.algorithm2level.buildLeft();

  plannerManager.value.tableTop.create();

  plannerConfig.models.push(
    ...plannerConfig.modelsDirect2L,
    ...plannerConfig.modelsLeft2L
  );
}
</script>
