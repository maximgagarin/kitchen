import { plannerConfig } from "./planerConfig";
import * as THREE from "three";
import { Line } from "./Line";
import { ModelInstanse } from "./ModelInstanse";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { PenalInstanse } from "./PenalInstanse";
import { SinkInstanse } from "./SinkInstanse";



export class EmptyManager {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.plannerStore = usePlannerStore();
    this.kitchenStore = useKitchenSizesStore();
  }

  calculateEmpties() {
    let name = "emptyBoxDirect";

    this.removeObjectsByName(name);

    // const filtredirectRight = plannerConfig.penalsArray.filter(
    //   (penal) => penal.side == "directRight"
    // );
    // const filtredirectLeft = plannerConfig.penalsArray.filter(
    //   (penal) => penal.side == "directLeft"
    // );

    // plannerConfig.modelsDirect.push(...filtredirectRight);
    // plannerConfig.modelsDirect.push(...filtredirectLeft);
    //  plannerConfig.modelsLeft.push(...filtredLeft)

    plannerConfig.emptiesObjects.length = 0;
    plannerConfig.iconsArray  = plannerConfig.iconsArray.filter(icon => icon.name == 'left')
  
    plannerConfig.modelsDirect.sort((a, b) => a.root.position.x - b.root.position.x);
  //  console.log('modelsDirectSort', plannerConfig.modelsDirect)
    //   находим пустоты между модулями прямоого ряда 
    for (let i = 0; i < plannerConfig.modelsDirect.length - 1; i++) {
      const current = plannerConfig.modelsDirect[i];
      const next = plannerConfig.modelsDirect[i + 1];
      if (next.root.position.x -  next.width / 2 - (current.root.position.x + current.width / 2) >  0.15 ) {
        //   console.log("yes");
        let distance = Number( next.root.position.x -  next.width / 2 -(current.root.position.x + current.width / 2)).toFixed(3);
        let position = Number(current.root.position.x + current.width / 2 + distance / 2).toFixed(3);
        plannerConfig.emptiesObjects.push({
          width: distance,
          position: position,
        });
      }
    }

    // console.log('послу у',plannerConfig.modelsDirect);

    // 
    // const objectWithMinX = plannerConfig.modelsDirect.reduce((min, current) =>
    //   current.root.position.x < min.root.position.x ? current : min
    // );

    // const objectWithMaxX = plannerConfig.modelsDirect.reduce((min, current) =>
    //   current.root.position.x > min.root.position.x ? current : min
    // );

    const objectWithMinX = plannerConfig.modelsDirect[0]
    const objectWithMaxX = plannerConfig.modelsDirect[plannerConfig.modelsDirect.length-1]



    //  левая пустота если прямая кухня
    if (this.kitchenStore.type == "direct") {
      if (objectWithMinX.root.position.x - objectWithMinX.width / 2 > 0.15) {
        plannerConfig.emptiesObjects.push({
          width: Number((objectWithMinX.root.position.x - objectWithMinX.width / 2).toFixed(3)),
          position: Number((objectWithMinX.root.position.x - objectWithMinX.width / 2).toFixed(3) / 2 ),
        });
      }
      // console.log('objectWithMinX' , objectWithMinX)
      //console.log('objectWithMaxX' , objectWithMaxX)
    }

    let leftEdge = objectWithMinX.root.position.x - objectWithMinX.width / 2 
    let limit

    
     if(plannerConfig.isAngleRow == 'left' && leftEdge > 0.75){
      limit = 0.75
     }
     if(plannerConfig.isAngleRow == 'direct' && leftEdge > 0.15){
      limit = 0.15
     }
     if(plannerConfig.isAngleRow == 'none' && leftEdge > 0.15){
      limit = 0.15
     }
    

    //левая пустота если угловая кухня
    if (this.kitchenStore.type == "left") {
      if (leftEdge > limit) {
        let distance, position
        if(plannerConfig.isAngleRow == 'left'){
          console.log(objectWithMinX.root.position.x)
          console.log(objectWithMinX)
          distance = Number((objectWithMinX.root.position.x - 0.6 -objectWithMinX.width / 2).toFixed(3));
          position = Number((objectWithMinX.root.position.x -objectWithMinX.width/2 - distance/2  ).toFixed(3))
          console.log('position', position)
        }
        if(plannerConfig.isAngleRow == 'direct'){
          distance = Number((objectWithMinX.root.position.x  -objectWithMinX.width / 2).toFixed(3));
          position = Number((distance/2).toFixed(3))
        }
        if(plannerConfig.isAngleRow == 'none'){
          distance = Number((objectWithMinX.root.position.x  -objectWithMinX.width / 2).toFixed(3));
          position = Number((distance/2).toFixed(3))
        }
      
        plannerConfig.emptiesObjects.push({
          width: distance,
          position:  position,
        });
      }
    }

    //правая пустота
    if (this.kitchenStore.sideSizes.side_a - (objectWithMaxX.root.position.x + objectWithMaxX.width / 2) > 0.15 ) {
      let distance =  this.kitchenStore.sideSizes.side_a - (objectWithMaxX.root.position.x + objectWithMaxX.width / 2);
      plannerConfig.emptiesObjects.push({
        width:
          this.kitchenStore.sideSizes.side_a -
          (objectWithMaxX.root.position.x + objectWithMaxX.width / 2),
        position:
          objectWithMaxX.root.position.x +
          objectWithMaxX.width / 2 +
          distance / 2,
      });
    }

    //удаление пеналов из общего массива прямых
    // for (let i = plannerConfig.modelsDirect.length - 1; i >= 0; i--) {
    //   if (plannerConfig.modelsDirect[i].name == "penal") {
    //     plannerConfig.modelsDirect.splice(i, 1);
    //   }
    // }

   

    plannerConfig.boxesArrayDirect.length = 0;

    let boxSide = "direct";

    plannerConfig.emptiesObjects.forEach((elem) => {
      this.createEmptyBox(elem.width, elem.position, boxSide);
    });
  }

  calculateEmptiesLeft() {
    let name = "emptyBoxLeft";

    this.removeObjectsByName(name);
  //  const filtredLeft = plannerConfig.penalsArray.filter((penal) => penal.side == "left");

  

  //  plannerConfig.modelsLeft.push(...filtredLeft);

    //поиск промежутка больше 15 между модулями
    plannerConfig.emptiesObjectsLeft.length = 0;
    plannerConfig.iconsArray  = plannerConfig.iconsArray.filter(icon => icon.name == 'direct')

    plannerConfig.modelsLeft.sort((a, b) => a.root.position.z - b.root.position.z );

    for (let i = 0; i < plannerConfig.modelsLeft.length - 1; i++) {
      const current = plannerConfig.modelsLeft[i];
      const next = plannerConfig.modelsLeft[i + 1];
      if (next.root.position.z - next.width / 2 - (current.root.position.z + current.width / 2) >  0.15  ) {
    
        let distance = Number(next.root.position.z -  next.width / 2 - (current.root.position.z + current.width / 2)).toFixed(3);
        let position = Number(current.root.position.z + current.width / 2 + distance / 2 ).toFixed(3); plannerConfig.emptiesObjectsLeft.push({
          width: distance,
          position: position,
        });
      }
    }

    // const objectWithMaxZ = plannerConfig.modelsLeft.reduce((min, current) =>
    //   current.root.position.z > min.root.position.z ? current : min
    // );

    const objectWithMaxZ = plannerConfig.modelsLeft[plannerConfig.modelsLeft.length-1]
    const objectWithMinZ = plannerConfig.modelsLeft[0]


    //    //левая пустота
    if (this.kitchenStore.sideSizes.side_c -(objectWithMaxZ.root.position.z + objectWithMaxZ.width / 2) >0.15 ) {
      let distance =  this.kitchenStore.sideSizes.side_c - (objectWithMaxZ.root.position.z + objectWithMaxZ.width / 2);
      plannerConfig.emptiesObjectsLeft.push({
        width: distance,
        position:   objectWithMaxZ.root.position.z +  objectWithMaxZ.width / 2 +   distance / 2,  });
    }

    //правая пустота
     let limit
     const rightEdge = objectWithMinZ.root.position.z -  objectWithMinZ.width / 2 
     if(plannerConfig.isAngleRow == 'left' && rightEdge > 0.15){
      limit = 0.15
     }
     if(plannerConfig.isAngleRow == 'direct' && rightEdge > 0.75){
      limit = 0.75
     }
     if(plannerConfig.isAngleRow == 'none' && rightEdge > 0.15){
      limit = 0.15
     }

     if (rightEdge  >  limit ) {
      let distance, position
      if(plannerConfig.isAngleRow == 'left'){
         distance =   objectWithMinZ.root.position.z - objectWithMinZ.width / 2;
         position = distance / 2
      }
      if(plannerConfig.isAngleRow == 'direct'){
         distance =   objectWithMinZ.root.position.z - objectWithMinZ.width / 2 - 0.6
         position =  objectWithMinZ.root.position.z - objectWithMinZ.width / 2 - distance/2
      }
      if(plannerConfig.isAngleRow == 'none'){
         distance =   objectWithMinZ.root.position.z - objectWithMinZ.width / 2;
         position = distance / 2
      }
      
      plannerConfig.emptiesObjectsLeft.push({
        width: distance,
        position: position  });
    }

    // удаляем пенал
    // for (let i = plannerConfig.modelsLeft.length - 1; i >= 0; i--) {
    //   if (plannerConfig.modelsLeft[i].name == "penal") {
    //     plannerConfig.modelsLeft.splice(i, 1);
    //   }
    // }

    plannerConfig.boxesArrayLeft.length = 0;

    let boxSide = "left";

    plannerConfig.emptiesObjectsLeft.forEach((elem) => {
      this.createEmptyBox(elem.width, elem.position, boxSide);
    });
  }

  createEmptyBox(width, position, boxSide) {
    let isLeft = boxSide == "left";
    let posX = isLeft ? 0.3 : Number(position);
    let posZ = isLeft ? Number(position) : 0.3;
   
    const icon = this.loaderModels.get('icon')
    icon.visible = true
   

    
  

  

   

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.854, 0.6),
      new THREE.MeshBasicMaterial({
       color: 0x00ff00,
        opacity: 0,
        transparent: true
      })
    );

      box.userData = {
      side: isLeft ? "left" : "direct",
      position,
      width, 
      id: THREE.MathUtils.generateUUID()
    }

  //  box.visible = false

   

    box.position.set(posX, 0.427, posZ);
    box.name = isLeft ? "emptyBoxLeft" : "emptyBoxDirect";
    box.userData.side = isLeft ? "left" : "direct";
    isLeft
      ? plannerConfig.boxesArrayLeft.push(box)
      : plannerConfig.boxesArrayDirect.push(box);

    
  
    box.add(icon)

   

    icon.visible = true
    icon.name = isLeft ? "left" : "direct"
   
    icon.position.set(0, 0.6, -0.29)

    plannerConfig.iconsArray.push(icon)

    const lineHotizontal = new Line(
      this.sceneSetup,
      { x: -width / 2, y: 0.3, z: -0.3 },
      { x: width / 2, y: 0.3, z: -0.3 },
      0.4,
      1
    );
    box.add(lineHotizontal.group);
    box.rotation.y = isLeft ? Math.PI / 2 : 0;

    this.scene.add(box);
    // console.log(boxesArray)
  }




  calcEmtyForPenal(intersect){
    //вычисление можно ли вставить пенал, или только пенал


   const currentX = intersect.position.x;
   const currentZ = intersect.position.z;

   console.log('currentX', currentX)
   console.log('currentZ', currentZ)


    let leftModule = null;
    let rightModule = null;

    let closestLeft = -Infinity;
let closestRight = Infinity;
    
    let leftModuleZ = null;
    let rightModuleZ = null;

   for (let module of plannerConfig.modelsDirect) {
  const x = module.root.position.x;

  if (x < currentX && x > closestLeft) {
    closestLeft = x;
    leftModule = module;
  }

  if (x > currentX && x < closestRight) {
    closestRight = x;
    rightModule = module;
  }
}

      for (let module of plannerConfig.modelsLeft) {
      const z = module.root.position.z;
      if (z < currentZ) rightModuleZ = module;
      if (z > currentZ) leftModuleZ = module;
      if (rightModuleZ && leftModuleZ) break;
    }

    console.log('leftZ', leftModuleZ)
    console.log('rightZ', rightModuleZ)

    console.log('left', leftModule)
    console.log('right', rightModule)




    this.plannerStore.onlyPenal = false;
    this.plannerStore.anyModule = false;


    if (rightModuleZ && rightModuleZ.name === 'penal') {
      this.plannerStore.onlyPenal = true;
    }

    if (leftModuleZ && leftModuleZ.name == 'penal' && rightModuleZ && rightModuleZ.name !== 'penal') {
      this.plannerStore.anyModule = true;
    }

    if (rightModuleZ && !leftModuleZ) {
      this.plannerStore.anyModule = true;
    }





    if (leftModule && leftModule.name === 'penal') {
      this.plannerStore.onlyPenal = true;
    }

    if (leftModule && leftModule.name !== 'penal' && rightModule && rightModule.name === 'penal') {
      this.plannerStore.anyModule = true;
    }

    if (leftModule && !rightModule) {
      this.plannerStore.anyModule = true;
    }

    if(this.kitchenStore.type == 'direct'){
      if (!leftModule && rightModule.name !=='penal') {
        console.log('1')
      this.plannerStore.anyModule = true;
      }
      if(!leftModule && rightModule.name == 'penal'){
        console.log('2')

        this.plannerStore.onlyPenal = true;
      }
      if(leftModule && leftModule.name == 'penal' && rightModule && rightModule.name !== 'penal'){
        console.log('3')
        this.plannerStore.anyModule = true;
         this.plannerStore.onlyPenal = false;
      }
    }
    

  }

  addToEmpty(type, width, penal = null) {
        const id = THREE.MathUtils.generateUUID()
    
    console.log(type)
    console.log(width)
    console.log('penal', penal)


  

    let isLeft,   oldInstance,  oldindex, oldside;
    
    let position = plannerConfig.selectedEmpty.position.clone();
    position.y = 0;
    console.log(position);

    oldside = plannerConfig.selectedEmpty.userData.side;
    isLeft = plannerConfig.selectedEmpty.userData.side == 'left';


  
    // oldindex = 1;

    if (isLeft){
    position.z = Number(plannerConfig.selectedEmpty.position.z);
    position.x = 0.3

    }
    if(!isLeft){
    position.x = Number(plannerConfig.selectedEmpty.position.x);
    position.z = 0.3

    }

   console.log(position);

   let cabinetName

   console.log('type', type)

   
  
  

     
    if(penal){
      console.log('1')
          cabinetName = `penal${width*1000}-${type}`;
    } else {
      console.log('2')

      //если мойка
      type === 'ms' ? cabinetName = `${type}${width * 1000}` : cabinetName = `${type}-${width * 1000}`;
    }

    console.log('cabname', cabinetName)

    const cabinetOriginal = this.loaderModels.get(cabinetName);

    if (!cabinetOriginal) {
      alert("Модель не найдена");
      return;
    }

    // Временная копия для проверки
    const cabinetClone = cabinetOriginal.clone(true);
    const testInstance = new ModelInstanse(cabinetClone);
    testInstance.root.position.copy(position);
    //  console.log(testInstance.root.position);
    testInstance.root.rotation.y = isLeft ? Math.PI / 2 : 0;

    testInstance.slot = oldindex;

    const collision = this.checkCollision(testInstance);

    if (collision) {
      this.plannerStore.showError();
      return;
    }

    const cabinet = this.loaderModels.get(cabinetName);
   
    plannerConfig.namesToDelete.push(cabinetName);
    cabinet.visible = true;

   //добавление в массив для уделания при смене варианта
    const nameToDelete = cabinetName + isLeft? '-left': '-direct'
  
    cabinet.name = nameToDelete;
    isLeft?   plannerConfig.namesToDeleteLeft.push(nameToDelete) :   plannerConfig.namesToDeleteDirect.push(nameToDelete)


    let instance
   

    if(type === 'ms'){
       instance = new SinkInstanse(cabinet, this.sceneSetup);
       instance.name = 'm'
    } else if(type !== 'ms' && penal){
      instance = new PenalInstanse(cabinet);
      instance.name = 'penal';
    } else if(type !== 'ms' && !penal){
      instance = new ModelInstanse(cabinet, this.sceneSetup);
      instance.name = type;
    }
      
      
      
      
      
      
      
    

    
    instance.side = oldside;
    instance.level = 1
    instance.id = id
    instance.fullname = cabinetName
    instance.raycasterBox.userData.id = id
    cabinet.position.copy(position);
    cabinet.rotation.y = isLeft ? Math.PI / 2 : 0

    plannerConfig.selectedObject = instance;
    plannerConfig.models.push(instance);

    if (isLeft) {
      console.log('push to left')
      plannerConfig.modelsLeft.push(instance);
    }
    if (!isLeft) {
      plannerConfig.modelsDirect.push(instance);
    }

  
    


    this.scene.add(cabinet);

    this.plannerStore.selectedObject.isSelect = false;
    this.plannerStore.selectedObject.name = false;
    this.plannerStore.objectMenu = false
    plannerConfig.selectedObject = false
    plannerConfig.selectedEmpty = false

   // this.calculateSlotPositions();
    this.sceneSetup.requestRender();
    //   console.log(this.scene)
  }

  removeObjectsByName(name) {
    const objectsToRemove = [];

    // 1. Находим все объекты с указанным именем
    this.scene.traverse((object) => {
      if (object.name === name) {
        objectsToRemove.push(object);
      }
    });

    // 2. Удаляем объекты и очищаем ресурсы
    objectsToRemove.forEach((object) => {
      if (object.parent) {
        object.parent.remove(object);
      }

      // Очистка ресурсов
      if (object.geometry) object.geometry.dispose();

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    //   console.log(`Удалено объектов: ${objectsToRemove.length}`);
  }

  removeObjectById(targetId) {
    let objectToRemove = null;

    // Ищем объект
    this.scene.traverse((child) => {
      if (child.userData?.id === targetId) {
        objectToRemove = child;
      }
    });

    // Удаляем если найден
    if (objectToRemove && objectToRemove.parent) {
      // Очищаем ресурсы (геометрию, материалы)
      if (objectToRemove.geometry) objectToRemove.geometry.dispose();

      if (objectToRemove.material) {
        if (Array.isArray(objectToRemove.material)) {
          objectToRemove.material.forEach((m) => m.dispose());
        } else {
          objectToRemove.material.dispose();
        }
      }

      // Удаляем из сцены
      objectToRemove.parent.remove(objectToRemove);
      return true; // Успешно удален
    }

    return false; // Не найден
  }

  checkSimpleCollision(testInstance) {
    const isLeft = plannerConfig.selectedEmpty.userData.side === "left";
    const gap = 0.005;

    const pos = isLeft
      ? testInstance.root.position.z
      : testInstance.root.position.x;

    const size = isLeft
      ? testInstance.objectSize.x // ширина вдоль Z → размер по X
      : testInstance.objectSize.x; // ширина вдоль X → размер по Z

    const testMin = pos - size / 2 + gap;
    const testMax = pos + size / 2 - gap;

    let modelsArray = isLeft? plannerConfig.modelsLeft : plannerConfig.modelsDirect

  //  console.log('isLeft', isLeft)
  //  console.log('modelsArray', modelsArray)

    for (let model of modelsArray) { // почему когда ставлю modelsArray неправильно работает 
      if (model.root.uuid === testInstance.root.uuid) continue;

      const modelPos = isLeft ? model.root.position.z : model.root.position.x;

      let modelSize = isLeft ? model.objectSize.x : model.objectSize.x;

      if (model.name == "m" && !isLeft) modelSize = 0.6;

      const min = modelPos - modelSize / 2 + gap;
      const max = modelPos + modelSize / 2 - gap;

      const intersects = !(testMax <= min || testMin >= max);
      if (intersects) {
        console.log("Упрощённая коллизия!");
        return true;
      }
    }

    return false;
  }



  checkCollision(testInstance) {
    
      let modelsArray = plannerConfig.models
      const gap = 0.01;
  
      const selectedBox = new THREE.Box3().setFromObject(testInstance.root);
      selectedBox.expandByScalar(-gap); // уменьшаем на зазор
  
     // console.log("selected", selectedBox);
  
      for (let model of modelsArray) {
        if (model.root.uuid === testInstance.root.uuid) continue;
        const otherBox = new THREE.Box3().setFromObject(model.root);
      //  console.log('otherBox', otherBox)
        //  otherBox.expandByScalar(gap); // увеличиваем на зазор
  
        if (selectedBox.intersectsBox(otherBox)) {
          console.log("коллизия с учётом зазора!");
          console.log("selectedBox", selectedBox);
          console.log("other", otherBox);
  
          return true;
        }
      }
  
      return false;
  }
}
