<template>
    <!-- холодильник -->
    <div class=" border-t mt-3" >
        <h2 class="text-xs font-semibold  mt-3">Холодильник</h2>

        <!-- Выбор положения -->
        <div class="mt-3">
            <div class="flex space-x-4">
                <button @click="handleLeft"
                
                 :class="[
                    ' py-1 px-1  rounded-lg border text-xs font-medium transition flex items-center gap-2',
                ]"
                 :disabled="(props.isLeftEndPenal && selectedSide === 'left')"
               >добавить слева
                </button>

                <button @click="handleRight" 
                :class="[
                     ' py-1 px-1  rounded-lg border text-xs font-medium transition flex items-center gap-2',

                ]"
                :disabled="(props.isRightEndPenal && selectedSide === 'right')"
                >добавить справа
                </button>

             

            </div>
        </div>

        <!-- Кнопка добавления -->
         <div  v-if="kitchenStore.fridge.isSet"  class="flex space-x-4 mt-3">
                   <button
            class="bg-gray-100 text-black text-xs font-medium  py-2 px-2 rounded-lg shadow transition-colors duration-200 hover:text-brand"
             
            @click="deleteFridge()">
            {{ 'Удалить холодильник'  }}
            
        </button>
        <label class="flex items-center cursor-pointer">
                <input
                    id="checkDefault"
                    type="checkbox"
                    class="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    v-model="kitchenStore.fridge.inSideInput"
                    @change="changeInsideOutside"
                   
                />
                <span class="ml-2 text-xs text-gray-700">Входит в габариты</span>
        </label>
         </div>
     

    </div>
</template>

<script setup>
import * as THREE from "three";
import { inject, ref } from 'vue';
import { useRowSegmentsStore } from '../../../pinia/RowSegments'
import { usePenalStore } from '../../../pinia/penals'
import { useKitchenSizesStore } from '../../../pinia/kitchenSizes'
import { plannerConfig } from '../../configurator/planner/planerConfig';
import { FridgeInstance } from '../../configurator/planner/FridgeInstanse';

const penalStore = usePenalStore();
const kitchenStore = useKitchenSizesStore();
const rowSegmentsStore = useRowSegmentsStore();


const cabinetBuilder = inject("cabinetBuilder");
const penalBuilder = inject("penalBuilder");




// есть торцевой пенал слева или справа
const props = defineProps({
  isLeftEndPenal: Boolean,
  isRightEndPenal: Boolean
})

const sideSizes = kitchenStore.sideSizes
const FRIDGE_WIDTH = 0.6
const selectedSide = ref('left')


function handleLeft(){
    clear()
    selectedSide.value = 'left'
    if(kitchenStore.fridge.isSet){
        if(props.isLeftEndPenal && selectedSide.value === 'left') return
        deleteFridge()
        addFridge()
    } else{
        if(props.isLeftEndPenal && selectedSide.value === 'left') return
        addFridge() 
    }
}

function handleRight(){
    clear()
    selectedSide.value = 'right'
    console.log('props', props)
  

    if(kitchenStore.fridge.isSet){
      if(props.isRightEndPenal && selectedSide.value === 'right') return
      deleteFridge()
      addFridge()
    } else {
      if(props.isRightEndPenal && selectedSide.value === 'right') return
      addFridge()   
    }
}

//чекбокс входит/не входит в габариты
function changeInsideOutside(){

    clear()

    if(props.isLeftEndPenal && selectedSide.value === 'left') return
    if(props.isRightEndPenal && selectedSide.value === 'right') return


     if(kitchenStore.fridge.isSet){
        deleteFridge()
        addFridge()
    }
}


function addFridge() {

    clear()

    const model = penalBuilder.value.loaderModels.get('fridge')

    if (!model) {
        console.log('model not found!')
    }


    const fridgeInstance = new FridgeInstance(model)

    const side = selectedSide.value
    const kitchenType = kitchenStore.type
    model.visible = true
    cabinetBuilder.value.scene.add(model)

    const rules = {
        direct: {
            left: {
                side: 'directLeft', x: +0.6, segment: 'direct', offset: -0.6,
                row: 'side_a', xPos: FRIDGE_WIDTH / 2, zPos: FRIDGE_WIDTH / 2, rotation: 0 , start: 0, end:0.6
            },

            right: {
                side: 'directRight', x: -0.6, segment: 'direct', offset: -0.6,
                row: 'side_a', xPos: sideSizes.side_a - FRIDGE_WIDTH / 2, zPos: FRIDGE_WIDTH / 2, rotation: 0 , start: sideSizes.side_a - FRIDGE_WIDTH , end:sideSizes.side_a 
            },
        },
        left: {
            left: {
                side: 'left', z: -0.6, segment: 'left', offset: -0.6, row: 'side_c',
                xPos: FRIDGE_WIDTH / 2, zPos: sideSizes.side_c - FRIDGE_WIDTH / 2, rotation: Math.PI / 2, start: sideSizes.side_c - FRIDGE_WIDTH , end:sideSizes.side_c 
            },

            right: {
                side: 'directRight', x: -0.6, segment: 'direct', offset: -0.6, row: 'side_a',
                xPos: sideSizes.side_a - FRIDGE_WIDTH / 2, zPos: FRIDGE_WIDTH / 2, rotation: 0 , start: sideSizes.side_a - FRIDGE_WIDTH , end:sideSizes.side_a 
            }
        },
        uShaped: {
            left: {
                side: 'left', z: -0.6, segment: 'left', offset: -0.6, row: 'side_c',
                xPos: FRIDGE_WIDTH / 2, zPos: sideSizes.side_c - FRIDGE_WIDTH / 2, rotation: Math.PI / 2 ,start: sideSizes.side_c - FRIDGE_WIDTH , end:sideSizes.side_c 
            },

            right: {
                side: 'right', z: -0.6, segment: 'right', offset: -0.6, row: 'side_d',
                xPos: sideSizes.side_a - FRIDGE_WIDTH / 2, zPos: sideSizes.side_d - FRIDGE_WIDTH / 2, rotation: -Math.PI / 2, start: sideSizes.side_d - FRIDGE_WIDTH , end:sideSizes.side_d 
            }
        }
    }

    
    const rulesOutside = {
        direct: {
            left: {
                side: 'directLeft', x: +0.6, segment: 'direct', offset: -0.6,
                row: 'side_a', xPos: - FRIDGE_WIDTH / 2, zPos: FRIDGE_WIDTH / 2, rotation: 0 
            },

            right: {
                side: 'directRight', x: -0.6, segment: 'direct', offset: -0.6,
                row: 'side_a', xPos: sideSizes.side_a + FRIDGE_WIDTH / 2, zPos: FRIDGE_WIDTH / 2, rotation: 0 , 
            },
        },
        left: {
            left: {
                side: 'left', z: -0.6, segment: 'left', offset: -0.6, row: 'side_c',
                xPos: FRIDGE_WIDTH / 2, zPos: sideSizes.side_c + FRIDGE_WIDTH / 2, rotation: Math.PI / 2
            },

            right: {
                side: 'directRight', x: -0.6, segment: 'direct', offset: -0.6, row: 'side_a',
                xPos: sideSizes.side_a + FRIDGE_WIDTH / 2, zPos: FRIDGE_WIDTH / 2, rotation: 0 
            }
        },
        uShaped: {
            left: {
                side: 'left', z: -0.6, segment: 'left', offset: -0.6, row: 'side_c',
                xPos: FRIDGE_WIDTH / 2, zPos: sideSizes.side_c + FRIDGE_WIDTH / 2, rotation: Math.PI / 2 
            },

            right: {
                side: 'right', z: -0.6, segment: 'right', offset: -0.6, row: 'side_d',
                xPos: sideSizes.side_a - FRIDGE_WIDTH / 2, zPos: sideSizes.side_d + FRIDGE_WIDTH / 2, rotation: -Math.PI / 2
            }
        }
    }

    let rule

    //есди холодильник входит в  размеры
    if(kitchenStore.fridge.inSideInput){
      rule = rules[kitchenStore.type]?.[side]
      kitchenStore.fridge.inSideFridge = true
      console.log('ruleIn', rule)
    
      move(rule)
      penalBuilder.value.builder();
    } else {
      rule = rulesOutside[kitchenStore.type]?.[side]
      console.log('ruleOut', rule)

      kitchenStore.fridge.isSet = true
      kitchenStore.fridge.side = rule.side
      kitchenStore.fridge.row = rule.row
      kitchenStore.fridge.inSideFridge = false

      
    }
    model.position.set(rule.xPos, 0, rule.zPos)
    model.rotation.y = rule.rotation
    model.name = 'fridge'
    model.userData.side  = rule.side
    plannerConfig.fridge = model
 
    plannerConfig.fridgeInstance = fridgeInstance
    console.log(kitchenStore.rowSizesWithPanels)
    fridgeInstance.side = rule.segment
    const id = THREE.MathUtils.generateUUID()
    fridgeInstance.id = id
    fridgeInstance.raycasterBox.userData.id = id
    model.userData.id = id



   
    
    cabinetBuilder.value.executeConfig("actual", "currectActual");
}

//сдвиг модулей 
function move(rule){
    console.log('ruleMove', rule)
    
    const penals = penalStore.penals.filter(penal => penal.side === rule.side)
    const side = selectedSide.value

    // сдвиг пеналов
    penals.forEach(penal => {
        if (rule.x !== undefined) penal.x += rule.x
        if (rule.z !== undefined) penal.z += rule.z
    })

    const segment = rowSegmentsStore.segments[rule.segment]

    
    console.log('segment', segment)

    // сдвиг ряда
    segment.forEach(segment => {
        if (segment.type.includes('penal')) {
            segment.start += rule.offset
            segment.end += rule.offset
        }
    })


    rowSegmentsStore.addSegment(rule.segment, {
    start: rule.start,
    end: rule.end,
    width: 0.6,
    type: 'fridge',
    id: '1',
    });

    if (kitchenStore.type === 'direct' && side == 'left') kitchenStore.offsetForLeftRow += FRIDGE_WIDTH

    kitchenStore.rowSizesWithPanels[rule.row] = Number(kitchenStore.rowSizesWithPanels[rule.row]) + Number(rule.offset)

 //   kitchenStore.rowSizesCurrect[rule.row] =  Number(kitchenStore.rowSizesCurrect[rule.row]) + Number(rule.offset)
  
    penalStore.penalOffsetsState[rule.side] += FRIDGE_WIDTH

    kitchenStore.fridge.isSet = true
    kitchenStore.fridge.side = rule.side
    kitchenStore.fridge.row = rule.row
    kitchenStore.fridge.axis = rule.x ? 'x' : 'z'
    kitchenStore.fridge.segment = rule.segment
    kitchenStore.fridge.offset = rule.offset

}

//сдвиг после удаления холод
function moveAfterDeleteInside(){
    const side = kitchenStore.fridge.side
    const seg = kitchenStore.fridge.segment
    const row = kitchenStore.fridge.row

    penalStore.penalOffsetsState[side] -= FRIDGE_WIDTH
 
    const penals = penalStore.penals.filter(penal => penal.side === side)

    if (kitchenStore.type === 'direct' && side == 'directLeft') kitchenStore.offsetForLeftRow -= FRIDGE_WIDTH

    kitchenStore.rowSizesWithPanels[row] = Number(kitchenStore.rowSizesWithPanels[row]) + Number(FRIDGE_WIDTH)

    penals.forEach(penal => {
        const axis = kitchenStore.fridge.axis
        kitchenStore.fridge.side === 'directLeft'?  penal[axis] -= FRIDGE_WIDTH : penal[axis] += FRIDGE_WIDTH
    })



    rowSegmentsStore.segments[seg] = rowSegmentsStore.segments[seg].filter(segment=> segment.type !='fridge')
}

function clearStore(){  
    kitchenStore.fridge.isSet = false
    kitchenStore.fridge.axis = ''
    kitchenStore.fridge.isSet = false
    kitchenStore.fridge.side = ''
    kitchenStore.fridge.row = ''
    kitchenStore.fridge.inSideFridge = 'false'
    

}

function deleteFridge() {

    clear()

    if(kitchenStore.fridge.inSideFridge){
       moveAfterDeleteInside()
       penalBuilder.value.builder();
    }
    clearStore()
    removeObjectsByName('fridge')  
    cabinetBuilder.value.executeConfig("actual", "currectActual");
}

function removeObjectsByName(name) {
    plannerConfig.fridgeInstance = null

    plannerConfig.fridge = false
    const objectsToRemove = [];

    // 1. Находим все объекты с указанным именем
    cabinetBuilder.value.scene.traverse((object) => {
      if (object.name === name) {
        objectsToRemove.push(object);
      }
    });

    // 2. Удаляем объекты и очищаем ресурсы
    objectsToRemove.forEach((object) => {
      if (object.parent) {
        object.parent.remove(object);
      }

      // Очистка ресурсов
      if (object.geometry) object.geometry.dispose();

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    console.log(`Удалено объектов: ${objectsToRemove.length}`);
}


 function clear(){
    // удалить раковину
      ['SinkNormal', 'sinkModel'].forEach((name) => {
      cabinetBuilder.value.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => cabinetBuilder.value.scene.remove(element));
    })

    kitchenStore.parts.length = 0
    kitchenStore.rules.length = 0
    kitchenStore.filtredRules.length = 0,
    kitchenStore.filtredRulesTotal.length = 0

    kitchenStore.availableOven.length =  0
    kitchenStore.availableDish.length = 0
    kitchenStore.sink.isSet = false


    // this.KitchenSizes.dishwasher.size = 0
    // this.KitchenSizes.oven.size = 0
  }

</script>