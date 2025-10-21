


// function updateConfigParams(obj, key, newValue) {
//   for (const section in obj) {
//     if (typeof obj[section] === "object" && obj[section] !== null) {
//       ["leftLevel", "rightLevel", "direct", "caseCabinets"].forEach((category) => {
//         if (Array.isArray(obj[section][category])) {
//           obj[section][category].forEach((item) => {
//             if (item.params) {
//               item.params = item.params.map((param) => (param === key ? newValue : param));
//             }
//           });
//         }
//       });
//     }
//   }
// }



const config3 = {
  start: {
    leftLevel: [],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      
  ],
    caseCabinets: [
     
    ],
  },
  actual: {
    leftLevel: [],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
  

    ],
    caseCabinets: [

    ],
    leftPenal:[],
    rightPenal:[],
    directPenalRight:[],
    directPenalLeft:[],

    upper_penal_level2_left:[],
    upper_penal_level2_right:[],
    upper_penal_level2_directLeft:[],
    upper_penal_level2_directRight:[],

    upper_penal_level3_left:[],
    upper_penal_level3_right:[],
    upper_penal_level3_directLeft:[],
    upper_penal_level3_directRight:[],



  },
  direct: {
    leftLevel: [],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [],
  },
  right: {
    leftLevel: [],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_short_l2", params: [3] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [
       
       
    ],
  },


  left: {
    leftLevel: [
      { funk: "build_left_l1", params: [2.2] },
      { funk: "build_left_l2", params: [2.2] },
      { funk: "build_left_short_l2", params: [3] },
    ],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    
  },



  uShaped: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_short_l2", params: [3] },
    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_short_l2", params: [3] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [],


  },
  direct1: {
    leftLevel: [],
    rightLevel: [],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_direct2: {
    leftLevel: [],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_left1: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
    ],
    rightLevel: [],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_direct2_left1: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
    ],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_left1_left2: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_long_l2", params: [3] },
    ],
    rightLevel: [],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_direct2_left1_left2: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_short_l2", params: [3] },
    ],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_right1: {
    leftLevel: [],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
    ],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_direct2_right1: {
    leftLevel: [],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_right1_right2: {
    leftLevel: [],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_short_l2", params: [3] },
    ],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_direct2_right1_right2: {
    leftLevel: [],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_short_l2", params: [3] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
    ],
    caseCabinets: [],
  },direct1_direct2_direct3: {
    leftLevel: [],
    rightLevel: [],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      { funk: "build_direct_l3", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_left1_left2_left3: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_l3", params: [2] },
      { funk: "build_left_long_l2", params: [3] },
      { funk: "build_left_long_l3", params: [3] },

    ],
    rightLevel: [],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_right1_right2_right3: {
    leftLevel: [
  

    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_l3", params: [2] },
      { funk: "build_right_long_l2", params: [3] },
      { funk: "build_right_long_l3", params: [3] },

    ],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_direct2_direct3_left1_left2_left3: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_l3", params: [2] },
      { funk: "build_left_short_l2", params: [3] },

    ],
    rightLevel: [
    
   //   { funk: "build_right_long_l3", params: [3] },

    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      { funk: "build_direct_l3", params: [3] }
    ],
    caseCabinets: [],
  },
  direct1_direct2_direct3_right1_right2_right3: {
    leftLevel: [
     

    ],
    rightLevel: [
    
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_l3", params: [2] },
      { funk: "build_right_short_l2", params: [3] },

    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      { funk: "build_direct_l3", params: [3] }
    ],
    caseCabinets: [],
  },
  direct1_left1_right1: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
    ],
    direct: [{ funk: "build_direct_l1", params: [3] }],
    caseCabinets: [],
  },
  direct1_direct_2_left1_right1: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] }
    ],
    caseCabinets: [],
  },
  direct1_direct_2_left1_left2_right1: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_short_l2", params: [2] },


    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] }
    ],
    caseCabinets: [],
  },
  direct1_direct_2_left1_right1_right2: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
  


    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_short_l2", params: [2] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] }
    ],
    caseCabinets: [],
  },
  direct1_left1_left2_right1_right2: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_long_l2", params: [2] },

  


    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_long_l2", params: [2] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
    
    ],
    caseCabinets: [],
  },
  direct1_direct2_left1_left2_right1_right2: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_short_l2", params: [2] },

  


    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_short_l2", params: [2] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },

    
    ],
    caseCabinets: [],
  },
  direct1_direct2_direct3_left1_right1: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },    
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      { funk: "build_direct_l3", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_direct2_direct3_left1_left2_left3: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_l3", params: [2] },
      { funk: "build_left_short_l2", params: [2] },
     
    ],
    rightLevel: [
       
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      { funk: "build_direct_l3", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_direct2_direct3_right1_right2_right3: {
    leftLevel: [
  
    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_l3", params: [2] },
      { funk: "build_right_short_l2", params: [2] },
   //   { funk: "build_right_short_l3", params: [2] },
       
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      { funk: "build_direct_l3", params: [3] },
    ],
    caseCabinets: [],
  },
  direct1_left1_left2_left3_right1_right2_right3: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_l3", params: [2] },
      { funk: "build_left_long_l2", params: [2] },
      { funk: "build_left_long_l3", params: [2] },

    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_l3", params: [2] },
      { funk: "build_right_long_l2", params: [2] },
      { funk: "build_right_long_l3", params: [2] },

  
       
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },

    ],
    caseCabinets: [],
  },
  direct1_direct2_direct3_left1_left2_left3_right1_right2_right3: {
    leftLevel: [
      { funk: "build_left_l1", params: [2] },
      { funk: "build_left_l2", params: [2] },
      { funk: "build_left_l3", params: [2] },
      { funk: "build_left_short_l2", params: [2] },
    ],
    rightLevel: [
      { funk: "build_right_l1", params: [2] },
      { funk: "build_right_l2", params: [2] },
      { funk: "build_right_l3", params: [2] },
      { funk: "build_right_short_l2", params: [2] },
    ],
    direct: [
      { funk: "build_direct_l1", params: [3] },
      { funk: "build_direct_l2", params: [3] },
      { funk: "build_direct_l3", params: [3] },
    ],
    caseCabinets: [],
  },
};





// watch(
//   () => config.kitchen_size.side_c,
//   (new3) => {
//     // console.log("Новая ширина:", new3);
//     // updateConfigParams(config3, 3, new3);
//     // 3 = new3; // Обновляем только после вызова функции
//     // console.log("Обновленный config3:", config3);

//     changeC(new3)
//   }
// );



// watch(
//   () => config.kitchen_size.2,
//   (newSideC) => {
//     let newC = newSideC - 0.55
//     updateConfigParams(config3, 2, newC );
//     2 = newC  ;
//     config2.2 = newC
//     console.log('config3', config3)
  
//   }
// );

// watch(
//   () => config.kitchen_size.2,
//   (newSideD) => {
//     let newD = newSideD - 0.55
//     updateConfigParams(config3, 2, newD);
//     2 = newD;
//     console.log('config3' , config3)
//     config2.2 = newD

//   }
// );




export default config3;


