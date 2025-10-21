import { defineStore } from "pinia";
import { ref } from "vue";

export const useRowSegmentsStore = defineStore("rowSegments", () => {
  const segments = ref({
    direct: [],
    left: [],
    right: [],
  });


  //холодильник

  const fridge = ref({
    isSet:false,
    side:'',
    leftOffset:0,
    rightOffset:0,
    intoDimensions:true,
  })

  //координаты вывода хвс, гвс и канализации
  const duct = ref({
    isSet:false,
    side:'direct',
    size:20,
    start:0,
    end:0,
    x:0,
    y:0,
    z:0,
    l1:0,
    l2:0,
    l3:0,
  })

  const hasCornerSink = ref({
    direct: false,
    left: false,
    right: false,
  });

  function setSegments(side, newSegments) {
    segments.value[side] = newSegments;
  }

  function addSegment(side, segment) {
    segments.value[side].push(segment);
  }

  function removeSegment(id) {
    // Проходим по всем сторонам и фильтруем сегменты
    Object.keys(segments.value).forEach((side) => {
      segments.value[side] = segments.value[side].filter((s) => s.id !== id);
    });
  }

  function removeSegmentTypes(types) {
    const typesToRemove = Array.isArray(types) ? types : [types];
  
    Object.keys(segments.value).forEach((side) => {
      segments.value[side] = segments.value[side].filter((s) => !typesToRemove.includes(s.type));
    });
  }

  function removeSegmentType(type) {
    // Проходим по всем сторонам и фильтруем сегменты
    Object.keys(segments.value).forEach((side) => {
      segments.value[side] = segments.value[side].filter((s) => s.type !== type);
    });
  }



  function clearSegments(side) {
    segments.value[side] = [];
  }

  function getSegments(side) {
    return segments.value[side];
  }

  return {
    segments,
    setSegments,
    addSegment,
    removeSegment,
    clearSegments,
    getSegments,
    hasCornerSink,
    removeSegmentType,
    removeSegmentTypes,
    duct
  };
});
