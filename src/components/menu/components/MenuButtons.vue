<template>
    <div v-if="!kitchenSizes.algorythm.start && kitchenStore.step !== 5" class="flex justify-between mt-6 mb-2.5 px-4">
        <button v-if="kitchenStore.step > 0" @click="prev" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
            Назад
        </button>
        <button @click="next" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            :disabled="kitchenStore.step === 2 && !kitchenStore.sink.isSet">
            Далее
        </button>
    </div>
    <!-- <button @click="showConfig">конфиг</button> -->

</template>

<script setup>
import { useKitchenSizesStore } from '../../../pinia/kitchenSizes';
const kitchenStore = useKitchenSizesStore()

</script>
