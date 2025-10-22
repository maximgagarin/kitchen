import { namesToDelete } from "../../planner/utils/namesToDelete";

export const algorithmConfig = {


  rulesNew:{
    direct:[],
  },


  parts_sizes: {
    directPart1: 0,
    directPart2: 0,
    leftPart1: 0,
    leftPart2: 0,
    rightPart1: 0,
    rightPart2: 0,
  },



  parts_sizes2: {
    directPart1: 0,
    directPart2: 0,
    dp1_larger:false,
    leftPart1: 0,
    leftPart2: 0,
    lp1_larger:false,
    rightPart1: 0,
    rightPart2: 0,
    rp1_larger:false,
  },


  rules: {
    directPart1: [],
    directPart2: [],
    leftPart1: [],
    leftPart2: [],
    rightPart1: [],
    rightPart2: [],
  },


  filtredRules: {
    directPart1: [],
    directPart2: [],
    leftPart1: [],
    leftPart2: [],
    rightPart1: [],
    rightPart2: [],
  },

  rulesName: {
    direct1: '',
    direct2: '',
    left1: '',
    left2: '',
    right1: '',
    right2: ''
  },

  rowStart:{
    direct:0,
    left:0,
    right:0,
  },

  angleRow:{
    direct:false,
    left:false,
    right:false,
  },


  resultDirect: [],
  resultLeft: [],
  resultRight: [],

  currentPos: 0,
  direct2parts: false,
  left2parts: false,
  right2parts: false,



  //все линии модулей
  lines:[],

  sheets: {
    direct1: null,
    direct2: null,
    left1: null,
    left2: null,
  },

  oven: {
    isOven: false,
    side: '',
    position: 0,
  },

   dishwasher: {
    is: false,
    side: '',
    position: 0,
  },

  sinkSize: 0.6,
  sinkPosition: 0,
  sideSink: 0,

  level2: {
    rowStart:{
      direct:0,
      left:0,
      right:0,
    },
    resultDirect: [],
  resultLeft: [],
  resultRight: [],
    filtredRules: {
      directPart1: [],
      directPart2: [],
      leftPart1: [],
      leftPart2: [],
    },
    isAngleRow:'',
    filtred: [],
    currentPos: 0,
    modelsDirect2Level: [],
    rules: [],
    // filtredDirect: [],
    // filtredLeft: [],
    // filtredRight: [],
    partsSide: '',
    partsSize: {
      directPart1: 0,
      directPart2: 0,
      leftPart1: 0,
      leftPart2: 0,
      rightPart1: 0,
      rightPart2: 0,
    },
    part1: [],
    part2: [],
    namesToDeleteDirect: [],
    namesToDeleteLeft: [],
    namesToDeleteRight: [],
    currentDirect: 0,
    currentLeft: 0.3,
    currentRight: 0.3,
  }



};
