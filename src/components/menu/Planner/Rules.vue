<template>
    <div  class="  bg-gray-100 pointer-events-none rounded-md shadow-lg p-2 overflow-hidden ">
        <div
        v-for="rule in algStore.rulesName"
        >
        <p>{{ rule.rule }}</p>
    </div>

    </div>
</template>
<script setup>
    import { useAlgorithmStore } from '../../../pinia/Algorithm';
    const algStore = useAlgorithmStore()

</script>