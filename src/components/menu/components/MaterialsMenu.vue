<template>

    <!-- Левая панель с изображением -->
    <div  class="fixed top-5 right-1/4 w-60 h-60 mr-4 bg-gray-100 pointer-events-none rounded-md"
  v-if="hoveredItem">
   
    </div>

  <div class="w-85 border rounded bg-white shadow mt-5">
    <div v-for="group in moduleGroups" :key="group.id">
      <div
        class="cursor-pointer px-4 py-2 font-semibold border-b hover:bg-gray-100"
        @click="toggle(group.id)"
      >
        {{ group.title }}
      </div>

     
        <div v-if="activeGroup === group.id" class="flex flex-wrap justify-start gap-3  px-4 py-2 ">
          <div 
            v-for="item in group.items"
            :key="item"
            class="w-16 h-20 bg-gray-100 cursor-pointer hover:underline text-sm  rounded-sm"
            @click="$emit('select', item)"
            @mouseenter="hoveredItem = item"
            @mouseleave="hoveredItem = null"
 
          >
            {{ item }}
          </div>
        </div>
    
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";





const moduleGroups = [
  {
    id: "lower",
    title: "Столешницы",
    items: ["600", "800", "1000", "444", "444", "444", "444"],
  },
  {
    id: "upper",
    title: "Тип фасадов",
    items: ["upper-600", "upper-800"],
  },
  {
    id: "penals",
    title: "Цвет фасадов",
    items: ["ms500", "ms500"],
  },
];


const emit = defineEmits(['selectMaterial']);

const activeGroup = ref(null);
const hoveredItem = ref(null);


function toggle(id) {
  activeGroup.value = activeGroup.value === id ? null : id;
}
</script>

<style scoped></style>
