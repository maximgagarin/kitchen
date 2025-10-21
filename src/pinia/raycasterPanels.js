import { useKitchenSizesStore } from "./kitchenSizes";
import { usePenalStore } from "./penals";
import { defineStore } from "pinia";

export const useRaycasterPanelsStore = defineStore("RaycasterPanels", {
  state: () => ({
    }),
    getters:{  
        position(){
            const kitchenSizes = useKitchenSizesStore()
            const panelStore = usePenalStore()
            return{
                directX: (kitchenSizes.rowSizesCurrect.side_a)/2 + panelStore.penalOffsetsState.directLeft,
                leftZ:(kitchenSizes.rowSizesCurrect.side_c)/2 - 0.3 + 0.56 ,
                RightZ:(kitchenSizes.rowSizesCurrect.side_d)/2 - 0.3 + 0.56 
            } 
        }  
    }
  })

