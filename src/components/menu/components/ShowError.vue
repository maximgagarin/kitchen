<template>
  <div v-if="uiStore.hasError"
    
    class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 border border-red-300 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
  >
    <!-- <span class="font-medium">Ошибка: модуль не помещается.</span> -->
    <span>{{ uiStore.message }}</span>
  
  </div>
</template>

<script setup>
import { useUiStore } from '../../../pinia/Ui';

const  uiStore = useUiStore();
</script>