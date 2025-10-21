<template>
  <h3 class="text-xl font-semibold mb-4">Выберите тип плиты</h3>


  

  <!-- Первая группа радиокнопок -->
  <div v-if="!penalStore.isOven" class="mb-4">
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        class="selectInput"
        name="TypeOven"
        value="in"
        v-model="kitchenSizes.oven.type"
      />
      <span>встраиваемая плита с духовкой</span>
    </label>

    <label class="flex items-center space-x-2 mt-2">
      <input
        type="radio"
        class="selectInput"
        name="TypeOven"
        value="out"
        v-model="kitchenSizes.oven.type"
      />
      <span>обычная плита с духовкой</span>
    </label>

    <label class="flex items-center space-x-2 mt-2">
      <input
        type="radio"
        class="selectInput"
        name="TypeOven"
        value=""
        v-model="kitchenSizes.oven.type"
      />
      <span>нет плиты</span>
    </label>
  </div>

  <!-- Вторая группа радиокнопок -->
  <div
    v-if="!penalStore.isOven && kitchenSizes.oven.type !== 'none'"
    class="mb-4"
  >
   <select  v-model="kitchenSizes.oven.size" class="border rounded p-2 w-40">
        <option :value="null" disabled>Выбери размер</option>
        <option v-for="size in kitchenSizes.availableOven" :key="size" :value="size">
          {{ size }}
        </option>
    </select>
  </div>

  <div class="mb-4">
    <p>cторона</p>
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        name="side"
        value="left"
        v-model="kitchenSizes.oven.side"
      />
      <span>левая</span>
    </label>
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        name="side"
        value="direct"
        v-model="kitchenSizes.oven.side"
      />
      <span>правая</span>
    </label>
  </div>

  <!-- варочаня панель -->

  <div v-if="penalStore.isOven" class="mb-4">
    <p>варочная панель</p>
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        name="Oven"
        value="0.3"
        v-model="kitchenSizes.cookTop"
      />
      <span>ширина 300</span>
    </label>
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        name="Oven"
        value="0.45"
        v-model="kitchenSizes.cookTop"
      />
      <span>ширина 450</span>
    </label>
    <label class="flex items-center space-x-2">
      <input
        type="radio"
        name="Oven"
        value="0.6"
        v-model="kitchenSizes.cookTop"
      />
      <span>ширина 600</span>
    </label>
  </div>
</template>

<script setup>
import { ref, watch, inject, computed } from "vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { useRowSegmentsStore } from "../../pinia/RowSegments";
import { usePenalStore } from "../../pinia/penals";

const penalStore = usePenalStore();

const oven = ref(penalStore.isOven);

console.log(oven);

const kitchenSizes = useKitchenSizesStore();
const rowSegmentsStore = useRowSegmentsStore();

const setStove = inject("setStove");
const cabinetBuilder = inject("cabinetBuilder");

function changeType() {
  console.log("funk");
}

//вариант меню
const selectedVariant = ref(null);
//варочная панель ширина
const selectCooktop = ref();

//тип
const selectTypeOven = ref();

//ширина встравив духовки
const OvenInWidth = ref();

//ширина не встравив духовки
const OvenOutWidth = ref();

const ovenType = ref();

watch(ovenType, (newVal) => {
  kitchenSizes.stoveType = newVal;
  // setStove.value.setStove()
});

// watch(
//   () => kitchenSizes.oven.type,
//   (newVal) => {
//     if (newVal === "") {
//       kitchenSizes.oven.size = 0;
//       kitchenSizes.oven.side = "";
//       kitchenSizes.oven.isOven = false;
//     } else {
//       kitchenSizes.oven.isOven = true;
//     }
//   }
// );

const rules = kitchenSizes.rules

 function printResults(results) {
    
    results.forEach(r => {
      console.log(`\n=== [${r.set}] oven=${r.ovenSize ?? "-"} | dish=${r.dishSize ?? "-"} ===`);
      r.variants.forEach((variant, i) => {
        console.log(`  Вариант ${i + 1}:`);
        variant.forEach(p => {
          const content = p.modules.map(m => `${m.name}(${m.size})`).join(", ") || "пусто";
          console.log(`    ${p.name}: ${content}`);
        });
      });
    });
  }


// установить размеры для посудомойки
function collectAvailableSizes(results) {
  const available = {  dishWasher: new Set() };

  for (const r of results) {
    // Пройти по всем вариантам (variants)
    for (const variant of r.variants) {
      // Для каждой стороны в варианте
      for (const part of variant) {
        // Для каждого модульa, который реально стоит на стороне
        for (const mod of part.modules) {
       
          if (mod && mod.name === "dishWasher" && mod.size != null) {
            available.dishWasher.add(mod.size);
          }
        }
      }
    }
  }

  // Сортируем массивы для удобства и возвращаем
  const toSortedArray = set => Array.from(set).sort((a, b) => a - b);

  kitchenSizes.availableDish = available.dishWasher
}


function filtredOven(result , size){
    const filteredByOven = result.filter(r => r.ovenSize === size).map(r => ({
    ...r,
    variants: r.variants.filter(variant => 
      variant.some(part => part.modules.some(m => m.name === "oven" ))
    )
  }))
  .filter(r => r.variants.length > 0) // оставляем только записи с валидными вариантами

 return filteredByOven
}

function filtredWithoutOven(result){
  const filtred = result.filter(r=> r.set === "dishWasher")
  return filtred
}


watch(
  () => kitchenSizes.oven.size,
  (newVal) => {
    if (newVal === 0.45) {
      console.log('0.45')

      const filtred = filtredOven(rules, 0.45)
      kitchenSizes.filtredRules = filtred
      collectAvailableSizes(filtred)
   //   printResults(filtred)
      
      
    } else if(newVal === 0.6) {
      console.log('0.60')
   


      const filtred = filtredOven(rules, 0.6)
      kitchenSizes.filtredRules = filtred
      collectAvailableSizes(filtred)

   //   printResults(filtred)


    }else if(newVal === 0) {
      console.log('0')
   


      const filtred = filtredWithoutOven(rules, 0)
      kitchenSizes.filtredRules = filtred
      collectAvailableSizes(filtred)

  //    printResults(filtred)


    }
  },
   { immediate: true }
);


</script>

<style scoped>
.selectedVariant {
  border: #ccc 1px solid;
}

.radio-group {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.radio-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  width: 130px;
}
.buttonWrapper {
  margin-top: 25px;
}

.sinkButton {
  margin-bottom: 5px;
  background-color: #fd3131;
  border: 0;

  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;

  padding: 15px 25px;
  text-align: center;
}

.sinkButton:hover {
}
</style>
