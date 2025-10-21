<template>
  <div>
    <h3>Холодильник</h3>
  </div>
  <div class="radio-group">
    <label >
      <input type="radio"  class="selectInput" name="intoDimensions"  value="" v-model="intoDimensions">
     <p>Входит в габариты кухни</p>
     <input type="radio"  class="selectInput" name="side"  value="left" v-model="selectedSide">
     <p>Слева</p>
     <input type="radio"  class="selectInput" name="side"  value="right" v-model="selectedSide">
     <p>Справа</p>
     </label>

  
  
  </div>


 
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useKitchenSizesStore } from '../../pinia/kitchenSizes';
import { useRowSegmentsStore } from '../../pinia/RowSegments';

const setFridge = inject("setFridge");

//setFridge.value.setFridge()


const kitchenSizes = useKitchenSizesStore();
const rowSegmentsStore = useRowSegmentsStore()



const selectedSide = ref(null);
const intoDimensions = ref(null);


// Следим за изменением варианта



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

