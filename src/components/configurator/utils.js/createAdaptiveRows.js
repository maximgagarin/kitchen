import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { useRowSegmentsStore } from "../../../pinia/RowSegments";


const KitchenSizes = useKitchenSizesStore()
const rowSegmentsStore = useRowSegmentsStore()
let gaps = []


export function createAdaptiveRows() {
    const {side_a: directSideSize,  side_c: leftSideSize,  side_d: rightSideSize, } = KitchenSizes.sideSizes;
    const sideSizes = {direct: directSideSize, left: leftSideSize, right: rightSideSize,};

    let offset = 0.56;
    let segments = rowSegmentsStore.segments;

    for (const key in segments) {
      // Сортируем текущий массив
      segments[key].sort((a, b) => a.start - b.start);
      // Выводим имя текущего массива (key)
      console.log("Текущий массив:", key); // 'direct', 'left' или 'right'
    }

    console.log("segments", segments);

    //если нет елементов в ряду то строим целый ряд по правилам
    const gapConfig = {
      left: [
        {
          side: "direct",
          type: "build_direct_l1",
          offsetStart: 0,
          condition: () => segments.direct.length === 0,
        },
        {
          side: "left",
          type: "build_left_l1",
          offsetStart: offset,
          condition: () => segments.left.length === 0,
        },
      ],
      uShaped: [
        {
          side: "left",
          type: "build_left_l1",
          offsetStart: offset,
          condition: () => segments.left.length === 0,
        },
        {
          side: "right",
          type: "build_right_l1",
          offsetStart: offset,
          condition: () => segments.right.length === 0,
        },
        {
          side: "direct",
          type: "build_direct_l1",
          offsetStart: 0,
          condition: () => segments.direct.length === 0,
        },
      ],
    };

    //функция добавляентия ряда
    const addGap = (side, type, offsetStart = 0) => {
      const size = sideSizes[side];
      gaps.push({
        start: offsetStart,
        end: size - offsetStart,
        width: size - offsetStart,
        type,
      });
    };

    const type = KitchenSizes.type;
    const rules = gapConfig[type];

    //перебор правил
    if (rules) {
      rules.forEach(({ side, type, offsetStart, condition }) => {
        if (condition()) {
          addGap(side, type, offsetStart);
        }
      });
    }

    for (const side in segments) {
      if (!segments[side] || segments[side].length === 0) continue;
      // Сортируем сегменты по старту
      segments[side].sort((a, b) => a.start - b.start);
      const firstSegment = segments[side][0];
      const sideSize = sideSizes[side];

      const startOffset = side === "direct" ? 0 : offset;

      // Промежуток от начала ряда до первого сегмента
      if (firstSegment.start - startOffset > 0.01) {
        gaps.push({
          start: startOffset,
          end: firstSegment.start,
          width: firstSegment.start - startOffset,
          type: `build_${side}_l1`,
          id: `gap_start_${side}`,
        });
      }

      // Промежутки между сегментами
      for (let i = 0; i < segments[side].length - 1; i++) {
        const currentEnd = segments[side][i].end;
        const nextStart = segments[side][i + 1].start;

        if (nextStart - currentEnd > 0.01) {
          gaps.push({
            start: currentEnd,
            end: nextStart,
            width: nextStart - currentEnd,
            type: `build_${side}_l1`,
            id: `gap_${side}_${currentEnd}_${nextStart}`,
          });
        }
      }

      // Промежуток после последнего сегмента до конца ряда
      const lastSegment = segments[side][segments[side].length - 1];
      if (sideSize - lastSegment.end > 0.01) {
        gaps.push({
          start: lastSegment.end,
          end: sideSize,
          width: sideSize - lastSegment.end,
          type: `build_${side}_l1`,
          id: `gap_end_${side}_${lastSegment.end}`,
        });
      }
    }



    const types = {
      build_direct_l1: "direct",
      build_left_l1: "left",
      build_right_l1: "right",
    };

    gaps.forEach((element) => {
      const type = types[element.type];
      rowSegmentsStore.segments[type].push(element);
    });

    console.log("Пустые промежутки:", gaps);
  }