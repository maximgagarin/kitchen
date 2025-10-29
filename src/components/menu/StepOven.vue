<template>
  <div class="p-4 bg-white rounded-lg shadow-md max-w-xs mx-auto">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">
      {{ penalStore.isOven ? '<Будет варочная панель?' : 'Будет плита?' }}
    </h3>

    <div class="flex flex-col space-y-2">
      <label
        v-for="size in kitchenSizes.availableOven"
        :key="size"
        class="cursor-pointer flex items-center px-3 py-2 border rounded-md transition-colors duration-150"
        :class="{
          'border-indigo-500 bg-indigo-50': kitchenSizes.oven.size === size,
          'border-gray-300 hover:bg-gray-100': kitchenSizes.oven.size !== size
        }"
      >
        <input
          type="radio"
          v-model="kitchenSizes.oven.size"
          :value="size"
          class="absolute opacity-0 w-0 h-0"
        />
        <span class="text-sm font-medium text-gray-900">
          {{ size * 100 === 0 ? 'нет' : size * 100 + ' см' }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject, computed } from "vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { useRowSegmentsStore } from "../../pinia/RowSegments";
import { usePenalStore } from "../../pinia/penals";

const penalStore = usePenalStore();
const kitchenSizes = useKitchenSizesStore();



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
  const available = { dishWasher: new Set() };

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

  available.dishWasher.add(0)
  if (available.dishWasher.size === 1) kitchenSizes.dishwasher.size = 0  // если нет места для посудомойки
  kitchenSizes.availableDish = available.dishWasher
}


function filtredOven(result, size) {
  const filteredByOven = result.filter(r => r.ovenSize === size).map(r => ({
    ...r,
    variants: r.variants.filter(variant =>
      variant.some(part => part.modules.some(m => m.name === "oven"))
    )
  }))
    .filter(r => r.variants.length > 0) // оставляем только записи с валидными вариантами

  return filteredByOven
}

function filtredWithoutOven(result) {
  const filtred = result.filter(r => r.set === "dishWasher")
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


    } else if (newVal === 0.6) {
      console.log('0.60')



      const filtred = filtredOven(rules, 0.6)
      kitchenSizes.filtredRules = filtred
      collectAvailableSizes(filtred)

      //   printResults(filtred)


    } else if (newVal === 0) {
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

.sinkButton:hover {}
</style>
