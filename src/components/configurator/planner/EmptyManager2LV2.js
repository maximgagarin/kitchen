import { plannerConfig } from "./planerConfig";
import * as THREE from "three";
import { Line } from "./Line";
import { ModelInstanse2L } from "./ModelInstanse2L";
import { usePlannerStore } from "../../../pinia/PlannerStore";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../pinia/penals";

export class EmptyManager2L {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.plannerStore = usePlannerStore();
    this.kitchenStore = useKitchenSizesStore();
    this.rules  = {
      gapBox:{
        pos:1.41,
        side:'direct',
        rotation:0

      },
      gapBox2:{
        pos:1.76,
        side:'direct',
        rotation:0

      },
      gapBoxLeft:{
        pos:1.41,
        side:'left',
        rotation:Math.PI/2
      },
      gapBoxLeft2:{
        pos:1.76,
        side:'left',
        rotation:Math.PI/2

      },

    }
    this.addToArrays  = {
      direct:(instance)=>{
        plannerConfig.modelsDirect2L.push(instance)
        plannerConfig.models.push(instance)
      },
      left:(instance)=>{
        plannerConfig.modelsLeft2L.push(instance)
        plannerConfig.models.push(instance)       
      }
    }
  }


  createGapBoxes(models, options) {
      const { boxName, side, posY } = options;

      let totalWidth = side === 'direct' ? 3 : 2.75;
      this.removeObjectsByName(boxName);

      // Словарь для фильтрации
      const filterMap = {
          'direct_1.59': () => plannerConfig.empties2levelDirect = plannerConfig.empties2levelDirect.filter(el => el.name === 'gapBox2'),
          'direct_1.93': () => plannerConfig.empties2levelDirect = plannerConfig.empties2levelDirect.filter(el => el.name === 'gapBox'),
          'left_1.59': () => plannerConfig.empties2levelLeft = plannerConfig.empties2levelLeft.filter(el => el.name === 'gapBoxLeft2'),
          'left_1.93': () => plannerConfig.empties2levelLeft = plannerConfig.empties2levelLeft.filter(el => el.name === 'gapBoxLeft'),
      };

      const key = `${side}_${posY}`;
      if (filterMap[key]) {
          filterMap[key]();
      } else {
          console.warn(`No filter rule for side=${side}, posY=${posY}`);
      }

      if (models.length === 0) return;

      let axis = side === 'direct' ? 'x' : 'z';

      // Добавление промежутков
      for (let i = 0; i < models.length - 1; i++) {
          const current = models[i];
          const next = models[i + 1];
          const box1 = new THREE.Box3().setFromObject(current.raycasterBox);
          const box2 = new THREE.Box3().setFromObject(next.raycasterBox);

        //  console.log('box1', box1)
        //  console.log('box2', box2)


          const rightEdge = box1.max[axis];
          const leftEdgeNext = box2.min[axis];

          if (leftEdgeNext - rightEdge > 0.15) {
              this.addGapBox(rightEdge, leftEdgeNext, box1, posY, side);
          }
      }

      // Левый край
      const firstBox = new THREE.Box3().setFromObject(models[0].raycasterBox);
      if (firstBox.min[axis] > 0.15) {
          this.addGapBox(0, firstBox.min[axis], firstBox, posY, side);
      }

      // Правый край
      const lastBox = new THREE.Box3().setFromObject(models[models.length - 1].raycasterBox);
      if (totalWidth - lastBox.max[axis] > 0.15) {
          this.addGapBox(lastBox.max[axis], totalWidth, lastBox, posY, side);
      }
  }


 

  addGapBox(startX, endX, referenceBox, posY, side) {
      const icon = this.loaderModels.get('icon')
      icon.visible = false;

      const gap = endX - startX;
      if (gap <= 0) return;

      const geometry = new THREE.BoxGeometry(gap, 0.35, 0.3);
      const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          opacity: 0,
          transparent: true
      });
      const gapBox = new THREE.Mesh(geometry, material);

      // === Используем словарь для имен и массивов ===
      const gapConfigMap = {
          'direct_1.59': { name: 'gapBox', arr: plannerConfig.empties2levelDirect },
          'direct_1.93': { name: 'gapBox2', arr: plannerConfig.empties2levelDirect },
          'left_1.59': { name: 'gapBoxLeft', arr: plannerConfig.empties2levelLeft },
          'left_1.93': { name: 'gapBoxLeft2', arr: plannerConfig.empties2levelLeft },
      };

      const key = `${side}_${posY}`;
      const config = gapConfigMap[key];
      if (!config) {
          console.warn(`No gap config found for side=${side}, posY=${posY}`);
          return;
      }

      gapBox.name = config.name;
      config.arr.push(gapBox);

      gapBox.add(icon);

      if (side === 'left') gapBox.rotation.y = Math.PI/2;

      // позиция
      if (side === 'direct') gapBox.position.set(startX + gap / 2, posY, 0.15);
      if (side === 'left') gapBox.position.set(0.15, posY + 0.01, startX + gap / 2);

      this.scene.add(gapBox);
  }





  



  calculateEmpties() {
    let name = "emptyBoxDirect";

 // DIRECT
    const modelsDirectBig = plannerConfig.modelsDirect2L.filter(el => el.level == 2 && el.objectSize.y > 0.36);
    const modelsDirectSmall1 = plannerConfig.modelsDirect2L.filter(el => el.objectSize.y < 0.36 && el.root.position.y < 1.45);
    const modelsDirectSmall2 = plannerConfig.modelsDirect2L.filter(el => el.objectSize.y < 0.36 && el.root.position.y > 1.45);


    modelsDirectSmall1.push(...modelsDirectBig);
    modelsDirectSmall2.push(...modelsDirectBig);

    
    modelsDirectSmall1.sort((a, b) => a.root.position.x - b.root.position.x);
    modelsDirectSmall2.sort((a, b) => a.root.position.x - b.root.position.x);

   // console.log(modelsDirectSmall1)
  //  console.log(modelsDirectSmall2)

    this.createGapBoxes(modelsDirectSmall1, {
        boxName: 'gapBox',
        boxNameDelete: 'gapBox2',

        side:'direct',
        posY: 1.59,
    });

        this.createGapBoxes(modelsDirectSmall2, {
        boxName: 'gapBox2',
        boxNameDelete: 'gapBox',

        side:'direct',
        posY: 1.93,
    });


    const modelsLeftBig = plannerConfig.modelsLeft2L.filter(el => el.level == 2 && el.objectSize.y > 0.36);
    const modelsLeftSmall1 = plannerConfig.modelsLeft2L.filter(el => el.objectSize.y < 0.36 && el.root.position.y < 1.45);
    const modelsLeftSmall2 = plannerConfig.modelsLeft2L.filter(el => el.objectSize.y < 0.36 && el.root.position.y > 1.45);

    modelsLeftSmall1.push(...modelsLeftBig);
    modelsLeftSmall2.push(...modelsLeftBig);

   
    modelsLeftSmall1.sort((a, b) => a.root.position.z - b.root.position.z);
    modelsLeftSmall2.sort((a, b) => a.root.position.z - b.root.position.z);


  //  console.log(modelsLeftSmall1)
   // console.log(modelsLeftSmall2)

    this.createGapBoxes(modelsLeftSmall1, {
        boxName: 'gapBoxLeft',
        boxNameDelete: 'gapBoxLeft2',

        side:'left',
        posY: 1.59,
    });

    this.createGapBoxes(modelsLeftSmall2, {
        boxName: 'gapBoxLeft2',
        boxNameDelete: 'gapBoxLeft',

        side:'left',
        posY: 1.93,
    });








   // console.log(modelslevel1)
  //  console.log(modelslevel2)


   
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

   // console.log(`Удалено объектов: ${objectsToRemove.length}`);
  }

  deleteUnComboButton(controls){
       const index = controls.findIndex(
      (m) => m.name === 'ungroupCombo'
    );

    if (index !== -1) {
      controls.splice(index, 1);
    }
  }



  addToEmpty(type, width){
    const box = plannerConfig.selectedEmpty2L
    console.log(box)

    const rule = this.rules[box.name]


    if(type == 'p'){
      let model = this.loaderModels.get('p400')
      const collision = this.prepareToCollisionBig(model)
      console.log(collision)
     if(collision){
        model.visible = true
        const position = box.position.clone()
        const instance = new ModelInstanse2L(model, this.sceneSetup)
      //  model.position.copy(position)
        model.position.x = collision
        model.position.z = 0.15
        this.scene.add(model)
        model.position.y = 1.415
        instance.level = 2
        instance.side = 'direct'
        instance.name = 'p400'

        this.addToArrays[rule.side](instance)
       
  
        plannerConfig.selectedEmpty2L = false
        plannerConfig.empties2levelDirect.length = 0
        plannerConfig.empties2levelLeft.length = 0

        this.calculateEmpties()
        this.sceneSetup.requestRender()
     }
    }

    if(type == 'o'){
      const position = box.position.clone()
      console.log(position)
      let model = this.loaderModels.get('ПЛВ-400')
      const collision = this.prepareToCollision(model)
      console.log('collis', collision)
      if(!collision){
         const instance = new ModelInstanse2L(model, this.sceneSetup)
         
        instance.level = 2

        if(rule.side == 'direct')  instance.side = 'direct'
        if(rule.side == 'left')  instance.side = 'left'

        this.addToArrays[rule.side](instance)
         model.visible = true
         model.position.copy(position)
        
         model.position.y = this.rules[box.name].pos
         model.rotation.y = this.rules[box.name].rotation

         if(instance.root.position.y > 1.65) instance.sublevel = 2
         if(instance.root.position.y < 1.45) instance.sublevel = 1
         if(!instance.isCombo) this.deleteUnComboButton(instance.controls)
         this.scene.add(model)
        console.log('instance', instance)
      }
    
    }
  
  }

  prepareToCollision(model){
    let box = plannerConfig.selectedEmpty2L
    const cabinetClone = model.clone(true);
    const instance = new ModelInstanse2L(cabinetClone, this.sceneSetup)
    const position = plannerConfig.selectedEmpty2L.position.clone()
    cabinetClone.position.copy(position)
    cabinetClone.position.y = this.rules[box.name].pos

    console.log('cabinetClone.position', cabinetClone.position)

  
  //  const collision = this.checkSimpleCollision(instance);
  //  this.checkCollision(instance)
  //  console.log('collisin', collision)
    const collision = this.checkCollision(instance)
    console.log('collision', collision)
    return collision
  }

  prepareToCollisionBig(model){
    const cabinetClone = model.clone(true);
    const instance = new ModelInstanse2L(cabinetClone, this.sceneSetup)
    const position = plannerConfig.selectedEmpty2L.position.clone()
    position.y = 1.415
    cabinetClone.position.copy(position)
    const freeX = this.resolveCollisionX(instance, 0, 3)
    console.log('freeX', freeX)
    return freeX


  }

  checkSimpleCollision(testInstance) {
    let isLeft = false
    const gap = 0.005;

    const pos = isLeft
      ? testInstance.root.position.z
      : testInstance.root.position.x;

    const size = isLeft
      ? testInstance.objectSize.x // ширина вдоль Z → размер по X
      : testInstance.objectSize.x; // ширина вдоль X → размер по Z

    const testMin = pos - size / 2 + gap;
    const testMax = pos + size / 2 - gap;

    let modelsArray = isLeft? plannerConfig.modelsLeft2L : plannerConfig.modelsDirect2L

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
    let box = plannerConfig.selectedEmpty2L

    const arrays = {
      'direct':plannerConfig.modelsDirect2L,
      'left':plannerConfig.modelsLeft2L,
    }

    const rule = this.rules[box.name]
    console.log('rule', rule)
    const modelsArray = arrays[rule.side]
    console.log('modelsArray', modelsArray)
    
    const gap = 0.01; 

    const selectedBox = new THREE.Box3().setFromObject(testInstance.root);
    selectedBox.expandByScalar(-gap); // уменьшаем на зазор

    console.log('selected', selectedBox)

    for (let model of modelsArray) {
      if (model.root.uuid === testInstance.root.uuid) continue;

      const otherBox = new THREE.Box3().setFromObject(model.root);
    //  otherBox.expandByScalar(gap); // увеличиваем на зазор

      if (selectedBox.intersectsBox(otherBox)) {
        console.log("коллизия с учётом зазора!");
        console.log('selectedBox', selectedBox)
        console.log('other', otherBox)

        return true;

        
      }
    }

    return false;
  }

 resolveCollisionX(testInstance, minX, maxX, step = 0.005) {
  const originalX = testInstance.root.position.x;

  // 1. Проверка начальной позиции
  if (!this.checkCollision(testInstance)) {
    return originalX; // Всё хорошо — возвращаем как есть
  }

  // 2. Двигаем вправо от текущей позиции до maxX
  let currentX = originalX;

  while (currentX <= maxX) {
    currentX += step;
    testInstance.root.position.x = currentX;

    if (!this.checkCollision(testInstance)) {
      return currentX; // Нашли свободную позицию
    }
  }

  // 3. Если не нашли, можно попробовать влево (дополнительно)
  currentX = originalX;

  while (currentX >= minX) {
    currentX -= step;
    testInstance.root.position.x = currentX;

    if (!this.checkCollision(testInstance)) {
      return currentX; // Нашли слева
    }
  }

  // 4. Если ничего не нашли — вернуть в исходное (или сигнализировать)
  testInstance.root.position.x = originalX;
  console.warn("Нет свободного места в диапазоне X");
  return false;
}


}
