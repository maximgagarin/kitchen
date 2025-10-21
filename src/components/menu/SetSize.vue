<template>
  
  <div class="set_size_box" v-if="config.type !== ''">
    <div class="input_box">
      <div style="display: flex; justify-content: space-between;">
        <label>Ширина A:</label>
        <p class="slider-value">{{ (kitchenSizes.sideSizes.side_a * 100).toFixed(0)}} cм</p>
      </div>
      
      <div class="slider-container">
        <button class="slider-button" @click="adjustValue('side_a', -0.05)">-</button>
        <input class="slider" type="range" :min="minValues.a" max="4" step="0.05" 
               v-model.number="kitchenSizes.sideSizes.side_a" @input="changeWidth" />
        <button class="slider-button" @click="adjustValue('side_a', 0.05)">+</button>
      </div>
    </div>

    <div class="input_box" v-if="kitchenSizes.type === 'left' || kitchenSizes.type === 'uShaped'">
         <div style="display: flex; justify-content: space-between;">
        <label>Ширина С:</label>
        <p class="slider-value">{{ (kitchenSizes.sideSizes.side_c * 100).toFixed(0) }} см</p>
      </div>
      <div class="slider-container">
        <button class="slider-button" @click="adjustValue('side_c', -0.05)">-</button>
        <input class="slider" type="range" :min="minValues.c" max="4" step="0.05" 
               v-model.number="kitchenSizes.sideSizes.side_c" @input="changeSideC" />
        <button class="slider-button" @click="adjustValue('side_c', 0.05)">+</button>
      </div>
    </div>
 
    <div class="input_box" v-if="kitchenSizes.type === 'right' || kitchenSizes.type === 'uShaped'">
      <label>Сторона D:</label>
      <span class="slider-value">{{ (kitchenSizes.sideSizes.side_d * 100).toFixed(0)}} см</span>
      <div class="slider-container">
        <button class="slider-button" @click="adjustValue('side_d', -0.05)">-</button>
        <input class="slider" type="range" :min="minValues.d" max="4" step="0.05" 
               v-model.number="kitchenSizes.sideSizes.side_d" @input="changeSideD" />
        <button class="slider-button" @click="adjustValue('side_d', 0.05)">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import config from "../config/config";
import config4 from "../config/config4";
import { inject, reactive , computed} from "vue";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { usePenalStore } from "../../pinia/penals";
import { useRowSegmentsStore } from "../../pinia/RowSegments";


const penalStore = usePenalStore()
const kitchenSizes = useKitchenSizesStore()
const segmentsStore = useRowSegmentsStore()

const cabinetBuilder = inject("cabinetBuilder");

const previousSizes = reactive({
  side_a: kitchenSizes.sideSizes.side_a,
  side_c: kitchenSizes.sideSizes.side_c,
  side_d: kitchenSizes.sideSizes.side_d
});

// Функция для корректировки значения
function adjustValue(sideKey, delta) {
  if(kitchenSizes.rowSizesCurrect.side_c < 0.6 && sideKey === 'side_c') return
  if(kitchenSizes.rowSizesCurrect.side_d < 0.6 && sideKey === 'side_d') return
  if((kitchenSizes.rowSizesCurrect.side_a - 0.6) < 0.6 && sideKey === 'side_a') return


  const current = kitchenSizes.sideSizes[sideKey];
  const newValue = Number((current + delta).toFixed(2));
  
  // Проверяем границы значений
  const min = sideKey === 'side_c' ? 0.55 : sideKey === 'side_d' ? 1 : 1;
  const max = sideKey === 'side_d' ? 4 : 6;
  
  if (newValue >= min && newValue <= max) {
    kitchenSizes.sideSizes[sideKey] = newValue;
    
    // Вызываем соответствующий обработчик изменения
    if (sideKey === 'side_a') changeWidth();
    else if (sideKey === 'side_c') changeSideC();
    else if (sideKey === 'side_d') changeSideD();
  }
}

const minValues = computed(() => {
  return {
    c: 1.2 + penalStore.penalOffsetsState.left,
    d: 1.2 + penalStore.penalOffsetsState.right,
    a: (kitchenSizes.type === "uShaped" ? 1.7 : 1.2) 
       + penalStore.penalOffsetsState.directRight 
       + penalStore.penalOffsetsState.directLeft
  }
})


function getDelta(sideKey) {
  const current = kitchenSizes.sideSizes[sideKey];
  const old = previousSizes[sideKey];
  const delta = Number((current - old).toFixed(3));
  previousSizes[sideKey] = current;
  return delta;
}

function changeSideC() {
  //console.log('minValue', minValue.value)
  const delta = getDelta("side_c");
 // if(kitchenSizes.rowSizesCurrect.side_c < 0.2) return
  
  for (let key in config4) {
    if (key === 'actual')
      config4[key].leftLevel.forEach(key => {
        if (penalStore.countLeft > 0) {
          cabinetBuilder.value[key.funk](Number(kitchenSizes.rowSizes.side_c) - Number(penalStore.penalOffsetsState.left))
          cabinetBuilder.value.sceneSetup.requestRender();
        } else {
          cabinetBuilder.value[key.funk](kitchenSizes.rowSizes.side_c)
          cabinetBuilder.value.sceneSetup.requestRender();
    
        }
      })
  }


  const lineLeft = config.lines.find(item => item.name === "lineLeft");
  lineLeft.update({x: 0.01, z: 0}, {x: 0.01, z: kitchenSizes.sideSizes.side_c})

  kitchenSizes.rowSizesWithPanels.side_c += delta

  cabinetBuilder.value.movePenal(delta, 'left')

  segmentsStore.segments.left.forEach(el=>{
    el.start +=delta
    el.end +=delta
  })
}

function changeSideD() {
  const delta = getDelta("side_d");
  
  for (let key in config4) {
    if (key === 'actual')
      config4[key].rightLevel.forEach(key => {
        if (penalStore.countRight > 0) {
          cabinetBuilder.value[key.funk](Number(kitchenSizes.rowSizes.side_d) - Number(penalStore.penalOffsetsState.right))
          cabinetBuilder.value.sceneSetup.requestRender();
        } else {
          cabinetBuilder.value[key.funk](kitchenSizes.rowSizes.side_d)
          cabinetBuilder.value.sceneSetup.requestRender();
        }
      })
  }

  cabinetBuilder.value.movePenal(delta, 'right')
    segmentsStore.segments.right.forEach(el=>{
    el.start +=delta
    el.end +=delta
  })

  const x = Number(kitchenSizes.sideSizes.side_a)
  const z = Number(kitchenSizes.sideSizes.side_d)


  kitchenSizes.rowSizesWithPanels.side_d += delta

  const lineRight = config.lines.find(item => item.name === "lineRight");
 
  lineRight.update({ x:x ,  z: 0}, {x:x , z: z})
  cabinetBuilder.value.sceneSetup.requestRender();

}

function changeWidth() {
 // console.log('minValueA', minValueA.value)
  const delta = getDelta("side_a");
 // console.log('delta', delta)

  for (let key in config4) {
    if (key === 'actual')
      config4[key].direct.forEach(key => {
        if (penalStore.countRightDirect > 0 || penalStore.countLeftDirect ) {   
          cabinetBuilder.value[key.funk](Number(kitchenSizes.rowSizes.side_a) - Number(penalStore.penalOffsetsState.directRight) 
          - Number(penalStore.penalOffsetsState.directLeft)) 
          cabinetBuilder.value.sceneSetup.requestRender();
        } else {
          cabinetBuilder.value[key.funk](kitchenSizes.rowSizes.side_a)
          cabinetBuilder.value.sceneSetup.requestRender();
        }
      })
  }


  const lineDirect = config.lines.find(item => item.name === "lineDirect");
  lineDirect.update({x: 0, z: 0.01}, {x: kitchenSizes.sideSizes.side_a, z: 0.01})

  const lineRight = config.lines.find(item => item.name === "lineRight");
  lineRight.update({x: kitchenSizes.sideSizes.side_a}, {x: kitchenSizes.sideSizes.side_a})

  const height = Number(config.kitchen_size.height)
  
  const lineHeight = config.lines.find(item => item.name === "lineHeight");
  lineHeight.update({x: kitchenSizes.sideSizes.side_a + 0.1, y:0 , z:0.01 }, {x: kitchenSizes.sideSizes.side_a +0.1, y: height, z:0.01})

  cabinetBuilder.value.movePenal(delta, 'directRight')
  cabinetBuilder.value.mooveRightModules(kitchenSizes.rowSizes.side_a)

  segmentsStore.segments.direct.forEach(el=>{
    if(el.side.includes('directRight')){
      el.start +=delta
      el.end +=delta
    }

  })


}
</script>

<style scoped>
.set_size_box {
  font-size: x-small;
  margin-top: 0px;
  width: 200px;
}

.input_box {
  margin-bottom: 10px;
  height: 60px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.slider {
  overflow: visible;
  flex-grow: 1;
  -webkit-appearance: none;
  height: 2px;
  background: #000000;
  border-radius: 5px;
  outline: none;
  transition: background 0.15s;
}

.slider:hover {
  background: #ff0000;
}

.slider::-webkit-slider-thumb {
  overflow: visible;
  -webkit-appearance: none;
  width: 25px;
  height: 25px;
  background: #ffffff;
  border: 2px solid gray;
  border-radius: 15px;
  cursor: pointer;
}

.slider-button {
  width: 25px;
  height: 25px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  user-select: none;
}

.slider-button:hover {
  background: #e0e0e0;
}

.slider-button:active {
  background: #d0d0d0;
}
</style>