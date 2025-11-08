<template>
      <div v-if="plannerStore.controls.show"
    class="fixed p-1 bg-gray-100 pointer-events-none rounded-md shadow-lg overflow-hidden"
    :style="{
      top: (plannerStore.controls.position.y - 65) + 'px',
      left: (plannerStore.controls.position.x  - 15) + 'px',
    }"
    > <p class="text-gray-600">{{plannerStore.controls.title}}</p> </div>
    
</template>

<script setup>
import { usePlannerStore } from '../../../pinia/PlannerStore';
const plannerStore = usePlannerStore()
</script>