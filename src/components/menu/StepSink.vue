<template>
  <div>
    <h3>Выберите расположение раковины</h3>
  </div>
  <div class="radio-group">
    
    <!-- <label class="radio-card" for="variant1">
      <input type="radio"  class="selectInput" name="type" id="variant1" value="variant1" v-model="selectedVariant">
      <p> задать размеры до вывода хвс, гвс и канализации</p>
     </label> -->



    
    <label class="radio-card" for="variant2">
      <input type="radio" class="selectInput" name="type" id="variant2" value="variant2" v-model="selectedVariant">
      <p>разместить раковину </p>
    </label>


     
 
   
  </div>

  <!-- <div v-if="selectedVariant==='variant1'" class="pipeline">
    <div  class="duct">
      <img class="duct_img" src="/img/duct/duct.png" alt="">
     </div>
    <label for="">Задайте размер X (Важно включить замер ручки кранов)</label>
    <input class="slider" type="range" min="15" max="30"  step="1" v-model.number="rowSegmentsStore.duct.size"  />
    <p>{{ rowSegmentsStore.duct.size }} см</p>
  </div> -->



  <!-- <p>установите раковину</p> -->

  <div class="buttonWrapper">
    <button class="sinkButton" @click="restart">начать заново</button>
  </div>
  <div>
    <p>{{ kitchenStore.parts.direct1 }}</p>
    <p>{{ kitchenStore.parts.direct2 }}</p>

  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useKitchenSizesStore } from '../../pinia/kitchenSizes';
import { useRowSegmentsStore } from '../../pinia/RowSegments';



const kitchenStore = useKitchenSizesStore();
const rowSegmentsStore = useRowSegmentsStore()

const setTech = inject("setTech");
const cabinetBuilder = inject("cabinetBuilder");

const selectedVariant = ref(null);

// Следим за изменением варианта
watch(selectedVariant, (newVal) => {
  if (newVal === 'variant1') {
  
    restart()
    setTech.value.setCustom();
  } else if (newVal === 'variant2') {
    restart()
    setTech.value.setSink();
  } else if (newVal === 'variant3') {
    console.log('auto')
  }
});

function restart() {
  kitchenStore.sink.isSet = false
  setTech.value.gaps = []
  rowSegmentsStore.removeSegmentTypes(['build_direct_l1', 'build_left_l1', 'build_right_l1']);
  rowSegmentsStore.removeSegmentType('sink')
  setTech.value.setSink();
  cabinetBuilder.value.deleteAll()
  cabinetBuilder.value.executeConfig("actual" , "currectActual")


}
</script>

<style scoped>

.radio-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;  
  gap: 15px;
 
}

.radio-card {


  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px;
  cursor: pointer;

  transition: all 0.3s ease;
  width: 100% ;
  height: 80px;
}

.radio-card input {
  display: none;
}

.radio-card .card-content {
  width: 100%;
 
  display: flex;
  flex-direction: column; 
  align-items: center; 
  
}

.radio-card .card-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 5px;
}

.radio-card .card-title {
  margin-top: 5px;
  font-size: 16px;
 
}

.radio-card:hover,
.radio-card input:checked + .card-content {
  border-color: #000000;
}

.radio-card.active {
  border-color: #000000;
}

.sinkButton {
  margin-top: 15px;
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

.duct_img{
  width: 210px;
  height: 160px;
}

.sinkButton:hover {
 
  

 
}
</style>


