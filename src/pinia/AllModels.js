import { defineStore } from "pinia";
import { ref } from "vue";

export const useAllModelsStore = defineStore("allModels", () => {
  const models = ref([]);
  function addModel(model) {
    models.value.push(model);
  }

  

  return {
    models,
    addModel,
   
  };
});
