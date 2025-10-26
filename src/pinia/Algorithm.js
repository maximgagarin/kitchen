import { defineStore } from "pinia";
import { ref } from "vue";

export const useAlgorithmStore = defineStore("Algorithm", () => {


 const rulesName = ref([])
 const resultDirect = ref([])
 const resultLeft = ref([])
 const resultRight = ref([])

 const partSizes  = ref({
    direct1:0,
    direct2:0,
    left1:0,
    left2:0,
    right1:0,
    right2:0
 })

 const reverse = ref({
  A1:false,
  A2:false,
  C1:false,
  C2:false,
  D1:false,
  D2:false
 })

  
  const filtredDirectPart1 = ref([])
  const filtredDirectPart2 = ref([])
  const filtredLeftPart1 = ref([])
  const filtredLeftPart2 = ref([])
  const filtredRightPart1 = ref([])
  const filtredRightPart2 = ref([])

  const filtredLevel2 = ref({
    directPart1:[],
    directPart2:[],
    leftPart1:[],
    leftPart2:[],
    rightPart1:[],
    rightPart2:[]
  })
  

  const variantIndex = ref({
    level1:{
      direct1:0,
      direct2:0,
      left1:0,
      left2:0,
      right1:0,
      right2:0,
    },
    level2:{
      direct1:0,
      direct2:0,
      left1:0,
      left2:0,
      right1:0,
      right2:0,
    },
    
  })

  const variants = ref([])

  return {
    rulesName,
    variants,
    filtredDirectPart1,
    filtredDirectPart2,
    filtredLeftPart1,
    filtredLeftPart2,
    filtredLevel2,
    
    variantIndex, 
    rulesName,
    resultDirect,
    resultLeft,
    resultRight,
    partSizes,
    reverse
  };
});