import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("uiStore", () => {

  const hasError = ref(false)
  const message = ref('')

  function showError(text) {
    hasError.value = true
    message.value = text

    
     setTimeout(() => {
      hasError.value = false
    }, 2000)
  }

return {
    showError,
    hasError,
    message
}
})