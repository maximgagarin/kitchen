import * as THREE from "three";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { useRaycasterPanelsStore } from "../../../pinia/raycasterPanels";
import { blackMaterial, BoxForSinkMaterial, whiteMaterial } from "../materials";
import { usePenalStore } from "../../../pinia/penals";
import { useRowSegmentsStore } from "../../../pinia/RowSegments";
import { makeHole } from "../utils.js/makeHole";
import { gsap } from "gsap";

import { DimensionLine } from "../builders/DimensionLine";
import { plannerConfig } from "../planner/planerConfig";
import { algorithmConfig } from "../builders/Algorithm/algorithmConfig";

import { Service } from "../Service/Service";

export class SetTech {
  constructor(scene, tableTopBuilder, loaderModels, cabinetBuilder) {
    this.sceneSetup = scene;
    this.scene = scene.scene;
    this.objects = []; // Массив для хранения объектов комнаты
    this.camera = scene.camera;
    this.controls = scene.controls;
    this.KitchenSizes = useKitchenSizesStore();
    this.tableTopBuilder = tableTopBuilder;
    this.cabinetBuilder = cabinetBuilder;
    this.loaderModels = loaderModels;
    this.axis = new THREE.AxesHelper(5);
    this.raycasterStore = useRaycasterPanelsStore();
    this.penalStore = usePenalStore();
    this.rowSegmentsStore = useRowSegmentsStore();
    this.gaps = [];
    this.lowerRows = [];
    this.findLowerRows();
    this.abortController = null;
    this.currentDimensionLine = null;
    this.currentDimensionLine1 = null;
    this.currentDimensionLine2 = null;
    this.service = new Service()
  }

  cleanupEventListeners() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  getSinkModule(type) {
    let tabletop;
 //   console.log("type", type);
    const sinkModule = this.loaderModels.get(type);

    sinkModule.name = "sinkModel";

    this.scene.add(sinkModule);
 //   console.log("sinkModel", sinkModule);

    sinkModule.traverse((child) => {
      if (child.isMesh && child.name === "tabletop") {
        tabletop = child;
      }
    });
    let tabletopFull = sinkModule.getObjectByName("tabletopfull");
    let BoxForHole = sinkModule.getObjectByName("BoxForHole");


    if (tabletopFull) tabletopFull.visible = false;
    if (BoxForHole) BoxForHole.visible = false;


   // console.log("tabletop", tabletop);
    return { sinkModule, tabletop };
  }

  getSink() {
    const SinkNormal = this.loaderModels.get("sink-dsv2");
    let BoxForDelete;
    SinkNormal.name = "SinkNormal";
    // SinkNormal.add(new THREE.AxesHelper(5));
    this.scene.add(SinkNormal);

    SinkNormal.traverse((child) => {
      if (child.isMesh && child.name === "Cube") {
        BoxForDelete = child;
      }
    });

  //  console.log("SinkNormal", SinkNormal);

    BoxForDelete.material.opacity = 0;
    BoxForDelete.material.transparent = true;
    return { SinkNormal, BoxForDelete };
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
      new THREE.PlaneGeometry(this.KitchenSizes.rowSizesCurrect.side_c, 1),
      transparentMaterial
    );
    leftPlane.name = "leftPlane";

    const rightPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(this.KitchenSizes.rowSizesCurrect.side_d, 1),
      transparentMaterial
    );
    rightPlane.name = "rightPlane";

    directPlane.position.set(this.raycasterStore.position.directX, 0.85, 0.5);
    leftPlane.position.set(0.2, 0.855, this.raycasterStore.position.leftZ);
    rightPlane.position.set(
      this.KitchenSizes.rowSizes.side_a,
      0.855,
      this.raycasterStore.position.RightZ
    );

    directPlane.rotation.x = Math.PI / 2;
    leftPlane.rotation.x = Math.PI / 2;
    rightPlane.rotation.x = Math.PI / 2;

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

  createPlanesForCustom() {
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
      new THREE.PlaneGeometry(1, this.KitchenSizes.rowSizesCurrect.side_c),
      transparentMaterial
    );
    leftPlane.name = "leftPlane";

    const rightPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, this.KitchenSizes.rowSizesCurrect.side_c),
      transparentMaterial
    );
    rightPlane.name = "rightPlane";

    directPlane.position.set(this.raycasterStore.position.directX, 0.85, 0.3);
    leftPlane.position.set(0.2, 0.4, this.raycasterStore.position.leftZ - 0.2);
    rightPlane.position.set(
      this.KitchenSizes.rowSizes.side_a,
      0.4,
      this.raycasterStore.position.RightZ + 0.2
    );

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

  // добавлений позиции раковины и модуля в хранилище
  addToStore(data, topCenter) {
    const SinkModuleWidth = Number(topCenter.userData.width.toFixed(3));
    const SinkModuleCenterX = Number(data.posX.toFixed(3));
    const SinkModuleCenterZ = Number(data.posZ.toFixed(3));
    const sinkStartX = Number(
      (SinkModuleCenterX - SinkModuleWidth / 2).toFixed(3)
    );
    const sinkEndX = Number(
      (SinkModuleCenterX + SinkModuleWidth / 2).toFixed(3)
    );
    const sinkStartZ = Number(
      (SinkModuleCenterZ - SinkModuleWidth / 2).toFixed(3)
    );
    const sinkEndZ = Number(
      (SinkModuleCenterZ + SinkModuleWidth / 2).toFixed(3)
    );


   // console.log('width', SinkModuleWidth)

    this.KitchenSizes.sink.size = SinkModuleWidth
    this.KitchenSizes.sink.side = data.side


 //   console.log('sink', this.KitchenSizes.sink)

    

    if (data.side === "direct") {
    //  console.log('1')
      this.rowSegmentsStore.addSegment("direct", {
        start: sinkStartX,
        end: sinkEndX,
        width: SinkModuleWidth,
        type: "sink",
      });

      //  this.rowSegmentsStore.addSegment("left", {start:0.56, end:2.76, width:2.2, type:'build_left_l1'})
    } else if (data.side === "left") {
    //  console.log('2')

      this.rowSegmentsStore.addSegment("left", {
        start: sinkStartZ,
        end: sinkEndZ,
        width: SinkModuleWidth,
        type: "sink",
      });

      //если модуль в углу слева то для стороны direct добавляем раковину
      if (data.module === "module-sink-1000-left1") {
    //  console.log('3')

        this.rowSegmentsStore.addSegment("direct", {
          start: 0,
          end: 0.6,
          width: 0.6,
          type: "sink",
        });
      }
    } else if (data.side === "right") {
    //  console.log('4')

      this.rowSegmentsStore.addSegment("right", {
        start: sinkStartZ,
        end: sinkEndZ,
        width: SinkModuleWidth,
        type: "sink",
      });

      //если модуль в углу справа то для стороны direct добавляем раковину
      if (data.module === "module-sink-1000") {
    //  console.log('1')

        this.rowSegmentsStore.addSegment("direct", {
          start: SinkModuleCenterX - 0.3,
          end: SinkModuleCenterX + 0.3,
          width: 0.6,
          type: "sink",
        });
      }
    }
  }

  build_rows() {
    const {
      side_a: directSideSize,
      side_c: leftSideSize,
      side_d: rightSideSize,
    } = this.KitchenSizes.sideSizes;
    
    const sideSizes = {
      direct: directSideSize,
      left: leftSideSize,
      right: rightSideSize,
    };

    let offset = 0.6;
    let offsetDirect = 0
    if(this.KitchenSizes.sink.side == 'left' && this.KitchenSizes.sink.size == 1){
      offsetDirect = 0.6
    } 
    let segments = this.rowSegmentsStore.segments;

    for (const key in segments) {
      // Сортируем текущий массив
      segments[key].sort((a, b) => a.start - b.start);
      // Выводим имя текущего массива (key)
   //   console.log("Текущий массив:", key); // 'direct', 'left' или 'right'
    }

 //   console.log("segments", segments);

    //если нет елементов в ряду то строим целый ряд по правилам
    const gapConfig = {
      left: [
        {
          side: "direct",
          type: "build_direct_l1",
          offsetStart: offsetDirect,
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

      const startOffset = side === "direct" ? offsetDirect : offset;

    //  console.log('startOffset', startOffset)

      // Промежуток от начала ряда до первого сегмента
      if (firstSegment.start - startOffset > 0.02) {
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
            start:currentEnd,
            end: nextStart,
            width: nextStart - currentEnd,
            type: `build_${side}_l1`,
            id: `gap_${side}_${currentEnd}_${nextStart}`,
          });
        }
      }

      // Промежуток после последнего сегмента до конца ряда
      const lastSegment = segments[side][segments[side].length - 1];
      if (sideSize - lastSegment.end > 0.02) {
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

  //  console.log("Пустые промежутки:", this.gaps);

    //перестраиваем нижние ряды
    this.cabinetBuilder.buildLowerRows(this.gaps);
  }

  setResultMeshProperties(tabletop, resultMesh) {
    const worldPos = new THREE.Vector3();
    tabletop.getWorldPosition(worldPos);
    resultMesh.position.copy(worldPos);

    resultMesh.material = new THREE.MeshStandardMaterial({
      color: "red",
    });

    //  resultMesh.position.copy(tabletop.position); // исправлено

    resultMesh.name = "resultMesh";

    return resultMesh;
  }

  currectSizes(){

    // корректировка т. к. нет правил для 0.25
      const parts = algorithmConfig.parts_sizes2
      if(parts.directPart1 === 0.25) {
          parts.directPart1 += 0.05
          parts.directPart2 -= 0.05
        }

      if(parts.directPart2 === 0.25) {
          parts.directPart1 -= 0.05
          parts.directPart2 += 0.05
        }

  }

  getSinkModulePosition(pointX, pointZ) {
    //сторона установки
    const side = this.KitchenSizes.raycaster_for_sink.side;
    const kitchenType = this.KitchenSizes.type;
    const KitchenSizes = this.KitchenSizes.sideSizes;
    const penalOffsets = this.penalStore.penalOffsetsState
    const kitchenStore = this.KitchenSizes
    const sinkSize = 0.6
    const SINK_1000 = 1
    const MSU = 1
    const ROW_WIDTH = 0.6

    let module = "ms600";
    let posX = pointX;
    let posZ = pointZ;
    let x =  Math.round(pointX * 20) / 20;
    let z =  Math.round(pointZ * 20) / 20;



    const isNearCornerZ = pointZ <= 0.75; // угловая левая
    const isNearCornerXLeft = pointX <= 0.75; // угловая прямая
    const isNearLeftRow = pointX > 0.75 && pointX < 1.05 // рядом с левым рядом
    const isNearDirectRow = pointZ > 0.75 && pointZ < 1.05 // рядом с прямым рядом
    const isNearCornerXRight = pointX > KitchenSizes.side_a - 0.7;
    const isNearCornerXdirectRight = pointX > KitchenSizes.side_a - 0.45 - penalOffsets.directRight // правый край прямо
    const isNearCornerZleft = pointZ > KitchenSizes.side_c - 0.45 - penalOffsets.left // слева край

     kitchenStore.parts.length = 0
     algorithmConfig.resultDirect.length = 0
     algorithmConfig.resultLeft.length = 0
     algorithmConfig.resultRight.length = 0
     algorithmConfig.rowStart.direct = 0
     algorithmConfig.rowStart.left = 0
     algorithmConfig.rowStart.right = 0

    const setSize = (part, value) => {
        algorithmConfig.parts_sizes2[part] = Number(value.toFixed(2))
      }


    if (kitchenType === "direct") {

     

      algorithmConfig.parts_sizes2.directPart1 = 0
      algorithmConfig.parts_sizes2.directPart2 = 0
      

      if( pointX < (0.45 + penalOffsets.directLeft)){
        console.log('1')
        posX =  (sinkSize/2 + penalOffsets.directLeft)

        const size = Number((KitchenSizes.side_a - penalOffsets.directRight - penalOffsets.directLeft - sinkSize).toFixed(2))

        algorithmConfig.direct2parts = false
        setSize('directPart1', size)
        algorithmConfig.rowStart.direct += penalOffsets.directLeft

        kitchenStore.parts.push({  name: "A1", width: size})


      } else if(pointX > (KitchenSizes.side_a - 0.45 - penalOffsets.directRight)  ){
        console.log('2')
        posX = KitchenSizes.side_a - sinkSize/2 - penalOffsets.directRight
        algorithmConfig.direct2parts = false

        const size = KitchenSizes.side_a - penalOffsets.directRight - penalOffsets.directLeft - sinkSize
        setSize('directPart1', size )
        algorithmConfig.rowStart.direct += penalOffsets.directLeft

        kitchenStore.parts.push({  name: "A1", width: size})
        kitchenStore.sink.location = "end"



      } else {
        console.log('3')
        algorithmConfig.direct2parts = true


       const size1 = Number(((x - sinkSize/2) - penalOffsets.directLeft).toFixed(2));
       const size2 = Number((KitchenSizes.side_a - penalOffsets.directRight  - (x + sinkSize/2)).toFixed(2))


        setSize('directPart1', size1 )
        setSize('directPart2', size2)
     
        algorithmConfig.rowStart.direct += penalOffsets.directLeft

         kitchenStore.parts.push({  name: "A1", width: size1})
         kitchenStore.parts.push({  name: "A2", width: size2})

      }

       this.currectSizes()


     
      return {
        module,
        posX,
        posZ,
        side,
      };
    }

    if (kitchenType === "left") {

      if (isNearCornerXLeft && side === "direct") {
        module = "module-sink-1000";
        posX = 0.5;
        console.log('1')

        algorithmConfig.resultDirect.push({key:'module-sink-1000', value:1})
        kitchenStore.sink.location = 'directCorner'

        kitchenStore.sink.size = 1

        

        algorithmConfig.rowStart.left += ROW_WIDTH
        
        const size1 = Number((KitchenSizes.side_c - penalOffsets.left - ROW_WIDTH).toFixed(2)) 
        const size2 = Number((KitchenSizes.side_a - penalOffsets.directRight - SINK_1000).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "A1", width: size2})

      }
      else if(isNearCornerXdirectRight){
        posX = KitchenSizes.side_a - sinkSize/2  - penalOffsets.directRight
        console.log('2')

          algorithmConfig.rowStart.direct += ROW_WIDTH
          algorithmConfig.resultLeft.push({key:'b1000left', value:1}) // вставляем су1000
          kitchenStore.su.side = 'left'
         algorithmConfig.resultDirect.push({key:'m', value:sinkSize})


        const size1 = Number((KitchenSizes.side_c - penalOffsets.left - MSU).toFixed(2)) 
        const size2 = Number((KitchenSizes.side_a -  sinkSize - ROW_WIDTH).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "A1", width: size2})

        kitchenStore.sink.location = 'directEnd'


      }
      else if(isNearLeftRow){
        posX = 0.9
        console.log('3')

        algorithmConfig.rowStart.direct += ROW_WIDTH
        algorithmConfig.resultLeft.push({key:'b1000left', value:1}) // вставляем мойку
        algorithmConfig.resultDirect.push({key:'m', value:sinkSize})
           kitchenStore.su.side = 'left'

        const size1 = Number((KitchenSizes.side_c - penalOffsets.left - MSU).toFixed(2)) 
        const size2 = Number((KitchenSizes.side_a - penalOffsets.directRight - ROW_WIDTH - sinkSize).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "A1", width: size2})

        kitchenStore.sink.location = 'directStart'
      }

      else if(isNearDirectRow){
        posZ = 0.9
        console.log('4')

        algorithmConfig.rowStart.left += ROW_WIDTH
        algorithmConfig.resultDirect.push({key:'b1000', value:1}) // вставляем мойку
        algorithmConfig.resultLeft.push({key:'m', value:sinkSize})
           kitchenStore.su.side = 'direct'


        const size1 = Number((KitchenSizes.side_c - penalOffsets.left - ROW_WIDTH - sinkSize).toFixed(2)) 
        const size2 = Number((KitchenSizes.side_a - penalOffsets.directRight - MSU).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "A1", width: size2})

         kitchenStore.sink.location = 'leftStart'
      }

      else if(isNearCornerZleft){
        posZ = KitchenSizes.side_c - sinkSize/2  - penalOffsets.left
        console.log('5')

        
        algorithmConfig.rowStart.left += ROW_WIDTH
        algorithmConfig.resultDirect.push({key:'b1000left', value:1}) // вставляем мойку
        kitchenStore.su.side = 'direct'


        const size1 = Number((KitchenSizes.side_c - ROW_WIDTH - sinkSize).toFixed(2)) 
        const size2 = Number((KitchenSizes.side_a -  MSU - penalOffsets.directRight).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "A1", width: size2})

        kitchenStore.sink.location = 'leftEnd'


      }
      else if (isNearCornerZ && side === "left") {
        console.log('6')

        module = "module-sink-1000-left";
        kitchenStore.sink.location = 'leftCorner'

        posZ = 0.5;

        kitchenStore.sink.size = 1

        algorithmConfig.rowStart.direct += ROW_WIDTH

        algorithmConfig.resultLeft.push({key:'module-sink-1000-left', value:1})


        const size1 = Number((KitchenSizes.side_c - penalOffsets.left - SINK_1000).toFixed(2)) 
        const size2 = Number((KitchenSizes.side_a - penalOffsets.directRight - ROW_WIDTH).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "A1", width: size2})

      } else if(side === "left") {
        console.log('7')

        algorithmConfig.left2parts = true

        kitchenStore.sink.location = 'leftMiddle'


        
        algorithmConfig.rowStart.left += ROW_WIDTH
        algorithmConfig.resultDirect.push({key:'b1000', value:1}) // вставляем су
           kitchenStore.su.side = 'direct'

        const size1 = Number((KitchenSizes.side_c - penalOffsets.left - (z + sinkSize/2)).toFixed(2)) 
        const size2 = Number(( (z - sinkSize/2) -  ROW_WIDTH).toFixed(2)) 
        const size3 = Number((KitchenSizes.side_a - penalOffsets.directRight - MSU).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "C2", width: size2})
        kitchenStore.parts.push({  name: "A1", width: size3})
 
      } else if(side === 'direct'){
        console.log('8')

        algorithmConfig.direct2parts = true
        kitchenStore.sink.location = 'directMiddle'


          algorithmConfig.rowStart.direct += ROW_WIDTH
          algorithmConfig.resultLeft.push({key:'b1000left', value:1}) // вставляем су
            kitchenStore.su.side = 'left'
    
        const size1 = Number((KitchenSizes.side_c - penalOffsets.left - MSU).toFixed(2)) 
        const size2 = Number(( (x - sinkSize/2) -  ROW_WIDTH).toFixed(2)) 
        const size3 = Number((KitchenSizes.side_a - penalOffsets.directRight - (x + sinkSize/2)).toFixed(2)) 

        kitchenStore.parts.push({  name: "C1", width: size1})
        kitchenStore.parts.push({  name: "A1", width: size2})
        kitchenStore.parts.push({  name: "A2", width: size3})
      }

      return {
        module,
        posX,
        posZ,
        side,
      };
    }
    if (kitchenType === "uShaped") {
      if (isNearCornerXLeft && side === "direct") {
        module = "module-sink-1000";
        posX = 0.5;
      }
      if (isNearCornerZ && side === "right") {
        module = "module-sink-1000";
        posZ = 0.5;
      }
      if (isNearCornerZ && side === "left") {
        module = "module-sink-1000-left";
        posZ = 0.5;
      }
      if (isNearCornerXRight && side === "direct") {
        module = "module-sink-1000-left";
        posX = KitchenSizes.side_a - 0.5;
      }
      return {
        module,
        posX,
        posZ,
        side,
      };
    }
    return null;
  }

  start() {
    this.KitchenSizes.isSink = false
    this.KitchenSizes.delete_1level = false; // отключаем удаление рядов
    this.KitchenSizes.delete_leftLevel = false; // отключаем удаление рядов
    this.KitchenSizes.delete_rightLevel = false; // отключаем удаление рядов

    //  this.camera.position.set(4, 5, 6);
    //  let targetPosition = new THREE.Vector3(2, 0, 0);
    //  this.camera.lookAt(targetPosition);
    //  this.controls.target.copy(targetPosition);

    // if (this.KitchenSizes.type == "left") {
    //   this.sceneSetup.moveCameraTo(
    //     new THREE.Vector3(3.5, 4.3, 5.1),
    //     new THREE.Vector3(1.9, 0, 0),
    //     1.5,
    //     () => {
    //       // После первой анимации запускаем вторую
    //       // cabinetBuilder.value.sceneSetup.moveCameraTo(
    //       //   new THREE.Vector3(3, 2, 6),
    //       //   new THREE.Vector3(2, 1, 0),
    //       //   3
    //       // );
    //     }
    //   );
    // }
    // if (this.KitchenSizes.type == "direct") {
    //   this.sceneSetup.moveCameraTo(
    //     new THREE.Vector3(2, 5.3, 5.1),
    //     new THREE.Vector3(2.5, 0, 0),
    //     1.5,
    //     () => {
    //       // После первой анимации запускаем вторую
    //       // cabinetBuilder.value.sceneSetup.moveCameraTo(
    //       //   new THREE.Vector3(3, 2, 6),
    //       //   new THREE.Vector3(2, 1, 0),
    //       //   3
    //       // );
    //     }
    //   );
    // }
  }

  deleteAfterSetSink() {
    const namesToRemove = ["rightPlane", "leftPlane", "directPlane"];
    this.scene.children
      .filter((obj) => namesToRemove.includes(obj.name))
      .forEach((obj) => {
        this.scene.remove(obj);
        obj.geometry?.dispose();
        obj.material?.dispose();
      });
  }

  deleteSink() {
    const namesToRemove = [
      "SinkNormal",
      "BoxForDelete",
      "sinkModel",
      "resultMesh",
      "duct",
    ];
    this.scene.children
      .filter((obj) => namesToRemove.includes(obj.name))
      .forEach((obj) => {
        this.scene.remove(obj);
        obj.geometry?.dispose();
        obj.material?.dispose();
      });
  }

  calcParts(){
   

    const parts = this.KitchenSizes.parts
    console.log('parts', parts)
    const result =  this.service.analyzeAllCombinations(parts)
    console.log('result', result)

    this.KitchenSizes.rules = result

    
    this.currect2(result)


    const available = this.collectAvailableSizes(result);
    console.log("✅ Доступные размеры:", available);

    


    //если не помещяется духовка то не поместится посудомойа
    this.KitchenSizes.availableOven = available.oven
    if(this.KitchenSizes.availableOven.length === 1 ) {
      this.KitchenSizes.dishwasher.size = 0
      this.KitchenSizes.oven.size = 0
    }

   // this.currect()
  }

  filterAvaiableRules({result:result, side:side}){
    const MIN_SPACE = 0.15
      result.forEach(rule => {
      rule.variants = rule.variants.filter(group => {
        const shouldRemove = group.some(item => {
          if (item.name !== side || !item.modules?.length) return false

          const w = Math.round(item.width * 100) / 100

          // суммируем размеры всех модулей
          const totalModuleSize = item.modules.reduce((sum, mod) => sum + (mod.size || 0), 0)

          // остаток пространства
          const remaining = Math.round((w - totalModuleSize) * 100) / 100

          // если остаток меньше минимального — удаляем
          if (remaining < MIN_SPACE) return true

          return false
        })

        return !shouldRemove
      })
    })

  }

  currect2(result){
    
    const sides = this.KitchenSizes.sideSizes
    const sinkSide = this.KitchenSizes.sink.side
    const sinkSize = this.KitchenSizes.sink.size
    const suSide = this.KitchenSizes.su.side

    const sinkDirectCorner = this.KitchenSizes.sink.location === 'directCorner'
    const sinkDirectMiddle = this.KitchenSizes.sink.location === 'directMiddle'
  //  const sinkDirectStart = this.KitchenSizes.sink.location === 'directStart'
    const sinkDirectEnd = this.KitchenSizes.sink.location === 'directEnd'

    const sinkLeftCorner = this.KitchenSizes.sink.location === 'leftCorner'
    const sinkLeftMiddle = this.KitchenSizes.sink.location === 'leftMiddle'
  //  const sinkLeftStart = this.KitchenSizes.sink.location === 'leftStart'
    const sinkLeftEnd = this.KitchenSizes.sink.location === 'leftEnd'

  

    

    if(sinkLeftCorner){
      console.log('1')

      const side = 'A1'
      this.filterAvaiableRules( {result:result, side:side})
      console.log('result Filtr', result)
    }
    if(sinkDirectCorner){
      console.log('2')
      const side = 'C1'
      this.filterAvaiableRules( {result:result, side:side})
      console.log('result Filtr', result)
    }
    if(sinkDirectMiddle){
      console.log('3')
      const side = 'A1'
      this.filterAvaiableRules( {result:result, side:side})
      console.log('result Filtr', result)
    }
    if(sinkDirectEnd){
      console.log('3')
      const side = 'A1'
      this.filterAvaiableRules( {result:result, side:side})
      console.log('result Filtr', result)
    }
    if(sinkLeftMiddle){
      console.log('4')
      const side = 'C2'
      this.filterAvaiableRules( {result:result, side:side})
      console.log('result Filtr', result)
    }
      if(sinkLeftEnd){
      console.log('4')
      const side = 'C1'
      this.filterAvaiableRules( {result:result, side:side})
      console.log('result Filtr', result)
    }


    
  }

  currect(){
    const sides = this.KitchenSizes.sideSizes
    const sinkSide = this.KitchenSizes.sink.side
    const sinkSize = this.KitchenSizes.sink.size
    const MIN_MODULE = 0.15
    const MIN_OVEN_SIZE = 0.45
    const ROW_OFFSET = 0.6

    const NONE = (sides.side_a  -  ROW_OFFSET) <= 0.60 
    const ONLY45 = (sides.side_a  -  ROW_OFFSET) > 0.60 && (sides.side_a  -  ROW_OFFSET) <= 0.75
    const ANY = (sides.side_a  -  ROW_OFFSET) > 0.75 

    const partsType = {
      left:[],
      direct:[],
      right:[]
    }

    this.KitchenSizes.parts.forEach(part=>{
      if((part.name === 'C1' && part.width < 0.60) && this.KitchenSizes.parts.some(part => part.name === "A1" && part.width <=0.6 ) ){
        console.log('есть')
        partsType.left.push(0.45)
      }
    })


   
    // if((sides.side_c - sinkSize) < 0.45 && sinkSide === 'left'){
    //    if(NONE)  console.log('духовку нельзя ставить рядом с раковиной нужено мин расстояние 15 см')
    //    if(ONLY45) console.log('только 45cм')
    //    if(ANY) console.log('любая') 
    // }

    // if((sides.side_a - sinkSize) < 0.45 && sinkSide === 'direct' &&  (sides.side_c  - ROW_OFFSET) <= 0.60) {
    //   console.log('духовку нельзя ставить рядом с раковиной нужено мин расстояние 15 см')
    //  this.KitchenSizes.oven.size = 0

    // }
  }
  

  filter(result, partsCount) {
    const filtered = result.filter(item => {
      if (item.set !== 'oven+dishWasher') return true; // оставляем все остальные

      const shouldDelete = item.variants.some(variant => {
        const sidesCount = partsCount;
        let count1 = 0;
        let count0 = 0;

        variant.forEach(el => {
          if (el.modules.length === 1) count1++;
          if (el.modules.length === 0) count0++;
        });

        if (sidesCount === 2) {
          // 2 стороны: 1×1 и 1×0
          return count1 === 1 && count0 === 1;
        }

        if (sidesCount === 3) {
          console.log('3', count0)
          // 3 стороны: 1×1 и (2×0 или 3×0)
          return count1 === 1 && (count0 === 2 || count0 === 3);
        }

        return false;
      });

      return !shouldDelete;
    });

    console.log('filtered', filtered);
    return filtered;
  }





  collectAvailableSizes(results) {
    const available = { oven: new Set(), dishWasher: new Set() };

    for (const r of results) {
      // Пройти по всем вариантам (variants)
      for (const variant of r.variants) {
        // Для каждой стороны в варианте
        for (const part of variant) {
          // Для каждого модульa, который реально стоит на стороне
          for (const mod of part.modules) {
            if (mod && mod.name === "oven" && mod.size != null) {
              available.oven.add(mod.size);
            }
            if (mod && mod.name === "dishWasher" && mod.size != null) {
              available.dishWasher.add(mod.size);
            }
          }
        }
      }
    }

    available.oven.add(0) // вариант без духовки

    // Сортируем массивы для удобства и возвращаем
    const toSortedArray = set => Array.from(set).sort((a, b) => a - b);

    return {
      oven: toSortedArray(available.oven),
      dishWasher: toSortedArray(available.dishWasher),
    };
  }


  setSink() {
    this.KitchenSizes.isSink = false
    blackMaterial.color.set("white");

  //  console.log("black", blackMaterial);
    gsap.to(blackMaterial.color, {
      r: 1,
      g: 0,
      b: 0,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      onUpdate: () => this.sceneSetup.requestRender(),
    });

    if (this.currentDimensionLine) {
      this.currentDimensionLine.dispose();
      this.currentDimensionLine = null;
    }
    if (this.currentDimensionLine1) {
      this.currentDimensionLine1.dispose();
      this.currentDimensionLine1 = null;
    }

    if (this.currentDimensionLine2) {
      this.currentDimensionLine2.dispose();
      this.currentDimensionLine2 = null;
    }

    this.currentDimensionLine = new DimensionLine(
      this.sceneSetup,
      this.scene,
      { x: 0, z: 0 },
      { x: 4, z: 0 }
    );

    this.deleteAfterSetSink();
    this.cleanupEventListeners(); // Очищаем предыдущие слушатели
    this.abortController = new AbortController(); // Создаем новый контроллер
    this.deleteSink();
    this.start();

    //убираем прозрачность
    this.unsetOpticaly();

    const { directPlane, leftPlane, rightPlane, planes } =
      this.createPlanesForRaycaster();
    const { SinkNormal, BoxForDelete } = this.getSink();

    let posZ, posX, point, sinkNormalRotation, text, side, sinkModuleRotation

    const onMouseMove = (event) => {
      const raycaster = this.createRaycaster(event);

      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        SinkNormal.visible = true;
        point = intersects[0].point;
        //     console.log(point.z);
        if (intersects[0].object === directPlane) {
          this.KitchenSizes.raycaster_for_sink.side = "direct";
          side = "direct";
          sinkNormalRotation = -Math.PI / 2;
          sinkModuleRotation = 0;

          posZ = 0.3;
          posX = point.x;
          text = posX;
          //позиция линии
          const startPoint = { x: 0, z: 0 };
          const endPoint = { x: posX, z: 0 };
          this.currentDimensionLine.update(startPoint, endPoint);
        } else if (intersects[0].object === leftPlane) {
          this.KitchenSizes.raycaster_for_sink.side = "left";
          sinkNormalRotation = 0;
          sinkModuleRotation = Math.PI/2;

          posZ = point.z;
          posX = 0.3;
          text = posZ;
          side = "left";

          const startPoint = { x: posX, z: 0 };
          const endPoint = { x: posX, z: posZ };
          this.currentDimensionLine.update(startPoint, endPoint);
        } else if (intersects[0].object === rightPlane) {
          this.KitchenSizes.raycaster_for_sink.side = "right";
          side = "right";

          sinkNormalRotation = Math.PI;
          sinkModuleRotation = -Math.PI/2;

          posZ = point.z;
          posX = this.KitchenSizes.sideSizes.side_a - 0.3;
          text = posZ;
          const startPoint = { x: posX, z: 0 };
          const endPoint = { x: posX, z: posZ };
          this.currentDimensionLine.update(startPoint, endPoint);
        }

        SinkNormal.position.set(posX, 0.68, posZ);
        SinkNormal.rotation.y = sinkNormalRotation;

        this.sceneSetup.requestRender();
      }
    };

    const onMouseDown = (event) => {
      const raycaster = this.createRaycaster(event);
      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        let data = this.getSinkModulePosition(posX, posZ);

        let { sinkModule, tabletop } = this.getSinkModule(data.module);

        sinkModule.visible = true;
        SinkNormal.position.set(posX, 0.675, posZ);
        SinkNormal.visible = false;
        sinkModule.position.set(data.posX, 0, data.posZ);
        sinkModule.rotation.y = sinkModuleRotation;

        console.log(posX)

        //  let resultMesh = makeHole(tabletop, BoxForDelete);
        //   const worldPos = new THREE.Vector3();
        //  tabletop.getWorldPosition(worldPos);
        //   resultMesh.position.copy(worldPos);
        //   resultMesh.material = blackMaterial;
        //   resultMesh.name = "resultMesh";

        //    this.scene.add(resultMesh);

        //хранит ширину модуля
        const topCenter = sinkModule.getObjectByName("topCenter");

        this.addToStore(data, topCenter, posX, posZ); //posX , posZ , позиция раковины, data позиция модуля  и тип
        this.build_rows();

        //   tabletop.visible = false;
        //    BoxForDelete.visible = false;

        // Удаление событий и плоскостей
        this.cleanupEventListeners();

     //   this.KitchenSizes.sink = true;
        this.KitchenSizes.module_sink = true;
    //    console.log(this.scene);
        this.deleteAfterSetSink();

        this.rowSegmentsStore.duct.x = Number(posX.toFixed(3));
        this.rowSegmentsStore.duct.z = Number(posZ.toFixed(3));
        this.rowSegmentsStore.duct.side = side;
        this.rowSegmentsStore.duct.isSet = true;

        this.KitchenSizes.isSink = true

      //  this.calcPartsLenght()

      this.calcParts()
        

        this.sceneSetup.requestRender();
      }
    };

    // Добавляем слушатели

    window.addEventListener("mousemove", onMouseMove, {
      signal: this.abortController.signal,
    });
    window.addEventListener("mousedown", onMouseDown, {
      signal: this.abortController.signal,
    });
  }

  findLowerRows() {
    const targetNames = ["build_direct_l1", "build_left_l1", "build_right_l1"];
    this.scene.traverse((object) => {
      if (targetNames.includes(object.name)) {
        this.lowerRows.push(object);
      }
    });
  }

  setOpticaly() {
    this.lowerRows = [];
    this.findLowerRows();
    this.lowerRows.forEach((group) => {
      group.visible = false
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          // const materials = Array.isArray(child.material)
          //   ? child.material
          //   : [child.material];

          // materials.forEach((mat) => {
          //   if (mat) {
          //     mat.transparent = true;
          //     mat.opacity = 0.1;
          //     mat.needsUpdate = true; // важно!
          //   }
          // });

        }
      });
    });
  }

  unsetOpticaly() {
    this.lowerRows = [];
    this.findLowerRows();
    this.lowerRows.forEach((group) => {
      group.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat) => {
            if (mat) {
              mat.transparent = false;
              mat.opacity = 0;
              mat.needsUpdate = true; // важно!
            }
          });
        }
      });
    });
  }



  setCustom() {
    this.KitchenSizes.isSink = false
    if (this.currentDimensionLine1) {
      this.currentDimensionLine1.dispose();
      this.currentDimensionLine1 = null;
    }

    if (this.currentDimensionLine2) {
      this.currentDimensionLine2.dispose();
      this.currentDimensionLine2 = null;
    }

    const sideSizes = this.KitchenSizes.sideSizes;

    const name = "sinkLine";

    this.currentDimensionLine1 = new DimensionLine(this.sceneSetup, this.scene, { x: 0, y: 0.4, z: 0 },
       { x: sideSizes.side_a / 2, y: 0.4, z: 0 },
      0,
      false,
      0x0000ff,
      name
    );

    this.currentDimensionLine2 = new DimensionLine(this.sceneSetup, this.scene, { x: 2, y: 0.4, z: 0 },
      { x: sideSizes.side_a, y: 0.4, z: 0 },
      0,
      false,
      0x0000ff,
      name
    );

    this.deleteAfterSetSink();
    this.cleanupEventListeners(); // Очищаем предыдущие слушатели
    this.abortController = new AbortController(); // Создаем новый контроллер

    this.deleteSink();

    //делаем прозрачность
    this.setOpticaly();

    //канашка
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.1),
      BoxForSinkMaterial
    );
    const { directPlane, leftPlane, rightPlane, planes } =
      this.createPlanesForCustom();
    box.position.set(sideSizes.side_a / 2, 0.4, 0.1);

    box.name = "duct";
    plannerConfig.namesToDelete.push("duct");
    plannerConfig.namesToDelete.push("sinkLine");

    this.scene.add(box);
    let point, side, rotation, posX, posZ, l1, l2, l3;
    const onMouseMove = (event) => {
      const raycaster = this.createRaycaster(event);
      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        point = intersects[0].point;
        //  console.log(point)
        //console.log(point);
        if (intersects[0].object === directPlane) {
          side = "direct";
          rotation = 0;
          posZ = 0.1;
          posX = point.x;
          const startPoint = { x: 0, z: 0 };
          const endPoint = { x: posX - 0.1, z: 0 };
          const startPoint2 = { x: posX + 0.1, z: 0 };
          const endPoint2 = { x: sideSizes.side_a, z: 0 };
          this.currentDimensionLine1.update(startPoint, endPoint,0);
          this.currentDimensionLine2.update(startPoint2, endPoint2,0);

          l1 = startPoint.x + endPoint.x;
          l2 = 0.2;
          l3 = endPoint2.x - startPoint2.x;

          //отрезки до и после хвс
        } else if (intersects[0].object === leftPlane) {
          side = "left";
          rotation = Math.PI / 2;
          posZ = point.z;
          posX = 0.1;
          const startPoint = { x: 0, z: 0 };
          const endPoint = { x: 0, z: posZ - 0.15 };
          const startPoint2 = { x: 0, z: posZ + 0.15 };
          const endPoint2 = { x: 0, z: sideSizes.side_c };
          this.currentDimensionLine1.update(startPoint, endPoint,1);
          this.currentDimensionLine2.update(startPoint2, endPoint2,1);
          l1 = startPoint.z + endPoint.z;
          l2 = 0.2;
          l3 = endPoint2.z - startPoint2.z;
        } else if (intersects[0].object === rightPlane) {
          side = "right";
          rotation = -Math.PI / 2;
          posZ = point.z;
          posX = this.sideSizes.side_a - 0.1;
          const startPoint = { x: sideSizes.side_a, z: 0 };
          const endPoint = { x: sideSizes.side_a, z: posZ - 0.15 };
          const startPoint2 = { x: sideSizes.side_a, z: posZ + 0.15 };
          const endPoint2 = { x: sideSizes.side_a, z: sideSizes.side_c };
          this.currentDimensionLine1.update(startPoint, endPoint);
          this.currentDimensionLine2.update(startPoint2, endPoint2);
          l1 = startPoint.z + endPoint.z;
          l2 = 0.2;
          l3 = endPoint2.z - startPoint2.z;
        }
        box.position.set(posX, 0.4, posZ);
        box.rotation.y = rotation;
        this.sceneSetup.requestRender();
      }
    };

    const onMouseDown = (event) => {
      const raycaster = this.createRaycaster(event);

      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        box.position.set(posX, 0.4, posZ);
        this.rowSegmentsStore.duct.x = Number(posX.toFixed(3));
        this.rowSegmentsStore.duct.z = Number(posZ.toFixed(3));
        this.rowSegmentsStore.duct.side = side;
        this.rowSegmentsStore.duct.isSet = true;

        //  console.log(this.rowSegmentsStore.duct);

        //  this.KitchenSizes.sink.side = side;
        // console.log(this.KitchenSizes.sink);

        this.cleanupEventListeners();

     //   console.log(l1);

        //добавляем в стор
        this.rowSegmentsStore.duct.l1 = Number(l1.toFixed(3));
        this.rowSegmentsStore.duct.l2 = Number(l2.toFixed(3));
        this.rowSegmentsStore.duct.l3 = Number(l3.toFixed(3));
        this.KitchenSizes.isSink = true
        this.sceneSetup.requestRender();
      }
    };

    window.addEventListener("mousemove", onMouseMove, {
      signal: this.abortController.signal,
    });
    window.addEventListener("mousedown", onMouseDown, {
      signal: this.abortController.signal,
    });
    //  window.addEventListener("mousedown", this.onMouseDown);
  }

  // Метод для удаления слушателя
  removeSinkListener() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mousedown", onMouseDown);
  }
}
