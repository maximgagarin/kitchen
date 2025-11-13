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
    if(plannerStore.addModule.level === 1 ) plannerStore.objectMenu = true;
    if(plannerStore.addModule.level ===2 ) plannerStore.objectMenuL2 = true; // включаем меню

    if(plannerStore.addModule.level === 'sector'){

      let empty = plannerConfig.selectedEmptyInSector
    
      plannerStore.empty2levelHeight = empty.userData.height
      const box = new Box3().setFromObject( plannerConfig.selectedEmptyInSector );
      plannerConfig.selectedEmptyInSectorMinY = box.min.y;

      plannerConfig.selectedEmptyInSectorWorldPos =   plannerConfig.selectedEmptyInSector.getWorldPosition(  new Vector3()  );

      plannerStore.sectorMenu = true;
      
    }

}
</script>