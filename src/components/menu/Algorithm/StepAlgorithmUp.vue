<template>
  <p class="text-m font-bold text-center mb-1">Алгоритм</p>

  <!-- Модальное окно -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
    >
      <div class=" flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Варианты</h2>
        <button
          class="text-gray-500 hover:text-gray-700 text-2xl"
          @click="showModal = false"
        >
          ✕
        </button>
      </div>

     
      <div class="flex justify-between">
     <!-- Прямые варианты -->
      <div v-if="filtredVariantDirect.length">
        <h3 class="font-semibold text-lg mb-2">Прямые</h3>
        <div
          v-for="(variant, index) in filtredVariantDirect"
          :key="'direct-' + index"
          class="mb-4 p-4 border rounded flex justify-between items-center"
        >
          <div>
            <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
            <pre class="text-sm mt-2">{{
              JSON.stringify(variant, null, 2)
            }}</pre>
          </div>
          <button
            class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            @click="selectVariantDirect(index)"
          >
            Перейти
          </button>
        </div>
      </div>

      <!-- Левые варианты -->
      <div v-if="filtredVariantLeft.length">
        <h3 class="font-semibold text-lg mb-2">Левые</h3>
        <div
          v-for="(variant, index) in filtredVariantLeft"
          :key="'left-' + index"
          class="mb-4 p-4 border rounded flex justify-between  items-center"
        >
          <div>
            <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
            <pre class="text-sm mt-2">{{
              JSON.stringify(variant, null, 2)
            }}</pre>
          </div>
          <button
            class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            @click="selectVariantLeft(index)"
          >
            Перейти
          </button>
        </div>
      </div>
      </div>
  
    </div>
  </div>

  <!-- Компонент опций -->
  <Options />

  <div class="mt-5 flex justify-between">
      <!-- Кнопка запуска -->
  <div class="text-center mb-6">
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      @click="run"
    >
      Запустить алгоритм
    </button>
  </div>
   <!-- Кнопка показа модального окна -->
  <div class="text-center mb-6">
    <button
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      @click="showVariants"
    >
      Показать варианты
    </button>
  </div>

  </div>



  <!-- Кнопки prev/next -->
  <div class="flex flex-wrap justify-center gap-4 mb-6">
    <!-- Прямые -->
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      @click="prev"
      :disabled="variant <= 0"
    >
      ◀ Пред. прямой
    </button>
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      @click="next"
      :disabled="variant >= filtredVariantDirect.length - 1"
    >
      След. прямой ▶
    </button>

    <!-- Левые -->
    <button
      class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
      @click="prevLeft"
      :disabled="variantLeftIndex <= 0"
    >
      ◀ Пред. левый
    </button>
    <button
      class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
      @click="nextLeft"
      :disabled="variantLeftIndex >= filtredVariantLeft.length - 1"
    >
      След. левый ▶
    </button>
  </div>

 

  <!-- Отображение текущих вариантов -->
  <div class="flex flex-col md:flex-row justify-center gap-8 p-4">
    <div v-if="algorithmOn" class="w-full md:w-1/2">
      <h3 class="font-semibold text-lg mb-2">Прямой: Вариант {{ variant + 1 }}</h3>
      <pre class="text-sm bg-gray-100 p-2 rounded">{{ JSON.stringify(actualDirect, null, 2) }}</pre>
      <p class="mt-2">Строка: {{ actualDirect?.rowNum + 1 }}</p>
    </div>

    <div v-if="algorithmOn" class="w-full md:w-1/2">
      <h3 class="font-semibold text-lg mb-2">Левый: Вариант {{ variantLeftIndex + 1 }}</h3>
      <pre class="text-sm bg-gray-100 p-2 rounded">{{ JSON.stringify(actualLeft, null, 2) }}</pre>
      <p class="mt-2">Строка: {{ actualLeft?.rowNum + 1 }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, watch} from "vue";
import Options from "./Options.vue";

// Pinia и зависимости
const cabinetBuilder = inject("cabinetBuilder");
const algorithmManager = inject("algorithmManager");

// Состояние
const variant = ref(0);
const variantLeftIndex = ref(0);
const showModal = ref(false);
const algorithmOn = ref(false);

// Данные
const filtredVariantDirect = ref([]);
const filtredVariantLeft = ref([]);
const actualDirect = ref();
const actualLeft = ref();

// Запуск алгоритма
function run() {
  cabinetBuilder.value.deleteAll2();
  algorithmManager.value.run();
  algorithmOn.value = true;

  filtredVariantDirect.value = algorithmManager.value.rulesFiltredDirect;
  filtredVariantLeft.value = algorithmManager.value.rulesFiltredLeft;

  // updateVariant(0);
  // updateVariantLeft(0);
}

// Обновления текущих вариантов
function updateVariant(index) {
  variant.value = index;
  algorithmManager.value.variantDirect(index);
  actualDirect.value = algorithmManager.value.actualDirect;
}

function updateVariantLeft(index) {
  variantLeftIndex.value = index;
  algorithmManager.value.variantLeft(index);
  actualLeft.value = algorithmManager.value.actualLeft;
}

// Переключения
const next = () => variant.value < filtredVariantDirect.value.length - 1 && updateVariant(variant.value + 1);
const prev = () => variant.value > 0 && updateVariant(variant.value - 1);
const nextLeft = () => variantLeftIndex.value < filtredVariantLeft.value.length - 1 && updateVariantLeft(variantLeftIndex.value + 1);
const prevLeft = () => variantLeftIndex.value > 0 && updateVariantLeft(variantLeftIndex.value - 1);

// Выбор из модального окна
const selectVariantDirect = (index) => {
  updateVariant(index);
  showModal.value = false;
};

const selectVariantLeft = (index) => {
  updateVariantLeft(index);
  showModal.value = false;
};

// Показ модального окна
const showVariants = () => {
  showModal.value = true;
};


function handleKeyDown(e) {
  if (e.key === 'Escape') {
    showModal.value = false;
  }
}

// Автоматически добавлять/удалять слушатель
watch(showModal, (val) => {
  if (val) {
    window.addEventListener('keydown', handleKeyDown);
  } else {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
<style scoped>
.button {
  margin-bottom: 5px;
  background-color: #ffffff;
  border: 1px solid black;

  border-radius: 5px;
  color: #000000;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;

  padding: 10px 10px;
  text-align: center;
}

.sinkButton:hover {
}
</style>
