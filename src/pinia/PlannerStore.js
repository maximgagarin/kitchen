import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlannerStore = defineStore("plannerStore", () => {
  const selectedObject = ref({
    isSelect: false,
    name: "",
  });

  //ящик с дверьми
  const c = ref([0.15, 0.2, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8]);

  const modelsList = ref({
    cd: [0.15, 0.2, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8],
    c1: [0.4, 0.6, 0.8],
    c2: [0.4, 0.5, 0.6, 0.8],
    c3: [0.3, 0.4, 0.5, 0.6, 0.8],
    p: [0.45, 0.6],
    d: [0.45, 0.6],
    ms: [0.5, 0.6, 0.8],
    su:[1,1.05],
    penal:[
        {
          name:'1',
          description:'дух + 1ящик',
          sizes:[0.45,0.6],
        }
     ,       
        {
          name:'2',
          description:'дух + 2ящ',
          sizes:[0.45,0.6],
        }
     ,     
        {
          name:'3',
          description:'дух и свч',
          sizes:[0.45,0.6],
        }
      ,   
        {
          name:'4',
          description:'полки и ящ.',
          sizes:[0.4,0.45,0.6],
        }
     ,
      
    ]
    
  });

  const modelsListL2 = ref({
    ВП:[ 0.15, 0.2, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8],
    ВПС:[  0.3,  0.4, , 0.6, 0.7, 0.8],
    ВПГ:[ 0.35, 0.5, 0.6, 0.8],
    ВПГС:[ 0.5, 0.6,  0.8],
    ПЛД:[ 0.5, 0.6,  0.8],



    ОПМ:[0.4, 0.6],
    ПГС:[0.8],
    ПЛВ:[0.4],
    ОПМГ:[0.6],
    ПГ:[0.35, 0.5, 0.6, 0.8],


  })

  const sectorWidth = ref(0.4)
  const sectorReady = ref(false)


  const objectMenu = ref(false)
  const objectMenuL2 = ref(false)

  //самый правый пустой первого уровня
  //const isRightmost = ref (false)

  //самый правый модуль это пенал
 // const isPenalRightCorner = ref(false)


  //только пенал в меню
  const onlyPenal = ref(false)

  //любой модуль в меню
  const anyModule = ref(false)


  const movedBack = ref(false)

  const hasCollision = ref(false)

  function showError(message) {
    hasCollision.value = true

    
     setTimeout(() => {
      hasCollision.value = false
    }, 2000)
  }


  return {
    modelsListL2,
    objectMenuL2,
    objectMenu,
    movedBack,
    selectedObject,
    modelsList,
    hasCollision,
    showError,
    sectorWidth,
    sectorReady,
    onlyPenal,
    anyModule,
  };
});
