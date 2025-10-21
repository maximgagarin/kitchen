<template>
  <div class="p-6">
    <h3 class="text-xl font-semibold mb-4">Будет встроенная посудомоечная машина?</h3>

    <select  v-model="kitchenSizes.dishwasher.size" class="border rounded p-2 w-40">
        <option :value="null" disabled>Выбери размер</option>
        <option v-for="size in kitchenSizes.availableDish" :key="size" :value="size">
          {{ size }}
        </option>
    </select>
  </div>
</template>


<script setup>
import { ref, watch, inject } from 'vue';
import { useKitchenSizesStore } from '../../pinia/kitchenSizes';
import { useRowSegmentsStore } from '../../pinia/RowSegments';


const kitchenSizes = useKitchenSizesStore();
const rowSegmentsStore = useRowSegmentsStore()
const rules = kitchenSizes.filtredRules



const selectedVariant = ref(null);
const selected = ref(null);

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


function filtredDish(result , size){
    const filteredByOven = result.filter(r => r.dishSize === size).map(r => ({
    ...r,
    variants: r.variants.filter(variant => 
      variant.some(part => part.modules.some(m => m.name === "dishWasher" ))
    )
  }))
  .filter(r => r.variants.length > 0) // оставляем только записи с валидными вариантами

 return filteredByOven
}


watch(
  () => kitchenSizes.dishwasher.size,
  (newVal) => {
    if (newVal === 0.45) {
      console.log('45')

      const filtered = filtredDish(rules, 0.45)
      console.log('filteredDish', filtered)

      kitchenSizes.filtredRulesTotal = filtered
   //   printResults(filtered)
    } 
    else if (newVal === 0.6) {
      console.log('60')

      const filtered = filtredDish(rules, 0.6)
      kitchenSizes.filtredRulesTotal = filtered
  //    printResults(filtered)
    }
  },
  { immediate: true } // 👈 срабатывает сразу при монтировании компонента
)



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
.buttonWrapper{
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

