<template>
  <!-- Модальное окно -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 opacity-90 flex items-center justify-center z-50"
  >
    <div
      class="bg-white p-6 rounded-lg max-w-5xl w-full max-h-[80vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Варианты</h2>
        <button
          class="text-gray-500 hover:text-gray-700 border rounded p-2 text-2xl"
          @click="changeLevel(1)"
          :class="{
            'border-blue-500 border-2 bg-blue-50': showLevel === 1,
          }"
        >
          1 уровень
        </button>
        <button
          class="text-gray-500 hover:text-gray-700 border rounded p-2 text-2xl"
          @click="changeLevel(2)"
          :class="{
            'border-blue-500 border-2 bg-blue-50': showLevel === 2,
          }"
        >
          2 уровень
        </button>
        <button
          class="text-gray-500 hover:text-gray-700 text-2xl"
          @click="emit('escapePressed')"
        >
          ✕
        </button>
      </div>

      <div v-if="showLevel === 1" class="flex justify-between">
        <!-- Левые варианты -->
        <div v-if="filtred1.leftPart1.length">
          <h3 class="font-semibold text-lg mb-2">Левые</h3>
          <div
            v-for="(variant, index) in filtred1.leftPart1"
            :key="'left-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentLeft1 === index && showLevel === 1,
            }"
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
              Поставить
            </button>
          </div>
        </div>

        <!-- Левые варианты часть 2-->
        <div v-if="filtred1.leftPart2.lengthh">
          <h3 class="font-semibold text-lg mb-2">Левые2</h3>
          <div
            v-for="(variant, index) in filtred1.leftPart2"
            :key="'left-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentLeft2 === index && showLevel === 1,
            }"
          >
            <div>
              <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
              <pre class="text-sm mt-2">{{
                JSON.stringify(variant, null, 2)
              }}</pre>
            </div>
            <button
              class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              @click="selectVariantLeft2(index)"
            >
              Поставить
            </button>
          </div>
        </div>

        <!-- Прямые варианты -->
        <div v-if="filtred1.directPart1.length">
          <h3 class="font-semibold text-lg mb-2">Прямые</h3>
          <div
            v-for="(variant, index) in filtred1.directPart1"
            :key="'direct-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentDirect1 === index && showLevel === 1,
            }"
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
              Поставить
            </button>
          </div>
        </div>

        <!-- Прямые варианты часть2 -->
        <div v-if="filtred1.directPart2.length.length">
          <h3 class="font-semibold text-lg mb-2">Прямые2</h3>
          <div
            v-for="(variant, index) in filtred1.directPart2"
            :key="'direct-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentDirect2 === index && showLevel === 1,
            }"
          >
            <div>
              <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
              <pre class="text-sm mt-2">{{
                JSON.stringify(variant, null, 2)
              }}</pre>
            </div>
            <button
              class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              @click="selectVariantDirect2(index)"
            >
              Поставить
            </button>
          </div>
        </div>
      </div>

      <!-- второй уровень -->
      <div v-if="showLevel === 2" class="flex justify-between">
        <!-- левые варианты -->
        <div v-if="filtred2.leftPart1.length">
          <h3 class="font-semibold text-lg mb-2">Левые</h3>
          <div
            v-for="(variant, index) in filtred2.leftPart1"
            :key="'direct-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentLevel2Left1 === index && showLevel === 2,
            }"
          >
            <div>
              <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
              <pre class="text-sm mt-2">{{
                JSON.stringify(variant, null, 2)
              }}</pre>
            </div>
            <button
              class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              @click="selectVariantLeft1Level2(index)"
            >
              Поставить
            </button>
          </div>
        </div>

        <div v-if="filtred2.leftPart2.length">
          <h3 class="font-semibold text-lg mb-2">Левые2</h3>
          <div
            v-for="(variant, index) in filtred2.leftPart2"
            :key="'direct-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentLevel2Left2 === index && showLevel === 2,
            }"
          >
            <div>
              <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
              <pre class="text-sm mt-2">{{
                JSON.stringify(variant, null, 2)
              }}</pre>
            </div>
            <button
              class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              @click="selectVariantLeft2Level2(index)"
            >
              Поставить
            </button>
          </div>
        </div>

        <!-- Прямые варианты -->
        <div v-if="filtred2.directPart1.length">
          <h3 class="font-semibold text-lg mb-2">Прямые</h3>
          <div
            v-for="(variant, index) in filtred2.directPart1"
            :key="'direct-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentLevel2Direct1 === index && showLevel === 2,
            }"
          >
            <div>
              <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
              <pre class="text-sm mt-2">{{
                JSON.stringify(variant, null, 2)
              }}</pre>
            </div>
            <button
              class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              @click="selectVariantDirect1Level2(index)"
            >
              Поставить
            </button>
          </div>
        </div>

        <div v-if="filtred2.directPart2.length">
          <h3 class="font-semibold text-lg mb-2">Прямые2</h3>
          <div
            v-for="(variant, index) in filtred2.directPart2"
            :key="'direct-' + index"
            class="mb-4 p-4 border rounded flex justify-between items-center"
            :class="{
              'border-blue-500 border-2 bg-blue-50':
                currentLevel2Direct2 === index && showLevel === 2,
            }"
          >
            <div>
              <h3 class="font-semibold">Вариант {{ index + 1 }}</h3>
              <pre class="text-sm mt-2">{{
                JSON.stringify(variant, null, 2)
              }}</pre>
            </div>
            <button
              class="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              @click="selectVariantDirect2Level2(index)"
            >
              Поставить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject, ref, watch } from "vue";
import { defineEmits } from "vue";
const emit = defineEmits(["escapePressed"]);
const algorithmManager = inject("algorithmManager");

const props = defineProps({
  filtred1: Object,
  filtred2: Object,
});

function changeLevel(level) {
  showLevel.value = level;
  console.log(showLevel.value);
}

const showLevel = ref(1);

let currentDirect1 = ref(0);
let currentDirect2 = ref(0);
let currentLeft1 = ref(0);
let currentLeft2 = ref(0);

let currentLevel2Direct1 = ref(0);
let currentLevel2Direct2 = ref(0);
let currentLevel2Left1 = ref(0);
let currentLevel2Left2 = ref(0);

// Выбор из модального окна
const selectVariantDirect = (index) => {
  algorithmManager.value.algorithm1level.variantDirect(
    index,
    currentDirect2.value
  );
  currentDirect1.value = index;
  emit("escapePressed");
};

const selectVariantDirect2 = (index) => {
  currentDirect2.value = index;
  algorithmManager.value.algorithm1level.variantDirect(
    currentDirect1.value,
    index
  );

  emit("escapePressed");
};

const selectVariantLeft = (index) => {
  currentLeft1.value = index;

  algorithmManager.value.algorithm1level.variantLeft(index, currentLeft2.value);
  emit("escapePressed");
};

const selectVariantLeft2 = (index) => {
  currentLeft2.value = index;
  algorithmManager.value.algorithm1level.variantLeft(currentLeft1.value, index);
  emit("escapePressed");
};

const selectVariantDirect1Level2 = (index) => {
  algorithmManager.value.algorithm2level.buildDirect(
    index,
    currentLevel2Direct2.value
  );
  currentLevel2Direct1.value = index;
  emit("escapePressed");
};
const selectVariantDirect2Level2 = (index) => {
  currentLevel2Direct2.value = index;

  console.log("step", index, currentLevel2Direct1.value);

  algorithmManager.value.algorithm2level.buildDirect(
    currentLevel2Direct1.value,
    index
  );

  emit("escapePressed");
};
const selectVariantLeft1Level2 = (index) => {
  console.log("selectVariantLeft1Level2");
  algorithmManager.value.algorithm2level.buildLeft(
    index,
    currentLevel2Left2.value
  );
  currentLevel2Left1.value = index;
  emit("escapePressed");
};
const selectVariantLeft2Level2 = (index) => {
  console.log("selectVariantLeft2Level2");

  algorithmManager.value.algorithm2level.buildLeft(
    currentLevel2Left1.value,
    index
  );
  currentLevel2Left2.value = index;
  emit("escapePressed");
};

function handleKeyDown(e) {
  if (e.key === "Escape") {
    emit("escapePressed");
  }
}

// Автоматически добавлять/удалять слушатель
// watch(showModal, (val) => {
//   if (val) {
//     window.addEventListener("keydown", handleKeyDown);
//   } else {
//     window.removeEventListener("keydown", handleKeyDown);
//   }
// });

// onUnmounted(() => {
//   window.removeEventListener("keydown", handleKeyDown);
// });
</script>
