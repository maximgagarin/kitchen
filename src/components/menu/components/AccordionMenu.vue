<template>
  <!-- Левая панель с изображением -->
  <div
    class="fixed top-5 right-1/3 w-60 h-60 mr-4 bg-gray-100 pointer-events-none rounded-md"
    v-if="hoveredItem"
  >
    <div class="flex items-center justify-center h-full text-gray-500">
      Превью: {{ hoveredItem }}
    </div>
  </div>

  <div class="w-85 border rounded bg-white shadow mt-5">
    <div v-for="group in menuGroup" :key="group.id">
      <div
        class="cursor-pointer px-4 py-2 font-semibold border-b hover:bg-gray-100"
        @click="toggleGroup(group.id)"
      >
        {{ group.title }}
       
      </div>

      <div v-if="isGroupActive(group.id)" class="pl-2">
        <template v-if="group.subgroups">
          <!-- Если есть подгруппы -->
          <div v-for="subgroup in group.subgroups" :key="subgroup.id">
            <div
              class="cursor-pointer px-4 py-2 text-sm font-medium hover:bg-gray-50"
              @click="toggleSubgroup(group.id, subgroup.id)"
            >
              {{ subgroup.title }}
            </div>

            <!-- Элементы подгруппы -->
            <div
              v-if="isSubgroupActive(group.id, subgroup.id)"
              class="flex flex-wrap justify-start gap-3 px-4 py-2"
            >
              <div
                v-for="item in subgroup.items"
                :key="item"
                class="w-16 h-20 bg-gray-200 cursor-pointer hover:underline text-sm rounded-sm flex items-center justify-center"
                @mousedown="$emit('select', item)"
                @mouseenter="hoveredItem = item"
                @mouseleave="hoveredItem = null"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <!-- Если нет подгрупп, отображаем элементы напрямую -->
          <div class="flex flex-wrap justify-start gap-3 px-4 py-2">
            <div
              v-for="item in group.items"
              :key="item"
              class="w-16 h-20 bg-gray-200 cursor-pointer hover:underline text-sm rounded-sm flex items-center justify-center"
              @mousedown="$emit('select', item)"
              @mouseenter="hoveredItem = item"
              @mouseleave="hoveredItem = null"
            >
              {{ item }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["select"]);

// Новая структура меню с поддержкой многоуровневости
const menuGroup = [
  {
    id: "modules",
    title: "Модули",
    subgroups: [
      {
        id: "lower-modules",
        title: "Нижние модули",
        items: ["cd-150", "cd-200", "cd-300", "cd-350", "cd-400", "cd-450", "cd-500", "cd-600", "cd-700", "cd-800"]
      },
      {
        id: "upper-modules",
        title: "Верхние модули",
        items: ["cd-150", "cd-200", "cd-300", "cd-350", "cd-400", "cd-450", "cd-500", "cd-600", "cd-700", "cd-800"]
      },
      {
        id: "penals",
        title: "Пеналы",
        items: ["cd-150", "cd-200", "cd-300", "cd-350", "cd-400", "cd-450", "cd-500", "cd-600", "cd-700", "cd-800"]
      }
    ]
  },
  {
    id: "materials",
    title: "Материалы",
    subgroups: [
      {
        id: "facade-colors",
        title: "Цвет фасадов",
        items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      },
      {
        id: "facade-types",
        title: "Тип фасадов",
        items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      },
      {
        id: "countertops",
        title: "Столешницы",
        items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      }
    ]
  },
  {
    id: "ovens",
    title: "Духовки",
    items: ["i-oven-600", "i-oven-450"]
  },
  {
    id: "sinks",
    title: "Мойки",
    items: ["ms500", "ms600", "ms800", "module-sink-1000", "module-sink-1000-left"]
  }
];

// Состояние для активных групп и подгрупп
const activeStates = ref({});
const hoveredItem = ref(null);

// Переключение состояния группы
function toggleGroup(groupId) {
  activeStates.value = {
    ...activeStates.value,
    [groupId]: !activeStates.value[groupId]
  };
}

// Переключение состояния подгруппы
function toggleSubgroup(groupId, subgroupId) {
  const key = `${groupId}-${subgroupId}`;
  activeStates.value = {
    ...activeStates.value,
    [key]: !activeStates.value[key]
  };
}

// Проверка активности группы
function isGroupActive(groupId) {
  return !!activeStates.value[groupId];
}

// Проверка активности подгруппы
function isSubgroupActive(groupId, subgroupId) {
  return !!activeStates.value[`${groupId}-${subgroupId}`];
}
</script>

<style scoped>
/* Любые дополнительные стили можно добавить здесь */
</style>