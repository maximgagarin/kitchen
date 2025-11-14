<template>
      <div v-if="plannerStore.addModule.show"
    class="fixed p-1 bg-gray-100  cursor-pointer   hover:bg-gray-50 rounded-md shadow-lg overflow-hidden"
    :style="{
      top: (plannerStore.addModule.position.y - 65) + 'px',
      left: (plannerStore.addModule.position.x  - 15) + 'px',
    }"
    > <p class="text-gray-600  "
    @click="handle"
    >{{plannerStore.addModule.title}}</p> </div>
    
</template>

<script setup>
import { Box3  , Vector3} from 'three';
import { usePlannerStore } from '../../../pinia/PlannerStore';
import { plannerConfig } from '../../configurator/planner/planerConfig';


const plannerStore = usePlannerStore()

function handle(){
    if(plannerStore.addModule.level === 1 ){
      console.log('addTo l1')
      plannerStore.objectMenu = true;
      plannerStore.objectMenuL2 = false;
    } 
    if(plannerStore.addModule.level ===2 ) {
      console.log('add to l2')
      plannerStore.objectMenuL2 = true; // включаем меню
      plannerStore.objectMenu = false;

    }

    if(plannerStore.addModule.level === 'sector'){

      console.log('add to sector')

      let empty = plannerConfig.selectedEmptyInSector
    
      plannerStore.empty2levelHeight = empty.userData.height
      const box = new Box3().setFromObject( plannerConfig.selectedEmptyInSector );
      plannerConfig.selectedEmptyInSectorMinY = box.min.y;

      plannerConfig.selectedEmptyInSectorWorldPos =   plannerConfig.selectedEmptyInSector.getWorldPosition(  new Vector3()  );

      plannerStore.sectorMenu = true;
      
    }

}
</script>