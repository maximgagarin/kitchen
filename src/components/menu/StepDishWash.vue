<template>
  <div class="p-4 bg-white rounded-lg shadow-md max-w-xs mx-auto">
    <h3 class="text-lg font-semibold text-gray-900 mb-3">
      Будет встроенная посудомоечная машина?
    </h3>

    <div v-if="kitchenStore.availableDish.size !== 1" class="flex flex-col space-y-2">
      <label
        v-for="size in kitchenStore.availableDish"
        :key="size"
        class="cursor-pointer flex items-center px-3 py-2 border rounded-md transition-colors duration-150"
        :class="{
          'border-indigo-500 bg-indigo-50': kitchenStore.dishwasher.size === size,
          'border-gray-300 hover:bg-gray-100': kitchenStore.dishwasher.size !== size
        }"
      >
        <input
          type="radio"
          v-model="kitchenStore.dishwasher.size"
          :value="size"
          class="absolute opacity-0 w-0 h-0"
        />
        <span class="text-sm font-medium text-gray-900">
          {{ size * 100 === 0 ? 'нет' : size * 100 + ' см' }}
        </span>
      </label>
    </div>

    <h3 v-else class="text-sm font-semibold text-gray-500 mt-2">
      Посудомоечная машина не помещается
    </h3>
  </div>
</template>
<script setup>
import { ref, watch, inject } from "vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { useRowSegmentsStore } from "../../pinia/RowSegments";

const kitchenStore = useKitchenSizesStore();

let hasDishwasher = ref(true)

const rules = kitchenStore.filtredRules;
const rulesCopy = [...rules]


//если посудомойка не входит
if (kitchenStore.availableDish.size === 1) {
  console.log("не подходит");
  kitchenStore.filtredRulesTotal = rules;
}

const selectedVariant = ref(null);
const selected = ref(null);

function printResults(results) {
  results.forEach((r) => {
    console.log(
      `\n=== [${r.set}] oven=${r.ovenSize ?? "-"} | dish=${r.dishSize ?? "-"
      } ===`
    );
    r.variants.forEach((variant, i) => {
      console.log(`  Вариант ${i + 1}:`);
      variant.forEach((p) => {
        const content =
          p.modules.map((m) => `${m.name}(${m.size})`).join(", ") || "пусто";
        console.log(`    ${p.name}: ${content}`);
      });
    });
  });
}

function filtredDish(result, size) {
  const filteredByDish = result
    .filter((r) => r.dishSize === size)
    .map((r) => ({
      ...r,
      variants: r.variants.filter((variant) =>
        variant.some((part) =>
          part.modules.some((m) => m.name === "dishWasher")
        )
      ),
    }))
    .filter((r) => r.variants.length > 0); // оставляем только записи с валидными вариантами

  return filteredByDish;
}

watch(
  () => kitchenStore.dishwasher.size,
  (newVal) => {
    if (newVal === 0.45) {
      console.log("45");

      const filtered = filtredDish(rules, 0.45);
      console.log("filteredDish", filtered);

      kitchenStore.filtredRulesTotal = filtered;
      //   printResults(filtered)
    } else if (newVal === 0.6) {
      console.log("60");

      const filtered = filtredDish(rules, 0.6);
      kitchenStore.filtredRulesTotal = filtered;
      //    printResults(filtered)
    } else {
      console.log("else");
      kitchenStore.filtredRulesTotal = rulesCopy;


      //если нет дх и пм то правила пустые
      if (kitchenStore.oven.size === 0) {
        const totalRules =
        {
          set: "none",
          ovenSize: 0,
          dishSize: 0,
          variants: [],
        }

        const variant = []
        totalRules.variants.push(variant)



        console.log("0+0");
        kitchenStore.parts.forEach((part) => {
          variant.push({
            name: part.name,
            width: part.width,
            modules: [],
          });
        });
        kitchenStore.filtredRulesTotal.length = 0
        kitchenStore.filtredRulesTotal.push(totalRules)
      }
    }
  },
  { immediate: true } // 👈 срабатывает сразу при монтировании компонента
);
</script>

<style scoped>
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
