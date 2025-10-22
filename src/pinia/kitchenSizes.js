import { defineStore } from 'pinia'
import { usePenalStore } from './penals'

export const useKitchenSizesStore = defineStore('KitchenSizes', {
  state: () => ({
    sideSizes: {
      side_c: 2.75,
      side_d: 2.75,
      side_a: 3
    },

    rowSizesWithPanels: {
      side_c: 2.2,
      side_d: 2.2,
      side_a: 3
    },

    parts:[],

    rules:[],
    filtredRules:[],
    filtredRulesTotal:[],


    //сколько техники влезет
    tech:{
      none:false,
      one:false,
      two:false,
    },

    //шаг меню
    step:0,

    algorythm:{
      start:false
    },

    errors:{
      size1level:false,
      size2level:false,
    },

    //уровни кухни
    levels:{
      direct1:true,
      direct2:true,
      left1:true,
      left2:true,
      right1:true,
      right2:true,
    },

    offsets:{
      left:0,
      right:0,
      directLeft:0,
      directRight:0,
    },

    //сдвиг прямого ряда по x при добавлении пеналов
    offsetForLeftRow:0,

    //тип кухни
    type:'direct',

    //пенал с духовкой
    isOvenPenal:false,

    //тип плиты
    stoveType:'',
    stoveWidth:0,

    //посудомойка
    isDishwash:false,
    dishwash:0,
    

    isSink:false,


    level3: false,

  sink:{
    isSet:false,
    side:'direct',
    size:0,
    location:'', // место в ряду
  },

   availableOven:[],
   availableDish:[],



    oven:{
      isOven:false,
      type:'in',
      side:'direct',
      size:0.45,
    },

    dishwasher:{
      isDishwash:false,
      side:'',
      size:0.45
    },

    cookTop:{
      size:0.3
    },

    fridge:{
      isSet:false,
      side:'',
      axis:'',
      row:'',
      segment:'',
      offset:0,
      inSideInput:false,
      inSideFridge:false
    },


    modules_height: {
      height2level: 0.7,
      height3level: 0.35,
    },

    //отключить удаление нижних рядов
    delete_1level:true,
    delete_leftLevel:true,
    delete_rightLevel:true,
    
   


    //положение точки для установки раковины и модуля и сторона
    raycaster_for_sink:{
      x:0,
      z:0,
      side:''
    }

  }),

  getters: {
    rowSizes(state) {
      //ширина ряда минус сдвиг 0.56
      return {
        side_c: state.sideSizes.side_c  - 0.56 ,
        side_d: state.sideSizes.side_d - 0.56,
        side_a: state.sideSizes.side_a
      }
    },

    //актуальная ширина ряда минус ширина пенвлов  минус сдвиг 0.56(прямой ряд)
    rowSizesCurrect(state){
      let penalStore = usePenalStore()
      return{
        side_c: state.sideSizes.side_c - 0.56 - penalStore.penalOffsetsState.left,
        side_d: state.sideSizes.side_d - 0.56 - penalStore.penalOffsetsState.right,
        side_a: state.sideSizes.side_a - penalStore.penalOffsetsState.directLeft- penalStore.penalOffsetsState.directRight

      }
    }
  }
})