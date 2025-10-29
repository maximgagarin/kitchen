import Fridge from "../../menu/components/fridge.vue";
import { namesToDelete } from "./utils/namesToDelete";

export const plannerConfig = {
    selectedObject:false,
    selectedObject2:false,
    selectedEmpty:false,
    selectedEmptyUUID:null,
    selectedEmpty2L:false,
    models:[],
    models2L:[],
    penalsArray:[],
    penalsLeft:[],
    penalsDirect:[],
    penalsRight:[],
    fridge:false,

    namesToDelete:[],
    namesToDeleteDirect:[],
    namesToDeleteLeft:[],
    namesToDeleteRight:[],

    namesToDeleteDirect2L:[],
    namesToDeleteLeft2L:[],
    namesToDeleteRight2L:[],



    //модули
    modelsDirect:[],
    modelsLeft:[],
    modelsRight:[],

    modelsDirect2L:[],
    modelsLeft2L:[],
    modelsRight2L:[],


    sideOfSelected:null,

   

    moveBack:{
        otherBox:null,
        side:''
    },

  
    
    iconsArray:[],
    iconsArray2L:[],
    iconsArray1L:[],



    copyObject:false,
    copyObjectName:'',
    copyObjectSide:'',
    copyObjectSize:false,
    copyObjectFullName:false,


    empties2levelDirect:[],
    empties2levelLeft:[],

    empty2level:{
        position:0,
        side:''
    },

    //нажатие ctrl и ожидание нажатия на второй модуль для группировки
    ctrlPressed:false,


    //движение внутри секора
    isSector:false,
    selectedInSector:false,
    setFromObject:null,

    selectedSector:false,

    //модель которую хотим добавить в сектор
    modelToGroup:false,

    //выбранный пустой в секторе
    selectedEmptyInSector:false,
 
    selectedEmptyInSectorWorldPos:false,
    selectedEmptyInSectorMinY:false,

    kitchenBounds:null,
    

    // направление движения мышки по x
    lastMouseX:null,
    movingRight:null,
    movingDirection:null, 

      


    actualSlotsDirect:[],
    actualSlotsLeft:[],


    // массив пустых промежутков боксов
    emptiesObjects:[],
    emptiesObjectsLeft:[],


    // массив пустых промежутков боксов
    boxesArrayDirect:[],
    boxesArrayLeft:[],
    boxesArray:[],

    point:null,


    //столешницы 
    tabletops:[],
    tabletopsLeft:[],



    //границы пеналов
    penalsBorders:{
        directLeft:0,
        directRight:0,
        left:0,
        right:0
    },

    penalBounds:{
        minX:0,
        maxX:0,
        minZ:0,
        maxZ:0
    },


    //какой ряд до угла левого

    isAngleRow:'',
    isAngleRow2L:'',


    //массив кнопок объекта
    objectControls:[],
    swapCandidate:false,
    isCollision:false,
    oldPosition:0,
    directPlane1level:null,
    directPlane2level:null,
    directPlane3level:null,
    // ограничения движения модулей
    roomBounds:null,
    objectSize:null,


    //массивы для проверки коллизии во время движения модуля
    arraysToCheck:[]


}