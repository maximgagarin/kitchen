import { defineStore } from "pinia";
import { useKitchenSizesStore } from "./kitchenSizes";

export const usePenalStore = defineStore("penals", {
  state: () => ({
    penals: [],
    countLeft: 0,
    countRight: 0,
    countLeftDirect: 0,
    countRightDirect: 0,
    penalOffsetsState: {
      left: 0,
      right: 0,
      directLeft: 0,
      directRight: 0,
    },
  }),

  actions: {
    addPenal(penal) {
      const kitchenSizes = useKitchenSizesStore();
      switch (penal.side) {
        case 'left':
          penal.index = this.countLeft++;
          this.penalOffsetsState.left += penal.width;
          kitchenSizes.offsets.left += penal.width;
          if(penal.oven == 10) penal.index = -1
          break;
        case 'right':
          penal.index = this.countRight++;
          this.penalOffsetsState.right += penal.width;
          kitchenSizes.offsets.right += penal.width;

          if(penal.oven == 10) penal.index = -1

          break;
        case 'directLeft':
          kitchenSizes.offsetForLeftRow +=penal.width
          penal.index = this.countLeftDirect++;
          this.penalOffsetsState.directLeft += penal.width;
          kitchenSizes.offsets.directLeft += penal.width;

          if(penal.oven == 10) penal.index = -1

          break;
        case 'directRight':
          penal.index = this.countRightDirect++;
          this.penalOffsetsState.directRight += penal.width;
          kitchenSizes.offsets.directRight += penal.width;

          if(penal.oven == 10) penal.index = -1

          break;
      }
    
      this.penals.push(penal);
      this.syncKitchenSizes();
    },

    removePenal(id) {
      const kitchenSizes = useKitchenSizesStore();
      const penal = this.penals.find((p) => p.id === id);
      if (!penal) return;

      this.penals = this.penals.filter((p) => p.id !== id);

      switch (penal.side) {
        case "left":
          this.countLeft--;
          this.penalOffsetsState.left-=penal.width
          break;
        case "right":
          this.countRight--;
          this.penalOffsetsState.right-=penal.width

          break;
        case "directLeft":
          kitchenSizes.offsetForLeftRow -=penal.width
          this.countLeftDirect--;
          this.penalOffsetsState.directLeft-=penal.width

          break;
        case "directRight":
          this.countRightDirect--;
          this.penalOffsetsState.directRight-=penal.width

          break;
      }

      this.syncKitchenSizes();
    },

    syncKitchenSizes() {
      const kitchenSizes = useKitchenSizesStore();

      const rowSizes = kitchenSizes.rowSizes;
      const offsets = this.penalOffsetsState; // используем геттер

      kitchenSizes.rowSizesWithPanels.side_c = (rowSizes.side_c - offsets.left).toFixed(3);
      kitchenSizes.rowSizesWithPanels.side_d = (rowSizes.side_d - offsets.right).toFixed(3);
      kitchenSizes.rowSizesWithPanels.side_a = Number((rowSizes.side_a - offsets.directRight).toFixed(3))    - offsets.directLeft
   

    },
  },

  getters: {
    penalOffsets(state) {
      // Геттер остается с именем penalOffsets
      const bySide = {
        left: 0,
        right: 0,
        directLeft: 0,
        directRight: 0,
      };

      state.penals.forEach((p) => {
        bySide[p.side] += Number(p.width);
      });

      return bySide;
    },
    //проверка наличия пенала с духовкой
    isOven(state){
      return state.penals.some(penal => ['1', '2', '3'].includes(penal.oven));
    }
  },
});
