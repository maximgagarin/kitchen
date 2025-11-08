<template>
      <div v-if="plannerStore.showControlTitle"
    class="fixed w-[35px] h-[35px] bg-gray-100 pointer-events-none rounded-md shadow-lg overflow-hidden"
    :style="{
      top: (plannerStore.controlTitlePosition.y + 15) + 'px',
      left: (plannerStore.controlTitlePosition.x + 30) + 'px',
      opacity: hoveredItem ? 1 : 0,
      transform: hoveredItem ? 'scale(1)' : 'scale(0.95)',
    }"
    > <p>text</p> </div>
    
</template>

<script setup>
import { usePlannerStore } from '../../../pinia/PlannerStore';
const plannerStore = usePlannerStore()
</script>