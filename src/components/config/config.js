
import { reactive } from "vue";

const config = reactive({
  room: {
    width: 30,
    height: 3,
    depth: 30,
  },

  //тип кухни
  type: "direct",

  //шаг меню
  step: 4,
  offset: 0,

  //количество пеналов с каждой стороны
  // penal_left: 0,
  // penal_right: 0,
  // penal_direct_left: 0,
  // penal_direct_right: 0,

  //сдвиг прямых рядов при установк пенала
  LeftOffsetKitchenDirect: 0,

  //размеры до изменений
  kitchen_size: {
    width: 4,
    height: 2.118,
    height2level: 0,
    height3level: 0,
    side_c: 2.75,
    side_c_row:2.2,
    side_c_with_penal:0,
    side_d: 2.75,
    side_d_row: 2.2,
    width_row:4,
    offsetForSides: 0.55,
  },

//текущие размеры
  kitchen_size_currect:{
    width: 4,
    width_row:4,
    side_c: 2.75,
    side_c_row:2.2,
    side_d: 2.75,
    side_d_row: 2.2,
  },

  //сдвиг левых рядов вправо при добавление пеналов
  row_offsets:{
    offsetDirectLeft:0
  },

  //высота 2 и 3 ряда
  panels_size: {
    height2level: 0.7,
    height3level: 0.35,
  },

  //3й уровень есть/нет
  level3: false,

  kitchen_levels: 2,


  //сдвиг при добавлении пеналов
  offset_for_rows:{
    offsetDirectLeft:0,
    offsetDirectRight:0,
    offsetLeft:0,
    offsetRight:0
  },

  //счетчики колич пеналов по сторонам
  countLeft: 0,
  countMaxLeft: 0,
  countDirectRight: 0,
  countMaxDirectRight: 0,

  countRight: 0,
  countMaxRight: 0,

  countDirectLeft: 0,
  countMaxDirectLeft: 0,

  //установлена раковина
  setSink: false,


  //линии размеров кухни
  lines:[],


  new_sizes:{
    side_c:0
  }
});

export default config;
