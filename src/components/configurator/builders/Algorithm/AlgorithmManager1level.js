import * as THREE from 'three'

import { ModelInstanse } from "../../planner/ModelInstanse";
import { SinkInstanse } from "../../planner/SinkInstanse";
import { useRowSegmentsStore } from "../../../../pinia/RowSegments";
import { resultData } from "../resultData";
import { useKitchenSizesStore } from "../../../../pinia/kitchenSizes";
import { typesMap } from "./typesMap";
import { namesToDelete } from "../../planner/utils/namesToDelete";
import { usePenalStore } from "../../../../pinia/penals";
import { plannerConfig } from "../../planner/planerConfig";
import { algorithmConfig } from "./algorithmConfig";
import { usePlannerStore } from "../../../../pinia/PlannerStore";
import { useAlgorithmStore } from "../../../../pinia/Algorithm";
import { addOutline } from "../../addOutline";

import { Service } from '../../Service/Service';




export class AlgorithmManager1level {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.rowSegmentsStore = useRowSegmentsStore();
    this.kitchenSizesStore = useKitchenSizesStore();
    this.algStore = useAlgorithmStore()
    this.penalStore = usePenalStore()
    this.plannerStore  = usePlannerStore()
    this.service = new Service(this.kitchenSizesStore)

    // текущий вариант
    this.actualDirect = null;
    this.actualLeft = null;

    this.sinkSide = null;
    this.sinkSize = null;

    this.dishwasher = null
    this.dishwasherSide = null

    this.ovenSize = null
    this.ovenSide = null

    this.startPosDirect = 0
    this.startPosLeft = 0
    this.startPosRight = 0
    this.rules = {
      oven:"духовка",
      dishWasher:"угл мк лев дух прав",
      clean:"без дх и пм",
      ovenDish:"угл мк и дух слева",
    }

  }


  clear(){
      ['SinkNormal', 'sinkModel'].forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    })


      this.algorithmConfig = algorithmConfig

    this.deleteNamesFromPlanner()

    plannerConfig.models.length = 0
    plannerConfig.modelsDirect.length = 0
    plannerConfig.modelsLeft.length = 0
    plannerConfig.modelsRight.length = 0

 
   const filtred1 = algorithmConfig.resultLeft.filter(item=> ["b1000left", "module-sink-1000", "m"].includes(item.key))
   const filtred2 = algorithmConfig.resultDirect.filter(item=> ["b1000left", "module-sink-1000", "m"].includes(item.key))
   const filtred3 = algorithmConfig.resultRight.filter(item=> ["b1000left", "module-sink-1000", "m"].includes(item.key))


   algorithmConfig.resultLeft = filtred1
   algorithmConfig.resultDirect = filtred2
   algorithmConfig.resultRight = filtred3




    //plannerConfig.boxesArray.length = 0;

    this.deleteDirect()
    this.deleteLeft()
    this.rulesLeft = [];
    this.rulesDirect = [];
    this.rulesRight = []

    this.rulesFiltredDirect = [];
    this.rulesFiltredLeft = [];

    plannerConfig.modelsLeft.length = 0
    plannerConfig.modelsDirect.length = 0

  }


  run() {
    this.clear()
    this.kitchenType = this.kitchenSizesStore.type
    this.offsets = this.penalStore.penalOffsets
    const sideSizes = this.kitchenSizesStore.sideSizes;
    this.sinkSide = this.kitchenSizesStore.sink.side
    this.dishwasher = this.kitchenSizesStore.dishwasher.size
    this.dishwasherSide = this.kitchenSizesStore.dishwasher.side
    this.ovenSide = this.kitchenSizesStore.oven.side
    this.ovenSize = this.kitchenSizesStore.oven.size

    this.new()

  }
 
 

  new(value = 0){
    this.clear()
    const rule = this.kitchenSizesStore.filtredRulesTotal[0]
    console.log('value', value)
    console.log(rule)
    this.algStore.variants = rule.variants
    const variant = rule.variants[value]
  
    const newRules = []

      variant.forEach(variant=>{
        if (variant.modules.length === 2) newRules.push({side:variant.name, rule: this.rules['ovenDish'] , length:variant.width })
        if(variant.modules.length === 0) newRules.push({side:variant.name, rule: this.rules['clean'] , length:variant.width  })
        if(variant.modules.length === 1) {
          const moduleName = variant.modules[0].name 
          newRules.push({side:variant.name, rule:this.rules[moduleName] , length:variant.width  })
        }
      })
  
 // console.log(newRules)

    const leftRules = newRules.filter(rule => rule.side === "C1" || rule.side === "C2");
    const directRules = newRules.filter(rule => rule.side === "A1" || rule.side === "A2");

    
    this.algStore.rulesName = newRules

    console.log('left', leftRules)
    console.log('direct', directRules)

 

  if(this.kitchenSizesStore.type === 'direct')  this.buildSideRowDirect(directRules)
  
  if(this.kitchenSizesStore.type === 'left'){
    this.buildSideRowDirect(directRules)
    this.buildSideRowLeft(leftRules)
  }
    

    
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

  direct(){
    const isSinkSide = this.kitchenSizesStore.sink.side === 'direct'
    const is2parts = algorithmConfig.direct2parts // если ряд разделен на 2 части раковиной
    const isOvenSide = this.kitchenSizesStore.oven.side === 'direct'
    const rules = algorithmConfig.rules

    const hasD = this.kitchenSizesStore.oven.isOven
    const hasP = this.kitchenSizesStore.dishwasher.isDishwash

      if (hasP && hasD) {
    // оба есть
    // пробуем поместить их в одну часть
    const fitsTogether = parts.find(p => canFit(p, [45, 60]));
    if (fitsTogether) {
      fitsTogether.type = "p+d";
    } else {
      // если не помещаются вместе, ищем где можно по отдельности
      const fitsP = parts.find(p => canFit(p, [45]));
      const fitsD = parts.find(p => canFit(p, [60]) && p !== fitsP);
      if (fitsP) fitsP.type = "p";
      if (fitsD) fitsD.type = "d";
    }
  } else if (hasP) {
    const fitsP = parts.find(p => canFit(p, [45]));
    if (fitsP) fitsP.type = "p";
  } else if (hasD) {
    const fitsD = parts.find(p => canFit(p, [60]));
    if (fitsD) fitsD.type = "d";
  }
  
  }

 



  prepareDirectModels(){
    const isOven = this.penalStore.isOven

    this.startPosDirect = algorithmConfig.rowStart.direct 

   
   
    algorithmConfig.resultDirect.forEach(elem=>{
      const width = Number((elem.value).toFixed(2));
      const type = typesMap[elem.key] || elem.key;
         let name;
      if (type === "m") {
        name =  `ms${width * 1000}`       
      }else if(type == 'module-sink-1000-left'){
        name = type
      }else if(type == 'module-sink-1000') {
         name = type
      }
      else if(type == 'b1000'){
        name = 'b1000'
      } else if(type =='b1000left'){
        name = type
      }
       else if (type === "p") {
        name = `dw-${width * 1000}`;
      } else if (type === "d") {
        isOven?  name = `mc-${width * 1000}` :  name = `i-oven-${width * 1000}`;
       
      // name = `mc-${width * 1000}`
      } else {
        name = `${type}-${width * 1000}`;
      }
   //   console.log('name', name)
      this.addDirectModule(name, width, name, type);
       
    })
  }

  prepareLeftModels(){
      this.startPosLeft = algorithmConfig.rowStart.left 

      algorithmConfig.resultLeft.forEach(elem=>{
      
      const width = Number((elem.value).toFixed(2));
      const type = typesMap[elem.key] || elem.key;
      const isOven = this.penalStore.isOven
         let name;
      if (type === "m") {
        
        // this.kitchenSizesStore.type == 'left' && this.sinkSide == 'direct' ? name = 'module-sink-1000' : 
        name =  `ms${width * 1000}`
        
      }else if (type == "module-sink-1000-left"){
         name =  type
      } else if(type == 'b1000'){
        name = 'b1000'
      } else if(type == 'module-sink-1000') {
         name = type
      } else if(type =='b1000left'){
        name = type
      }
       else if (type === "p") {
        name = `dw-${width * 1000}`;
      } else if (type === "d") {
        isOven?  name = `mc-${width * 1000}` :  name = `i-oven-${width * 1000}`;

        
        
       // name = `i-oven-${width * 1000}`;
      } else {
        name = `${type}-${width * 1000}`;
      }
   //   console.log('name', name)
      this.addLeftModule(name, width, name, type);
    })
  }

  prepareRightModels(){
      this.startPosRight = algorithmConfig.rowStart.left 

      algorithmConfig.resultRight.forEach(elem=>{
      const width = Number((elem.value).toFixed(2));
      const type = typesMap[elem.key] || elem.key;
         let name;
      if (type === "m") {
        
        // this.kitchenSizesStore.type == 'left' && this.sinkSide == 'direct' ? name = 'module-sink-1000' : 
        name =  `ms${width * 1000}`
        
      }else if (type == "module-sink-1000-left"){
         name =  type
      } else if(type == 'b1000'){
        name = 'b1000'
      } else if(type == 'module-sink-1000') {
         name = type
      } else if(type =='b1000left'){
        name = type
      }
       else if (type === "p") {
        name = `dw-${width * 1000}`;
      } else if (type === "d") {
        isOven?  name = `mc-${width * 1000}` :  name = `i-oven-${width * 1000}`;

        
        
       // name = `i-oven-${width * 1000}`;
      } else {
        name = `${type}-${width * 1000}`;
      }
   //   console.log('name', name)
      this.addRightModule(name, width, name, type);
    })
  }


  
  addDirectModule(modelName, width, name, type){
    const id = THREE.MathUtils.generateUUID()
    
    
    let axis = 'x'
    let isLeft = false
   // let rotationY = -Math.PI / 2;
    const model = this.loaderModels.get(modelName);
    if (!model) return;
    //создание объекта модели
    let instance
    if(type == 'm'){
      instance = new SinkInstanse(model);
    } else {
      instance = new ModelInstanse(model , this.sceneSetup);
    }


   


    instance.name = type
     if(modelName == 'module-sink-1000-left' || modelName == 'module-sink-1000' )
      {
         instance.name = 'm'
      }
    instance.fullname = modelName
    instance.side = 'direct'  
    instance.id = id
    model.userData.id = id
    instance.raycasterBox.userData.id = id
    plannerConfig.modelsDirect.push(instance)
    this.scene.add(model); 
    const position = { x: 0, y: 0, z: 0 };
    
    position.x = this.startPosDirect  + width / 2;
   
    position.z = 0.3;
    model.position.set(position.x, position.y, position.z);
   // model.rotation.y = rotationY;
    model.visible = true;
    name = name + '-Direct'
    model.name = name;

  //  console.log(type)
// сохраняем позиции для духовки и посудомойки
     if(type == 'd'){
        algorithmConfig.oven.side = 'direct'
        algorithmConfig.oven.position = position.x
        algorithmConfig.oven.isOven = true
      }
      if(type == 'p'){
        algorithmConfig.dishwasher.side = 'direct'
        algorithmConfig.dishwasher.position = position.x
        algorithmConfig.dishwasher.is = true
      }



    this.startPosDirect += width;
 //   plannerConfig.namesToDelete.push(name)
   // this.NamesToDeleteDirect.push(name);
    plannerConfig.namesToDeleteDirect.push(name)
  };

  addLeftModule (modelName, width, name, type) {
    const m = this.sinkSize; // фиксированная мойка, можно передать из параметров
    const id = THREE.MathUtils.generateUUID()

    
    
    const model = this.loaderModels.get(modelName);
    if (!model) return;

    let instance
      if(type == 'm'){
       instance = new SinkInstanse(model);
    } else {
      instance = new ModelInstanse(model, this.sceneSetup);
    }

     instance.id = id
      model.userData.id = id
       instance.raycasterBox.userData.id = id
       instance.name = type

      if(modelName == 'module-sink-1000-left'){
        instance.name = 'm'
      }

      instance.side = 'left'
      instance.fullname = modelName
      plannerConfig.modelsLeft.push(instance)
      this.scene.add(model); // или массив типа plannerConfig.modelsLeft.push(instance)

      const position = { x: 0, y: 0, z: 0 };
    //  console.log('current' , currentPos)
      position.z = this.startPosLeft + width / 2;
      position.x = 0.3;

      model.position.set(position.x, position.y, position.z);
      model.rotation.y = Math.PI / 2;
      model.visible = true;
      model.name = name;

      if(type == 'd'){
        algorithmConfig.oven.side = 'left'
        algorithmConfig.oven.position = position.z
        algorithmConfig.oven.isOven = true
      }

      if(type == 'p'){
     
        algorithmConfig.dishwasher.side = 'left'
        algorithmConfig.dishwasher.position = position.z
        algorithmConfig.dishwasher.is = true

      }

      this.startPosLeft += width;
      plannerConfig.namesToDeleteLeft.push(name)
  };

  addRightModule (modelName, width, name, type) {
    const m = this.sinkSize; // фиксированная мойка, можно передать из параметров
    const id = THREE.MathUtils.generateUUID()
    
    const model = this.loaderModels.get(modelName);
    if (!model) return;

    let instance
      if(type == 'm'){
       instance = new SinkInstanse(model);
    } else {
      instance = new ModelInstanse(model, this.sceneSetup);
    }

     instance.id = id
      model.userData.id = id
       instance.raycasterBox.userData.id = id
       instance.name = type

      if(modelName == 'module-sink-1000-left'){
        instance.name = 'm'
      }

      instance.side = 'right'
      instance.fullname = modelName
      plannerConfig.modelsRight.push(instance)
      this.scene.add(model); // или массив типа plannerConfig.modelsLeft.push(instance)

      const position = { x: 0, y: 0, z: 0 };
    //  console.log('current' , currentPos)
      position.z = this.startPosRight + width / 2;
      position.x = this.kitchenSizesStore.sideSizes.side_a - 0.3;

      model.position.set(position.x, position.y, position.z);
      model.rotation.y = -Math.PI / 2;
      model.visible = true;
      model.name = name;

      if(type == 'd'){
        algorithmConfig.oven.side = 'left'
        algorithmConfig.oven.position = position.z
        algorithmConfig.oven.isOven = true
      }

      if(type == 'p'){
     
        algorithmConfig.dishwasher.side = 'left'
        algorithmConfig.dishwasher.position = position.z
        algorithmConfig.dishwasher.is = true

      }

      this.startPosRight += width;
   //   plannerConfig.namesToDeleteLeft.push(name)
  };


  variantLeft(variant = 0, variant2 = 0) {
    const kitchenType = this.kitchenSizesStore.type
    const sinkLocation = this.kitchenSizesStore.sink.location
 

    plannerConfig.modelsLeft.length = 0
    this.deleteLeft();

    let z =  Math.round(this.rowSegmentsStore.duct.z * 20) / 20;
    let x =  Math.round(this.rowSegmentsStore.duct.x * 20) / 20;

   // проверка  духовка встроена в пенал
   
    const kitchType = this.kitchenSizesStore.type

    let rule = this.algStore.filtredLeftPart1[variant];
    let rule2 = this.algStore.filtredLeftPart2[variant2];



    
   
 
    if(rule){
      let result = Object.entries(rule).map(([key, value]) => ({ key, value }));  
      algorithmConfig.resultLeft.splice(1, 0, ...result)
    } else {
      this.plannerStore.showError();
      console.log('нет правил')
    }



    if(kitchenType === 'left'){
      if(sinkLocation ==='leftEnd') algorithmConfig.resultLeft.push({ key: 'm', value: 0.6 });
      if(sinkLocation ==='leftStart') algorithmConfig.resultLeft.unshift({ key: 'm', value: 0.6 });

    }


    if(algorithmConfig.left2parts){
       algorithmConfig.resultLeft.push({ key: 'm', value: 0.6 });
       if(rule2){
          let result2 = Object.entries(rule2).map(([key, value]) => ({ key, value }));
          algorithmConfig.resultLeft.push(...result2);
       } else {
          this.plannerStore.showError();
          console.log('нет правил')
       }
    }

    

    this.algStore.resultLeft = algorithmConfig.resultLeft






    this.prepareLeftModels()
    this.tableTopvisible() 

    this.sceneSetup.requestRender();


  // из общего массива модулей убираем старые , добаляем новые
    const penalsLeft = plannerConfig.penalsArray.filter(penal=> penal.side == 'left')
    plannerConfig.modelsLeft.push(...penalsLeft)

    plannerConfig.models = plannerConfig.models.filter(model => !(model.level === 1 && model.side === 'left'));
    plannerConfig.models.push(...plannerConfig.modelsLeft)

  
   

 //   algorithmConfig.resultLeft.length = 0

  }

  variantRight(variant = 0, variant2 = 0) {
 

  plannerConfig.modelsRight.length = 0
  //this.deleteLeft();

    let z =  Math.round(this.rowSegmentsStore.duct.z * 20) / 20;
    let x =  Math.round(this.rowSegmentsStore.duct.x * 20) / 20;

   // проверка  духовка встроена в пенал
    const isOven =  this.penalStore.isOven
    const kitchType = this.kitchenSizesStore.type

    // if( this.sinkSide == 'left'  && z <= 0.7){
    //   algorithmConfig.resultRight.push({key:'b1000', value:1}) 
    // }

    // if((kitchType == 'left' || kitchType == 'uShaped') && this.sinkSide == 'left' && z>0.85 && z < 1.05){
    //    algorithmConfig.resultRight.push({key:'m', value:0.6})
    // }

    // if((kitchType == 'left' || kitchType == 'uShaped') && this.sinkSide == 'direct'  && x > 0.7){
    //   algorithmConfig.resultRight.push({key:'b1000left', value:1}) // добавить отступ z для left
    // }





    let rule = algorithmConfig.filtredRules.rightPart1[variant];
    let rule2 = algorithmConfig.filtredRules.rightPart2[variant2];

    this.actualLeft = rule;
    let result


    if(rule){
      result = Object.entries(rule).map(([key, value]) => ({ key, value }));
          

    } else {
      result = []
      this.plannerStore.showError();

    }


  //  result.reverse()



    //добавляем мойку в начало или конец массива модулей
       algorithmConfig.resultRight.push(...result);

    if (rule2 && Object.keys(rule2).length > 0) {

        let result2 = Object.entries(rule2).map(([key, value]) => ({ key, value }));
        result2.reverse()
        algorithmConfig.resultRight.push({ key: 'm', value: 0.6 });
        algorithmConfig.resultRight.push(...result2);
    }

    this.algStore.resultRight = algorithmConfig.resultRight


    this.prepareRightModels()
    //this.tableTopvisible() 

    this.sceneSetup.requestRender();


  // из общего массива модулей убираем старые , добаляем новые
    // const penalsLeft = plannerConfig.penalsArray.filter(penal=> penal.side == 'left')
    // plannerConfig.modelsLeft.push(...penalsLeft)

    // plannerConfig.models = plannerConfig.models.filter(model => !(model.level === 1 && model.side === 'left'));
    // plannerConfig.models.push(...plannerConfig.modelsLeft)
   

    // algorithmConfig.resultLeft.length = 0

  }

  variantDirect(variant = 0, variant2 = 0) {
    const kitchenType = this.kitchenSizesStore.type 
    const direct2parts = algorithmConfig.direct2parts
    const sinkLocation = this.kitchenSizesStore.sink.location

    this.deleteDirect();


    plannerConfig.modelsDirect.length = 0


    let z =  Math.round(this.rowSegmentsStore.duct.z * 20) / 20;
    let x =  Math.round(this.rowSegmentsStore.duct.x * 20) / 20;


    const m = this.kitchenSizesStore.sink.size; // фиксированная мойка, можно передать из параметров


    let rule = this.algStore.filtredDirectPart1[variant];
    let rule2 = this.algStore.filtredDirectPart2[variant2];


 
    if(rule){
      let result = Object.entries(rule).map(([key, value]) => ({ key, value }));  
      algorithmConfig.resultDirect.splice(1, 0, ...result)
    } else {
      this.plannerStore.showError();
      console.log('нет правил')
    }


    if(kitchenType === 'direct' ){
      if(sinkLocation  === 'end'){
        algorithmConfig.resultDirect.push({ key: 'm', value: 0.6 });
      } else if(!algorithmConfig.direct2parts){
        algorithmConfig.resultDirect.unshift({ key: 'm', value: 0.6 });
      }
    } 

    if(kitchenType === 'left'){
      if(sinkLocation ==='directEnd') algorithmConfig.resultDirect.push({ key: 'm', value: 0.6 });
      if(sinkLocation ==='directStart') algorithmConfig.resultDirect.unshift({ key: 'm', value: 0.6 });

    }


    if(algorithmConfig.direct2parts){
       algorithmConfig.resultDirect.push({ key: 'm', value: 0.6 });
       if(rule2){
          let result2 = Object.entries(rule2).map(([key, value]) => ({ key, value }));
          algorithmConfig.resultDirect.push(...result2);
       } else {
          this.plannerStore.showError();
          console.log('нет правил')
       }
    }

    this.algStore.resultDirect = algorithmConfig.resultDirect

 

    this.prepareDirectModels()
    this.tableTopvisible() 


    // из общего массива модулей убираем старые , добаляем новые
    
    const penalsDirect = plannerConfig.penalsArray.filter(penal=> penal.side == 'direct')
    plannerConfig.modelsDirect.push(...penalsDirect)
    plannerConfig.models = plannerConfig.models.filter(model => !(model.level === 1 && model.side === 'direct'));
    plannerConfig.models.push(...plannerConfig.modelsDirect)



    this.sceneSetup.requestRender();
  }



  buildSideRowDirect(rules) {
  
    this.algStore.filtredDirectPart1.length = 0
    this.algStore.filtredDirectPart2.length = 0



   const rulesPart1 = resultData[rules?.[0]?.rule] || []
   const rulesPart2 = resultData[rules?.[1]?.rule] || []



   const length1 = rules[0]?.length || 0 
   const length2 = rules[1]?.length || 0

   this.algStore.partSizes.direct1 = length1
   this.algStore.partSizes.direct2 = length2
  


    let D = this.kitchenSizesStore.oven.size;
    let P = this.kitchenSizesStore.dishwasher.size;


    
   // console.log('lenght1', length1)
  //  console.log('lenght2', length2)

//   console.log('духовка', D)
   // console.log('посудмк', P)




    rulesPart1.forEach((rule) => {
      let matchLength = rule.l == length1;
    
     
 
     // let matchDishwasher = P == 0  ? !("p" in rule)  : rule.p == P; 
       let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;
      // если правила direct2 то не проверяем посудомойку
      // if(rulesPart1hasDirect2) matchDishwasher = true
      if (matchLength && matchDishwasher && matchOven ) {
         this.algStore.filtredDirectPart1.push(rule);
      }
    });


      rulesPart2.forEach((rule) => {
      const matchLength = rule.l == length2;
      if(this.sinkSide == 'left'  && this.kitchenSizesStore.type == 'left') P  = 0

      //let matchDishwasher = P == 0   ? !("p" in rule)   : rule.p == P; 
      let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;

      // if(rulesPart2hasDirect2) matchDishwasher = true

      if (matchLength && matchDishwasher && matchOven ) {
        this.algStore.filtredDirectPart2.push(rule);
      }
    });

    this.variantDirect(0)
      
  }

  buildSideRowLeft(rules) {
 
    this.algStore.filtredLeftPart1.length = 0;
    this.algStore.filtredLeftPart2.length = 0;


  //  console.log('rules', rules)

  

    const rulesPart1 = resultData[rules?.[0]?.rule] || []
    const rulesPart2 = resultData[rules?.[1]?.rule] || []

  //  console.log(rulesPart1)
   // console.log(rulesPart2)




   const length1 = rules[0]?.length || 0 
   const length2 = rules[1]?.length || 0

  // console.log(length1)
   //console.log(length2)
    
    


    let D = this.kitchenSizesStore.oven.size;
    let P = this.kitchenSizesStore.dishwasher.size;

  //  console.log('духовка', D)
  //  console.log('посудмк', P)



    rulesPart1.forEach((rule) => {
     
     
      let matchLength = rule.l == length1;
    //  let matchDishwasher = P == 0 ? !("p" in rule)  : rule.p == P; 
      let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;

    

      if (matchLength && matchDishwasher && matchOven) {
         this.algStore.filtredLeftPart1.push(rule);
      }
    });

      rulesPart2.forEach((rule) => {
    
   //   if(this.sinkSide == 'left'  && this.kitchenSizesStore.type == 'left') P  = 0
      //let matchDishwasher = P == 0  ? !("p" in rule)       : rule.p == P; 
      const matchLength = rule.l == length2;
      let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;

      // if(rulesPart2hasDirect2) matchDishwasher = true

      if (matchLength && matchDishwasher && matchOven ) {
         this.algStore.filtredLeftPart2.push(rule);

      }
    });
    this.variantLeft(0)
  }

  buildSideRowRight() {
 
    algorithmConfig.filtredRules.rightPart1.length = 0;
    algorithmConfig.filtredRules.rightPart2.length = 0;

   
    const rulesPart1 =  resultData[algorithmConfig.rules.rightPart1] || [] 
    const rulesPart2 =  resultData[algorithmConfig.rules.rightPart2] || [] 

  //  console.log('rules1', rulesPart1)
   // console.log('rules2', rulesPart2)


    const lenght1 = algorithmConfig.parts_sizes2.rightPart1
    const lenght2 = algorithmConfig.parts_sizes2.rightPart2
    
 


    let D = this.kitchenSizesStore.oven.size;
    let P = this.kitchenSizesStore.dishwasher.size;



    rulesPart1.forEach((rule) => {
     
     
      let matchLength = rule.l == lenght1;
  
      let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;

    

      if (matchLength && matchDishwasher && matchOven) {
         algorithmConfig.filtredRules.rightPart1.push(rule);
      }
    });

      rulesPart2.forEach((rule) => {
    
  
      const matchLength = rule.l == lenght2;
      let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;

      

      if (matchLength && matchDishwasher && matchOven ) {
         algorithmConfig.filtredRules.rightPart2.push(rule);
      }
    });
    this.variantRight(0)
  }


 

  

  deleteDirect() {
     plannerConfig.namesToDeleteDirect.forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
    //this.NamesToDeleteDirect.length = 0;
    plannerConfig.namesToDeleteDirect.length = 0 
    const filtred1 = algorithmConfig.resultDirect.filter(item=> ["b1000left", "module-sink-1000"].includes(item.key))
    algorithmConfig.resultDirect = filtred1
  }

  deleteLeft() {
    plannerConfig.namesToDeleteLeft.forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
    //this.NamesToDeleteLeft.length = 0;
    plannerConfig.namesToDeleteLeft.length = 0

    const filtred1 = algorithmConfig.resultLeft.filter(item=> ["b1000left", "module-sink-1000"].includes(item.key))
    algorithmConfig.resultLeft = filtred1

  }

  deleteNamesFromPlanner(){
   // console.log(namesToDelete)
       plannerConfig.namesToDelete.forEach((name) => {
      this.scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
    plannerConfig.namesToDelete.length = 0;
  }

  tableTopvisible() {
      const array = [...plannerConfig.modelsDirect, ...plannerConfig.modelsLeft]
    array.forEach((model) => {
      model.root.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes("tabletop")) {
          child.visible = false;
        }
      });
    });
  }

 canFit(part, sizes) {
  const total = sizes.reduce((a, b) => a + b, 0);
  return part.width >= total;
}

}
