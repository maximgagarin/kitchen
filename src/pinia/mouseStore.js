
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMouseStore = defineStore('mouse', () => {
  // Состояние
  const mouseX = ref(0);
  const mouseY = ref(0);

  // Действия для обновления состояния
  function updateMousePosition(x, y) {
    mouseX.value = x;
    mouseY.value = y;
  }

  // Геттеры для нормализованных координат
  const normalizedX = computed(() => (mouseX.value / window.innerWidth) * 2 - 1);
  const normalizedY = computed(() => -(mouseY.value / window.innerHeight) * 2 + 1);

  return {
    mouseX,
    mouseY,
    updateMousePosition,
    normalizedX,
    normalizedY,
  };
});
