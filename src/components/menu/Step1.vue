<template>
  <div class="space-y-6 p-1 max-w-3xl mx-auto">
    <h3 class="text-base font-medium text-gray-800">Выберите форму кухни</h3>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Прямая кухня -->
      <label
        for="direct"
        class="relative border-2 w-20 rounded-lg p-1 cursor-pointer transition-all duration-200"
        :class="{
          'border-gray-300 hover:border-gray-400':
            kitchenSizesStore.type !== 'direct',
          'border-blue-500 ring-2 ring-blue-200':
            kitchenSizesStore.type === 'direct',
        }"
      >
        <input
          type="radio"
          id="direct"
          name="kitchen_type"
          value="direct"
          v-model="kitchenSizesStore.type"
          @change="updateConfig"
          class="absolute opacity-0"
        />
        <div class="flex flex-col items-center space-y-2">
          <img
            src="/img/button/1.jpg"
            alt="Прямая кухня"
            class="w-16 h-16 object-cover rounded-md"
          />
          <span class="text-xs font-medium text-gray-700">Прямая</span>
        </div>
      </label>

      <!-- Угловая кухня -->
      <label
        for="left"
        class="relative border-2 w-20 rounded-lg p-1 cursor-pointer transition-all duration-200"
        :class="{
          'border-gray-300 hover:border-gray-400':
            kitchenSizesStore.type !== 'left',
          'border-blue-500 ring-2 ring-blue-200':
            kitchenSizesStore.type === 'left',
        }"
      >
        <input
          type="radio"
          id="left"
          name="kitchen_type"
          value="left"
          v-model="kitchenSizesStore.type"
          @change="updateConfig"
          class="absolute opacity-0"
        />
        <div class="flex flex-col items-center space-y-2">
          <img
            src="/img/button/2.jpg"
            alt="Угловая кухня"
            class="w-16 h-16 object-cover rounded-md"
          />
          <span class="text-xs font-medium text-gray-700">Угловая</span>
        </div>
      </label>

      <!-- П-образная кухня -->
      <!-- <label
        for="uShaped"
        class="relative border-2 w-20 rounded-lg p-1 cursor-pointer transition-all duration-200"
        :class="{
          'border-gray-300 hover:border-gray-400':
            kitchenSizesStore.type !== 'uShaped',
          'border-blue-500 ring-2 ring-blue-200':
            kitchenSizesStore.type === 'uShaped',
        }"
      >
        <input
          type="radio"
          id="uShaped"
          name="kitchen_type"
          value="uShaped"
          v-model="kitchenSizesStore.type"
          @change="updateConfig"
          class="absolute opacity-0"
        />
        <div class="flex flex-col items-center space-y-2">
          <img
            src="/img/button/4.jpg"
            alt="П-образная кухня"
            class="w-16 h-16 object-cover rounded-md"
          />
          <span class="text-xs font-medium text-gray-700">П-образная</span>
        </div>
      </label> -->
    </div>

    <div class="mt-8">
      <SetSize />
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { ref, inject, onMounted } from "vue";
import config from "../config/config";
import SetSize from "./SetSize.vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { useRowSegmentsStore } from "../../pinia/RowSegments";
import { usePenalStore } from "../../pinia/penals";
import { DimensionLine } from "../configurator/builders/DimensionLine";

const kitchenSizesStore = useKitchenSizesStore();

const cabinetBuilder = inject("cabinetBuilder");
const segmentStore  = useRowSegmentsStore()
const penalStore = usePenalStore()




function deleteModules(){

}
 

function updateConfig() {

  clear()

  if (kitchenSizesStore.type === "direct") {
     moveCamera()
    cabinetBuilder.value.executeConfig("direct");
    const lineLeft = config.lines.find(item => item.name === "lineLeft");
    const lineRight = config.lines.find(item => item.name === "lineRight");


    lineLeft.visibleOff()
    lineRight.visibleOff()

  
  } else if (kitchenSizesStore.type === "left") {

    moveCamera()

    cabinetBuilder.value.executeConfig("left");
      const lineLeft = config.lines.find(item => item.name === "lineLeft");
    const lineRight = config.lines.find(item => item.name === "lineRight");

    lineLeft.visibleOn()
    lineRight.visibleOff()
 
  
  } else if (kitchenSizesStore.type === "uShaped") {
    cabinetBuilder.value.executeConfig("uShaped");
     
    const lineRight = config.lines.find(item => item.name === "lineRight");
      const lineLeft = config.lines.find(item => item.name === "lineLeft");

   
    lineRight.visibleOn()
    lineLeft.visibleOn()

 
  }


  
 function clear(){
    // удалить раковину
      ['SinkNormal', 'sinkModel', 'fridge', 'Penal'].forEach((name) => {
      cabinetBuilder.value.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => cabinetBuilder.value.scene.remove(element));
    })


    segmentStore.segments.direct.length = 0
    segmentStore.segments.left.length = 0
    segmentStore.segments.right.length = 0




    penalStore.penals.length = 0

    penalStore.countLeft = 0
    penalStore.countLeftDirect = 0
    penalStore.countRight = 0
    penalStore.countRightDirect = 0

    penalStore.penalOffsetsState.directLeft = 0
    penalStore.penalOffsetsState.left = 0
    penalStore.penalOffsetsState.right = 0
    penalStore.penalOffsetsState.directRight = 0
    // penalStore.penalOffsets.directLeft = 0
    // penalStore.penalOffsets.directRight = 0
    // penalStore.penalOffsets.left = 0
    // penalStore.penalOffsets.right = 0
    // penalStore.isOven = false


    kitchenSizesStore.fridge.isSet = false
    kitchenSizesStore.fridge.axis = ''
    kitchenSizesStore.fridge.isSet = false
    kitchenSizesStore.fridge.side = ''
    kitchenSizesStore.fridge.row = ''
    kitchenSizesStore.fridge.inSideFridge = 'false'

    kitchenSizesStore.delete_1level = true,
    kitchenSizesStore.delete_leftLevel = true,
    kitchenSizesStore.delete_rightLevel = true,






    kitchenSizesStore.parts.length = 0
    kitchenSizesStore.rules.length = 0
    kitchenSizesStore.filtredRules.length = 0,
    kitchenSizesStore.filtredRulesTotal.length = 0

    kitchenSizesStore.availableOven.length =  0
    kitchenSizesStore.availableDish.length = 0
    kitchenSizesStore.sink.isSet = false

    kitchenSizesStore.offsetForLeftRow = 0

    // this.KitchenSizes.dishwasher.size = 0
    // this.KitchenSizes.oven.size = 0
  }

}


function moveCamera(){
    //  this.camera.position.set(4, 5, 6);
    //  let targetPosition = new THREE.Vector3(2, 0, 0);
    //  this.camera.lookAt(targetPosition);
    //  this.controls.target.copy(targetPosition);

    if (kitchenSizesStore.type == "left") {
      cabinetBuilder.value.sceneSetup.moveCameraTo(
        new THREE.Vector3(7, 4, 7),
        new THREE.Vector3(1.5, 1, 0),
        1.5,
        () => {
          // После первой анимации запускаем вторую
          // cabinetBuilder.value.sceneSetup.moveCameraTo(
          //   new THREE.Vector3(3, 2, 6),
          //   new THREE.Vector3(2, 1, 0),
          //   3
          // );
        }
      );
    }
    if (kitchenSizesStore.type == "direct") {
      cabinetBuilder.value.sceneSetup.moveCameraTo(
        new THREE.Vector3(5, 4, 7),
        new THREE.Vector3(2, 1, 0),
        1.5,
        () => {
          // После первой анимации запускаем вторую
          // cabinetBuilder.value.sceneSetup.moveCameraTo(
          //   new THREE.Vector3(3, 2, 6),
          //   new THREE.Vector3(2, 1, 0),
          //   3
          // );
        }
      );
    }
}




</script>

<style scoped>
.set_size {
  margin-top: 40px;
}

h3 {
  color: #464646;
}

.radio-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.radio-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px;
  cursor: pointer;

  transition: all 0.3s ease;
  width: 120px;
  height: 120px;
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
</style>
