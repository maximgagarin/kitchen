<template>
  <div>
    <h2>Угловая левая</h2>
    <input type="radio"  class="selectInput" name="angle_blocks"   value="direct1_right1"  v-model="selectedOption"      @change="updateConfig" >
    <label for="html"> нижние базы</label><br>

    <input type="radio" class="selectInput"  name="angle_blocks" value="direct1_direct2_right1"  v-model="selectedOption"      @change="updateConfig" >
    <label for="css">прямо 2ряда лев 2ряд</label><br>

    <input type="radio" class="selectInput"  name="angle_blocks"   value="direct1_right1_right2"  v-model="selectedOption"      @change="updateConfig" >
    <label for="html">прямо 2 ряд лево ниж</label><br>

    <input type="radio"  class="selectInput" name="angle_blocks" value="direct1_direct2_right1_right2" v-model="selectedOption"      @change="updateConfig" >
    <label for="css">прямо низ лево 2ряд</label><br>

   
    
    <input type="radio" class="selectInput" name="angle_blocks" value="direct1_right1_right2_right3" v-model="selectedOption"      @change="updateConfig" >
    <label for="css">прямо низ лево 2ряд</label><br>

    <input type="radio" class="selectInput"  name="angle_blocks" value="direct1_direct2_direct3_right1_right2_right3" v-model="selectedOption"      @change="updateConfig" >
    <label for="css">прямо низ лево 2ряд</label><br>



    <!-- <SetSize /> -->
  </div>
</template>

<script setup>
import { ref,inject  } from "vue";
import config from "../config/config";


const cabinetBuilder = inject('cabinetBuilder');


const selectedOption = ref(null);

function updateConfig() {
  if (selectedOption.value === "direct1_right1") {
    cabinetBuilder.value.executeConfig("direct1_right1")
    config.penals.size = 2.1
  } else if (selectedOption.value === "direct1_direct2_right1") {
    cabinetBuilder.value.executeConfig("direct1_direct2_right1")
    config.penals.size = 2.1
  } else if (selectedOption.value === "direct1_right1_right2") {
    cabinetBuilder.value.executeConfig("direct1_right1_right2")
    config.penals.size = 2.1
  }
  else if (selectedOption.value === "direct1_direct2_right1_right2") {
    cabinetBuilder.value.executeConfig("direct1_direct2_right1_right2")
    config.penals.size = 2.1
  }else if (selectedOption.value === "direct1_right1_right2_right3") {
    cabinetBuilder.value.executeConfig("direct1_right1_right2_right3")
    config.penals.size = 2.4
  }
  else if (selectedOption.value === "direct1_direct2_direct3_right1_right2_right3") {
    cabinetBuilder.value.executeConfig("direct1_direct2_direct3_right1_right2_right3")
    config.penals.size = 2.4
  }

  
}
</script>
