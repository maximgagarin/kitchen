import { useRowSegmentsStore } from "../../../pinia/RowSegments";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { useRaycasterPanelsStore } from "../../../pinia/raycasterPanels";
import * as THREE from "three";

export class SetStove {
  constructor(scene, loaderModels, cabinetBuilder, setTech) {
    this.scene = scene.scene;
    this.rowSegmentsStore = useRowSegmentsStore();
    this.loaderModels = loaderModels;
    this.setTech = setTech;
    this.cabinetBuilder = cabinetBuilder;
    this.KitchenSizes = useKitchenSizesStore();
    this.raycasterStore = useRaycasterPanelsStore();
    this.camera= scene.camera
    this.gaps = [];

  }

  createPlanesForRaycaster() {
    const transparentMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
         transparent: true,
         opacity: 0,
      });
  
      const directPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(
          this.KitchenSizes.rowSizesCurrect.side_a - 0.4,
          1
        ),
        transparentMaterial
      );
      directPlane.name = "directPlane";
  
      const leftPlane = new THREE.Mesh(
        new THREE.PlaneGeometry( 1, this.KitchenSizes.rowSizesCurrect.side_c),
        transparentMaterial
      );
      leftPlane.name = "leftPlane";
  
      const rightPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, this.KitchenSizes.rowSizesCurrect.side_c),
        transparentMaterial
      );
      rightPlane.name = "rightPlane";
  
      directPlane.position.set(this.raycasterStore.position.directX, 0.85, 0.5);
      leftPlane.position.set(0.2, 0.4, this.raycasterStore.position.leftZ +0.2);
      rightPlane.position.set(this.KitchenSizes.rowSizes.side_a, 0.4, this.raycasterStore.position.RightZ + 0.2 );
  
      //directPlane.rotation.x = Math.PI / 2;
      leftPlane.rotation.y = Math.PI / 2;
      rightPlane.rotation.y = Math.PI / 2;
  
      leftPlane.rotation.z = Math.PI / 2;
      rightPlane.rotation.z = Math.PI / 2;
  
      const planesMap = {
        direct: [directPlane],
        left: [leftPlane, directPlane],
        uShaped: [leftPlane, directPlane, rightPlane],
      };
      const activePlanes = planesMap[this.KitchenSizes.type] || [];
      activePlanes.forEach((plane) => this.scene.add(plane));
      const planes = activePlanes;
  
      return { directPlane, leftPlane, rightPlane, planes };
  }

  createRaycaster(event) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    return raycaster;
  }

  setStove() {
    this.rowSegmentsStore.removeSegmentType('stove')
    this.rowSegmentsStore.removeSegmentTypes(['build_direct_l1', 'build_left_l1', 'build_right_l1']);
    this.KitchenSizes.delete_1level = false; // отключаем удаление рядов
    this.KitchenSizes.delete_leftLevel = false; // отключаем удаление рядов
    this.KitchenSizes.delete_rightLevel = false; // отключаем удаление рядов
    console.log("setStove");


    let stoveType = this.KitchenSizes.stoveType
    console.log('typeeee', stoveType)

    const stove = this.loaderModels.get(stoveType);
    stove.name = 'stove'
   
    this.scene.add(stove);

    console.log(this.scene);

    const { directPlane, leftPlane, rightPlane, planes } =      this.createPlanesForRaycaster();

  
  

    let posZ, posX, point, rotation, text, side

    const onMouseMove = (event) => {
        stove.visible = true;

      const raycaster = this.createRaycaster(event);

      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        point = intersects[0].point;
        //console.log(point);
        if (intersects[0].object === directPlane) {
          rotation = 0
          side = 'direct'
          posZ = 0.3;
          posX = point.x;
        } else if (intersects[0].object === leftPlane) {
          side = 'left'
          rotation = Math.PI/2
          posZ = point.z;
          posX = 0.3;
          text = posZ;
        } else if (intersects[0].object === rightPlane) {
          side = 'right'
          rotation = -Math.PI/2
          posZ = point.z;
          posX = this.KitchenSizes.sideSizes.side_a - 0.3;
        }
        stove.position.set(posX, 0, posZ);
        stove.rotation.y = rotation

      }

      //console.log(posX);
    };

    let stoveWidth = 0.6

   

    const onMouseDown = (event) => {
      const raycaster = this.createRaycaster(event);
      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        stove.position.set(posX, 0, posZ);

        let start = Number ((posX - 0.3).toFixed(3))
        let end = Number(( posX+0.3).toFixed(3))
        this.rowSegmentsStore.removeSegmentTypes(['build_direct_l1', 'build_left_l1', 'build_right_l1']);

        

        const rule = {
          start: side === 'direct' ? posX - stoveWidth / 2 : posZ - stoveWidth / 2,
          end:   side === 'direct' ? posX + stoveWidth / 2 : posZ + stoveWidth / 2,
          width: stoveWidth,
          type: 'stove'
        };
        this.rowSegmentsStore.addSegment(side, rule);


       


        this.build_rows()
        this.cabinetBuilder.buildLowerRows()

      //  this.cabinetBuilder.buildLowerRows();

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mousedown", onMouseDown);
      }
    };

    // Добавляем слушатели

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
  }


  build_rows() {
    const {side_a: directSideSize, side_c: leftSideSize, side_d: rightSideSize, } = this.KitchenSizes.sideSizes;
    const sideSizes = {direct: directSideSize, left: leftSideSize, right: rightSideSize, };

    let offset = 0.56;
    let segments = this.rowSegmentsStore.segments;

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
      this.gaps.push({
        start: offsetStart,
        end: size - offsetStart,
        width: size - offsetStart,
        type,
      });
    };

    const type = this.KitchenSizes.type;
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
        this.gaps.push({
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
          this.gaps.push({
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
        this.gaps.push({
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

    this.gaps.forEach((element) => {
      const type = types[element.type];
      this.rowSegmentsStore.segments[type].push(element);
    });

    console.log("Пустые промежутки:", this.gaps);

  }
}
