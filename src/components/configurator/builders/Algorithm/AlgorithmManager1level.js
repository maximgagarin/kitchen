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


 

    this.deleteNamesFromPlanner()

    plannerConfig.models.length = 0
    plannerConfig.modelsDirect.length = 0
    plannerConfig.modelsLeft.length = 0
    plannerConfig.modelsRight.length = 0

 
   const filtred1 = algorithmConfig.resultLeft.filter(item=> ["b1000left", "module-sink-1000", "m", "b1000", "module-sink-1000-left"].includes(item.key))
   const filtred2 = algorithmConfig.resultDirect.filter(item=> ["b1000left", "module-sink-1000", "m", "b1000", "module-sink-1000-left"].includes(item.key))
   const filtred3 = algorithmConfig.resultRight.filter(item=> ["b1000left", "module-sink-1000", "m", "b1000", "module-sink-1000-left"].includes(item.key))


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

  moviePenal(side){
    console.log('сторона', side)
  }


  currectSizes(newRules){
    newRules.forEach(rule=>{
      if((rule.rule === 'духовка' || rule.rule === 'посудомойка') && 
      (rule.moduleSize === 0.45 && (rule.length === 0.7 || rule.length === 0.50 , rule.length === 0.55 ))||
      (rule.moduleSize === 0.60 && (rule.length === 0.85 || rule.length === 0.65 , rule.length === 0.70 ))
    ){
        console.log('размер не подходит')
        const newSize = Number((rule.length -= 0.05).toFixed(2))
        rule.length = newSize
        this.moviePenal(rule.side)

      } else if((rule.rule === 'угл мк и дух слева') &&
        (rule.moduleSize === 0.90 && (rule.length === 0.95 || rule.length === 1 , rule.length === 1.15 ))||
        (rule.moduleSize === 1.05 && (rule.length === 1.1 || rule.length === 1.15 , rule.length === 1.3 ))
        (rule.moduleSize === 1.2 && (rule.length === 1.25 || rule.length === 1.3 , rule.length === 1.45 ))
     ){
        console.log('размер не подходит')
        const newSize = Number((rule.length -= 0.05).toFixed(2))
        rule.length = newSize
        this.moviePenal(rule.side)

      } else if(rule.rule === 'без дх и пм' && rule.length === 0.25){
        const newSize = Number((rule.length -= 0.05).toFixed(2))
        rule.length = newSize
        this.moviePenal(rule.side)

      }
    })
  }
 
 

  new(value = 0){
    this.clear()
    const rule = this.kitchenSizesStore.filtredRulesTotal[0]
    console.log('value', value)
    console.log(rule)
    this.algStore.variants = rule.variants
    const variant = rule.variants[value]

    console.log('varaint', variant)
  
    const newRules = []

    variant.forEach(variant=>{
      if (variant.modules.length === 2){
        const module1size = variant.modules[0].size 
        const module2size = variant.modules[1].size 
        const totalSize = module1size + module2size
         newRules.push({side:variant.name, rule: this.rules['ovenDish'] , length:variant.width , moduleSize:totalSize})
      }
        
      if(variant.modules.length === 0) newRules.push({side:variant.name, rule: this.rules['clean'] , length:variant.width  })
      if(variant.modules.length === 1) {
        const moduleName = variant.modules[0].name 
        const moduleSize = variant.modules[0].size 
        newRules.push({side:variant.name, rule:this.rules[moduleName] , length:variant.width , moduleSize:moduleSize })
      }
    })

    this.currectSizes(newRules)
  
    console.log('newRules' , newRules)

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


 


  currectSizes2(){

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
    const direct2parts = algorithmConfig.direct2parts
    this.deleteDirect();
    plannerConfig.modelsDirect.length = 0
    const reverse = this.algStore.reverse   // реверс модулей
    const sinkLocation = this.kitchenSizesStore.sink.location


    let rule = this.algStore.filtredDirectPart1[variant];
    let rule2 = this.algStore.filtredDirectPart2[variant2];

     //   algorithmConfig.resultDirect.splice(1, 0, ...result)


 
    if(rule){
       let result = Object.entries(rule).map(([key, value]) => ({ key, value }));  
       if(sinkLocation === 'directCorner') algorithmConfig.resultDirect.push(...result);
       if(sinkLocation !=='directCorner')  algorithmConfig.resultDirect.unshift(...result);
    } else {
      this.plannerStore.showError();
      console.log('нет правил')
    }





    if(direct2parts){
       if(rule2){
          let result2 = Object.entries(rule2).map(([key, value]) => ({ key, value }));

          if(reverse.A2) {
            console.log('reverse2')
           result2.reverse()
          } 
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

      let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;

     //let matchDishwasher  =  rule.p == P 
   //  let matchOven =  rule.d == D 


      if (matchLength && matchDishwasher && matchOven ) {
         this.algStore.filtredDirectPart1.push(rule);
      }
    });


      rulesPart2.forEach((rule) => {
      const matchLength = rule.l == length2;
      let matchDishwasher  = "p" in rule ? rule.p == P : true;
      let matchOven = "d" in rule ? rule.d == D : true;
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
    const filtred1 = algorithmConfig.resultDirect.filter(item=> ["b1000left", "module-sink-1000", "module-sink-1000-left", "b1000", "m"].includes(item.key))
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

    const filtred1 = algorithmConfig.resultLeft.filter(item=> ["b1000left", "module-sink-1000", "module-sink-1000-left", "b1000"].includes(item.key))
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


}
