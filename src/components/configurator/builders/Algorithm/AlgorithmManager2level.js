import * as THREE from "three";

import { ModelInstanse2L } from "../../planner/ModelInstanse2L";
import { useRowSegmentsStore } from "../../../../pinia/RowSegments";
import { useKitchenSizesStore } from "../../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../../pinia/penals";
import { algorithmConfig } from "./algorithmConfig";
import { plannerConfig } from "../../planner/planerConfig";
import { usePlannerStore } from "../../../../pinia/PlannerStore";
import { useAlgorithmStore } from "../../../../pinia/Algorithm";

import { resultData2level } from "../resultData2level";
import { resultData2level900 } from "../resultData2level900";


export class AlgorithmManager2level {
  constructor(sceneSetup, loaderModels, cabinetBuilder) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.rowSegmentsStore = useRowSegmentsStore();
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
    this.plannerStore = usePlannerStore()
    this.algStore = useAlgorithmStore()
    this.sinkSide = null;
    this.sinkSize = null;
    this.NamesToDeleteDirect = [];
    this.NamesToDeleteLeft = [];
    this.currentDirect = 0;
    this.currentLeft = 0.3;
    this.currentRight = 0.3;
    this.offsets = null
    this.rotationMap = {
      direct: 0,
      left: Math.PI / 2,
      right: -Math.PI/2,
    };
    this.level2size = null
   
  }



  filter2(lenght) {
    const filtred = [];
    algorithmConfig.level2.rules.forEach((rule) => {
      let matchLength = rule.l == lenght;
      if (matchLength) {
        filtred.push(rule);
      }
    });
    return filtred;
  }

  run() {
    this.createParts()
    const level2Height = this.kitchenSizesStore.modules_height.height2level

    if(level2Height == 0.7)  algorithmConfig.level2.rules = resultData2level["Уровень 700"];
    if(level2Height == 0.9) algorithmConfig.level2.rules = resultData2level900["Уровень 900"];
      
      
   

    if (this.kitchenSizesStore.type === "direct") {
      this.buildDirect();
    }

     if (this.kitchenSizesStore.type === "left") {
      this.buildDirect();
      this.buildLeft();
    }

    
     if (this.kitchenSizesStore.type === "uShaped") {
      this.buildDirect();
      this.buildLeft();
      this.buildRight();
    }


  
    this.sceneSetup.requestRender();
 
  }

  createParts(){
    this.deleteDirect()
    this.deleteLeft()
    this.deleteRight()


    
     const filtered = this.algStore.resultDirect.filter(
       item => !["rowNum", "l", "m"].includes(item.key)
     )

 //    console.log('filtred', filtered)

     const index = filtered.findIndex(item => item.key === "d")

    let isOvenEnd = false

    if (index !== -1 && index === this.algStore.resultDirect.length - 1) {
      isOvenEnd = true
    }

  //  console.log("isOvenEnd", isOvenEnd)




  

    algorithmConfig.level2.rowStart.direct = 0
    algorithmConfig.level2.rowStart.left = 0
    algorithmConfig.level2.rowStart.right = 0
    
    algorithmConfig.level2.resultDirect.length = 0
    algorithmConfig.level2.resultLeft.length = 0
    algorithmConfig.level2.resultRight.length = 0

     const puModule =    this.kitchenSizesStore.modules_height.height2level === 0.7  ? { key: 'ПУ', value: 'ПУ-0.65' }  :
      this.kitchenSizesStore.modules_height.height2level === 0.9
      ? { key: 'ПУ', value: 'ПУ900-0.65' }
      : null


    const kitchenType = this.kitchenSizesStore.type
   
    let OVEN_HALF
    let ovenPos = Math.round(algorithmConfig.oven.position * 20) / 20;
    let ovenSize = Math.round(this.kitchenSizesStore.oven.size * 20) / 20
    ovenSize === 0.6 ? OVEN_HALF = 0.3 : OVEN_HALF =  0.2 


 //   console.log('ovenHalf', OVEN_HALF)
    

    const levels = this.kitchenSizesStore.levels


    const PU = 0.65
    const ROW_OFFSET  = 0.3
    const ovenSide =  algorithmConfig.oven.side
 //   console.log('ovenSide', ovenSide)
    const sideSizes = this.kitchenSizesStore.sideSizes
    const oven = true
    const offsets = this.penalStore.penalOffsetsState

    if( kitchenType === 'direct' ){
      const setSize = (part, value) => {
      algorithmConfig.level2.partsSize[part] = Number(value.toFixed(3))
    }
      if(!ovenSide){
        console.log('1')
        setSize('directPart1', sideSizes.side_a - offsets.directLeft - offsets.directRight)
        algorithmConfig.level2.rowStart.direct += offsets.directLeft
      } else {
        console.log('2')

        setSize('directPart1', (ovenPos-OVEN_HALF) - offsets.directLeft)
        setSize('directPart2', sideSizes.side_a - (ovenPos + OVEN_HALF) - offsets.directRight)
        algorithmConfig.level2.rowStart.direct += offsets.directLeft
        algorithmConfig.level2.rowStart.direct2 = ovenPos + OVEN_HALF
      }
    }

    if ( kitchenType === 'left') {
    const setSize = (part, value) => {
      algorithmConfig.level2.partsSize[part] = Number(value.toFixed(3))
    }
    

      if (ovenSide === 'left') {
        console.log('1')
        setSize('leftPart1', ovenPos - OVEN_HALF - PU)
        setSize('leftPart2', sideSizes.side_c - offsets.left - (ovenPos + OVEN_HALF))
        setSize('directPart1', sideSizes.side_a - offsets.directRight - (levels.left2 ? ROW_OFFSET : 0))

        levels.left2? algorithmConfig.level2.resultLeft.unshift(puModule ) : ''

        algorithmConfig.level2.rowStart.direct += levels.left2? ROW_OFFSET : 0
        algorithmConfig.level2.rowStart.left2 = ovenPos + OVEN_HALF

      }

      else if (ovenSide === ''){
        console.log('2')

        setSize('leftPart1', sideSizes.side_c - offsets.left -  (levels.direct2? ROW_OFFSET : 0))
        setSize('directPart1', sideSizes.side_a - offsets.directRight - PU)

        levels.direct2? algorithmConfig.level2.resultDirect.unshift(puModule ) : ''

        algorithmConfig.level2.rowStart.left += levels.direct2? ROW_OFFSET : 0

       
      } else {
        console.log('3')

        setSize('directPart1', ovenPos - OVEN_HALF - PU)
        setSize('directPart2', sideSizes.side_a - offsets.directRight - (ovenPos + OVEN_HALF))
        setSize('leftPart1', sideSizes.side_c - offsets.left -  (levels.direct2? ROW_OFFSET : 0))

        levels.direct2? algorithmConfig.level2.resultDirect.unshift(puModule ) : ''
        algorithmConfig.level2.rowStart.left += levels.direct2? ROW_OFFSET : 0
        algorithmConfig.level2.rowStart.direct2 = ovenPos + OVEN_HALF

        
      }
    }

   

  

    if (kitchenType == 'uShaped' ){
      const setSize = (part, value) => {
      algorithmConfig.level2.partsSize[part] = Number(value.toFixed(3))
      }

      const isLevel2Left = levels.left2 ? ROW_OFFSET : 0
      const isLevel2Right = levels.left2 ? ROW_OFFSET : 0

   //   console.log('uShaped1111')

      if (ovenSide === 'left') {
        console.log('1')
        setSize('leftPart1', ovenPos - OVEN_HALF - PU)
        setSize('leftPart2', sideSizes.side_c - offsets.left - (ovenPos + OVEN_HALF))
        setSize('directPart1', sideSizes.side_a -  isLevel2Left - isLevel2Right)
        setSize('rightPart1', sideSizes.side_d - offsets.right - PU)

        levels.left2? algorithmConfig.level2.resultLeft.unshift({ key: 'ПУ', value: 'ПУ-0.65' } ) : null 
        levels.left2? algorithmConfig.level2.resultRight.push({ key: 'ПУ', value: 'ПУ-0.65' } ) : null
        levels.left2? algorithmConfig.level2.rowStart.direct += ROW_OFFSET : 0
       
      } 

      if (ovenSide === 'direct') {
        console.log('2')

        
        const isLevel2direct = levels.direct2 ? ROW_OFFSET : 0


        setSize('leftPart1', sideSizes.side_c - offsets.left - isLevel2direct)
        setSize('directPart1',  (ovenPos - OVEN_HALF) - PU)
        setSize('directPart2', sideSizes.side_a - (ovenPos + OVEN_HALF) - PU)
        setSize('rightPart1', sideSizes.side_d - offsets.right - isLevel2direct)


        levels.direct2 ? algorithmConfig.level2.resultDirect.unshift({ key: 'ПУ', value: 'ПУ-0.65' } ) : null
        levels.direct2? algorithmConfig.level2.resultDirect.push({ key: 'ПУ', value: 'ПУ-0.65' } ) : null

        algorithmConfig.level2.rowStart.left += levels.direct2? ROW_OFFSET : 0
        
        algorithmConfig.level2.rowStart.right += levels.direct2? ROW_OFFSET : 0
      }
      
      if (ovenSide === 'right') {
        console.log('3')

        setSize('rightPart1', ovenPos - OVEN_HALF - PU)
        setSize('rightPart2', sideSizes.side_d - offsets.right - (ovenPos + OVEN_HALF))
        setSize('directPart1', sideSizes.side_a -  ROW_OFFSET - ROW_OFFSET)
        setSize('leftPart1', sideSizes.side_c - offsets.left - PU)

        
        algorithmConfig.level2.resultLeft.unshift({ key: 'ПУ', value: 'ПУ-0.65' } ) 
        algorithmConfig.level2.resultRight.push({ key: 'ПУ', value: 'ПУ-0.65' } ) 

        algorithmConfig.level2.rowStart.direct += ROW_OFFSET
   

      } 
    
    }


   
  //   this.currectSize()

   

  }

  currectSize(){
    // если размер части меньше 0.15 ставим  0.15
       Object.keys(algorithmConfig.level2.partsSize).forEach(key => {
        if(algorithmConfig.level2.partsSize[key] < 0.15)  algorithmConfig.level2.partsSize[key] = 0.15
    })

  }




  buildLeft(variant = 0, variant2 = 0) {
    plannerConfig.models2L.length = 0
    plannerConfig.modelsLeft2L.length = 0
    this.algStore.filtredLevel2.leftPart1.length = 0
    this.algStore.filtredLevel2.leftPart2.length = 0
    this.deleteLeft()
    // Извлекаем нужные данные
    const { oven } = algorithmConfig
    const { levels, sink, modules_height } = this.kitchenSizesStore

   

    const isOvenSide = oven.side === 'left'
    const is2level = levels.left2
    const partsSize = algorithmConfig.level2.partsSize
    

  // --- Вспомогательная функция для получения набора по размеру ---
   const getRule = (size, variantIndex) => {
        const filtered = (this.filter2(size) || []).filter(rule => rule.P_1 !== 0);
      const rule = filtered[variantIndex] || []
      if (!rule.length) {
       // this.plannerStore.showError()
        
      }
      const result = Object.entries(rule).map(([key, value]) => ({ key, value }))
      return  {rule:result, filtered:filtered}
    }

   let hoodModule

      this.kitchenSizesStore.oven.size === 0.45 ? hoodModule = { key: 'hood', value: 'hood-0.4' } : hoodModule = { key: 'hood', value: 'hood2-0.6' }

  // --- Основная логика ---
    if ( !is2level && isOvenSide) {
      // только вытяжка
      algorithmConfig.level2.resultLeft.push(hoodModule)
    }

    if (!isOvenSide && is2level) {
   //   console.log('rrr')
      
      // духовка не на прямой стороне, 2 уровень
      const result1 = getRule(partsSize.leftPart1, variant)
      this.algStore.filtredLevel2.leftPart1  = result1.filtered
      algorithmConfig.level2.resultLeft.push(...result1.rule)
    }

    if (isOvenSide && is2level) {
      // духовка на прямой стороне, 2 уровень
      const result1 = getRule(partsSize.leftPart1, variant)
      const result2 = getRule(partsSize.leftPart2, variant2)

      this.algStore.filtredLevel2.leftPart1 = result1.filtered
      this.algStore.filtredLevel2.leftPart2  = result2.filtered

    

      // добавляем вытяжку в первую часть
      result1.rule.push(hoodModule)

      algorithmConfig.level2.resultLeft.splice(1, 0, ...result1.rule, ...result2.rule)
    }

 
  // console.log('rrrrrule', algorithmConfig.level2.resultLeft)
  // --- Финальная подготовка ---
  this.prepareModels(algorithmConfig.level2.resultLeft, 'left')
  this.sceneSetup.requestRender()
  }

  buildDirect(variant = 0, variant2 = 0) {
    // Очистка данных


   
    plannerConfig.models2L.length = 0
    plannerConfig.modelsDirect2L.length = 0
        this.algStore.filtredLevel2.directPart1.length = 0
    this.algStore.filtredLevel2.directPart2.length = 0
    this.deleteDirect()

    // Извлекаем нужные данные
    const { oven } = algorithmConfig
    const { levels, sink, modules_height, type } = this.kitchenSizesStore
    const isOvenSide = oven.side === 'direct'
    const is2level = levels.direct2
  

    const partsSize = algorithmConfig.level2.partsSize
  

   
    // --- Вспомогательная функция для получения набора по размеру ---
    const getRule = (size, variantIndex) => {
    
        const filtered = (this.filter2(size) || []).filter(rule => rule.P_1 !== 0);

 //      console.log('filter', filtered)

      const rule = filtered[variantIndex] || []
    
      if (!rule.length) {
     //   this.plannerStore.showError()
        
      }
      const result = Object.entries(rule).map(([key, value]) => ({ key, value }))
      return  {rule:result, filtered:filtered}
    }


     let hoodModule

      this.kitchenSizesStore.oven.size === 0.45 ? hoodModule = { key: 'hood', value: 'hood-0.4' } : hoodModule = { key: 'hood', value: 'hood2-0.6' }

    // --- Основная логика ---
    if ( !is2level && isOvenSide) {
      console.log('1')
      // только вытяжка
      algorithmConfig.level2.resultDirect.push(hoodModule)
    }

    if (!isOvenSide && is2level) {
      // духовка не на прямой стороне, 2 уровень
      console.log('2')
      const result1 = getRule(partsSize.directPart1, variant)
      this.algStore.filtredLevel2.directPart1  = result1.filtered
      algorithmConfig.level2.resultDirect.push(...result1.rule)
    }

    if (isOvenSide && is2level) {
      console.log('3')


      const part1 = algorithmConfig.level2.partsSize.directPart1
      const part2 = algorithmConfig.level2.partsSize.directPart2

      // духовка на прямой стороне, 2 уровень
      const result1 = getRule(partsSize.directPart1, variant)
      const result2 = getRule(partsSize.directPart2, variant2)

      this.algStore.filtredLevel2.directPart1  = result1.filtered
      this.algStore.filtredLevel2.directPart2  = result2.filtered

      

      // добавляем вытяжку в первую часть
      result1.rule.push(hoodModule)

      algorithmConfig.level2.resultDirect.splice(1, 0, ...result1.rule, ...result2.rule)
    }

    

    // --- Финальная подготовка ---
    this.prepareModels(algorithmConfig.level2.resultDirect, 'direct')
    this.sceneSetup.requestRender()
  }

  buildRight(variant = 0, variant2 = 0) {
    plannerConfig.models2L.length = 0
    plannerConfig.modelsRight2L.length = 0
    this.deleteRight()
    // Извлекаем нужные данные
    const { oven } = algorithmConfig
    const { levels, sink, modules_height } = this.kitchenSizesStore

    const isOvenSide = oven.side === 'right'
    const is2level = levels.right2
    
    

    const partsSize = algorithmConfig.level2.partsSize
    const resultTotal = []



  // --- Вспомогательная функция для получения набора по размеру ---
  const getRule = (size, variantIndex) => {
    const filtered = (this.filter2(size) || []).filter(rule => rule.P_1 !== 0); // убрать строку excel P_1  0
    const rule = filtered[variantIndex] || []
    if (!rule.length) {
      this.plannerStore.showError()
      
    }
    return Object.entries(rule).map(([key, value]) => ({ key, value }))
  }


  let hoodModule

      this.kitchenSizesStore.oven.size === 0.45 ? hoodModule = { key: 'hood', value: 'hood-0.4' } : hoodModule = { key: 'hood', value: 'hood2-0.6' }

  // --- Основная логика ---
    if ( !is2level && isOvenSide) {
      // только вытяжка
      algorithmConfig.level2.resultRight.push(hoodModule)
    }

    if (!isOvenSide && is2level) {
      // духовка не на прямой стороне, 2 уровень
      algorithmConfig.level2.resultRight.push(...getRule(partsSize.rightPart1, variant))
    }

    if (isOvenSide && is2level) {
      // духовка на прямой стороне, 2 уровень
      const result1 = getRule(partsSize.rightPart1, variant)
      const result2 = getRule(partsSize.rightPart2, variant2)

      // добавляем вытяжку в первую часть
      result1.push(hoodModule)

      algorithmConfig.level2.resultRight.splice(1, 0, ...result1, ...result2)
    }

  // --- Финальная подготовка ---
  this.prepareModels(algorithmConfig.level2.resultRight, 'right')
  this.sceneSetup.requestRender()
  }


  
  

  clear() {
    this.currentDirect = 0
    this.currentLeft = 0.3
    this.currentRight = 0.3


  }

  //разделение тип и ширина из правила
  prepareModels(result, side) {
 //   console.log('result', result)
    result.forEach((elem) => {
      if (elem.key == 'l') return
   //   console.log('elem', elem)
      let name, width;
      if (typeof elem.value == "number") {
        if(this.kitchenSizesStore.modules_height.height2level == 0.9)  name = `ВП-${elem.value * 1000}`;
        if(this.kitchenSizesStore.modules_height.height2level == 0.7)  name = `П-${elem.value * 1000}`;

        
        
      
        width = elem.value;
      }else  if(elem.value == '') return
         else {
        const str = elem.value;
        const parts = str.split("-"); // Разделяем строку по '-'
        width = parseFloat(parts[1].replace(",", "."));
        name = parts[0] + "-" + `${width * 1000}`; // "ПГС2"

      }

    //  console.log('name', name)

      //  console.log(name, "-", width);
      this.addModule(name, width, side);
   //   console.log(name)
    });
  }


 

  addModule(modelName, width, side) {
    const id = THREE.MathUtils.generateUUID()
    let rotationY = this.rotationMap[side];

  
    const model = this.loaderModels.get(modelName);
    if (!model) return;

    //создание объекта модели
    let instance;
    instance = new ModelInstanse2L( model, this.sceneSetup);
  
    instance.side = side
    instance.name = modelName
    instance.fullname = modelName 
    instance.id = id
    model.userData.id = id
    instance.raycasterBox.userData.id = id
    instance.frontBox.userData.id = id
    

    let nameTodelete = modelName + side
    model.name = modelName + side;

    if (side == 'direct') {
      plannerConfig.namesToDeleteDirect2L.push(nameTodelete)
    }

    if (side == 'left') {
      plannerConfig.namesToDeleteLeft2L.push(nameTodelete)

    }

    if (side == 'right') {
      plannerConfig.namesToDeleteRight2L.push(nameTodelete)
    }

    this.scene.add(model);
    

    const position = { x: 0, y: 1.41, z: 0 };

    if (side == "direct") {
      position.x = algorithmConfig.level2.rowStart.direct + width / 2;
      position.z = 0.15;
      algorithmConfig.level2.rowStart.direct += width;
      plannerConfig.models2L.push(instance);
      plannerConfig.modelsDirect2L.push(instance);

     

      // ставим вытяжку над плитой
      if(modelName == ('hood2-450') || modelName == ('hood2-600') ||  modelName == ('hood-400') ){
  
        let ovenPos = Math.round(algorithmConfig.oven.position * 20) / 20;
        position.x = ovenPos
        algorithmConfig.level2.rowStart.direct = algorithmConfig.level2.rowStart.direct2

      }

    }
    if (side == "left") {
  
      position.x = 0.15;
      position.z = algorithmConfig.level2.rowStart.left + width / 2;
     
      algorithmConfig.level2.rowStart.left += width;
      plannerConfig.models2L.push(instance);
      plannerConfig.modelsLeft2L.push(instance);

      if(modelName == ('hood2-450') || modelName == ('hood2-600') ||  modelName == ('hood-400') ){
        let ovenPos = Math.round(algorithmConfig.oven.position * 20) / 20;
        position.z = ovenPos
        algorithmConfig.level2.rowStart.left = algorithmConfig.level2.rowStart.left2

      }


    }
    if (side == "right") {
      position.x = this.kitchenSizesStore.sideSizes.side_a - 0.15;
      position.z = algorithmConfig.level2.rowStart.right + width / 2;
      algorithmConfig.level2.rowStart.right += width;
      plannerConfig.models2L.push(instance);

        if(modelName == ('hood2-450') || modelName == ('hood2-600') ||  modelName == ('hood-400')  ){
        let ovenPos = Math.round(algorithmConfig.oven.position * 20) / 20;
        position.z = ovenPos

      }

    }
 
    model.position.set(position.x, position.y, position.z);
    model.rotation.y = rotationY;
    model.visible = true;

    this.castShadow(model)
  
 

   
  }


    castShadow(cabinet){
    cabinet.traverse((child) => {
      if (child.isMesh) {
         if (child.name.toLowerCase().includes("glass")) return;
       child.castShadow = true;
       child.receiveShadow = false;
      }
    });
  }


  deleteDirect() {
    // algorithmConfig.level2.namesToDeleteDirect.forEach((name) => {
    //   this.scene.children
    //     .filter((element) => element.name === name)
    //     .forEach((element) => this.scene.remove(element));
    // });


    plannerConfig.namesToDeleteDirect2L.forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => {
          element.traverse(child =>{
            if (child.geometry) {
              child.geometry.dispose();
            }
          })
          this.scene.remove(element)
        } );
    });
    //this.NamesToDeleteDirect.length = 0;
    plannerConfig.namesToDeleteDirect2L.length = 0


   
  //  algorithmConfig.level2.rowStart.direct = this.startPosOld.direct


     // const filtred1 = algorithmConfig.resultLeft.filter(item=> ["b1000left", "module-sink-1000"].includes(item.key))
   //  const filtred = algorithmConfig.level2.resultDirect.filter(item=> ["ПУ"].includes(item.key))

    // algorithmConfig.resultLeft = filtred1
 //   algorithmConfig.level2.resultDirect = filtred


  }

  deleteLeft() {
    // algorithmConfig.level2.namesToDeleteLeft.forEach((name) => {
    //   this.scene.children
    //     .filter((element) => element.name === name)
    //     .forEach((element) => this.scene.remove(element));
    // });
    // this.NamesToDeleteLeft.length = 0;


   plannerConfig.namesToDeleteLeft2L.forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
    //this.NamesToDeleteDirect.length = 0;
    plannerConfig.namesToDeleteLeft2L.length = 0
  }

  deleteRight() {
    // algorithmConfig.level2.namesToDeleteLeft.forEach((name) => {
    //   this.scene.children
    //     .filter((element) => element.name === name)
    //     .forEach((element) => this.scene.remove(element));
    // });
    // this.NamesToDeleteLeft.length = 0;


   plannerConfig.namesToDeleteRight2L.forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
    //this.NamesToDeleteDirect.length = 0;
    plannerConfig.namesToDeleteRight2L.length = 0
  }


  
  getObjectTexturesSize(obj) {
  const seen = new Set(); // уникальные текстуры
  let total = 0;

  obj.traverse(child => {
    if (child.isMesh && child.material) {
      // пропускаем troika Text
      if (child.isTroikaText || child.material.baseMaterial) return;

      const mats = Array.isArray(child.material) ? child.material : [child.material];

      mats.forEach(mat => {
        for (const key in mat) {
          const val = mat[key];
          if (val && val.isTexture && !seen.has(val.uuid)) {
            const sizeMB = this.getTextureSizeMB(val);
            total += sizeMB;
            seen.add(val.uuid);
         //   console.log(`${child.name} | ${key}: ${sizeMB.toFixed(2)} MB`);
          }
        }
      });
    }
  });

  console.log(`Всего текстур: ${total.toFixed(2)} MB`);
  return total;
  }

  getTextureSizeMB(tex) {
  if (!tex) return 0;

  let w = 0, h = 0;

  // обычные текстуры
  if (tex.image) {
    if (Array.isArray(tex.image)) {
      w = tex.image[0]?.width || 0;
      h = tex.image[0]?.height || 0;
    } else {
      w = tex.image.width || 0;
      h = tex.image.height || 0;
    }
  }
  // WebGLRenderTarget / PMREM (envMap)
  else if (tex.source && tex.source.data) {
    w = tex.source.data.width || 0;
    h = tex.source.data.height || 0;
  }

  if (!w || !h) return 0;

  let bpp = 4; // RGBA8
  if (tex.type === THREE.FloatType) bpp = 16;
  if (tex.type === THREE.HalfFloatType) bpp = 8;

  // если кубмап → ×6, мипы +33%
  const factor = tex.isCubeTexture ? 6 * 1.33 : 1.33;

  return (w * h * bpp * factor) / (1024 * 1024); // МБ
  }



}
