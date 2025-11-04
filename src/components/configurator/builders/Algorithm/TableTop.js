import * as THREE from "three";
import { tableTopMaterial } from "../../materials";
import { plannerConfig } from "../../planner/planerConfig";
import { CSG } from "three-csg-ts";
import { MaterialManager } from "../../MaterialManager";


export class TableTop {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = this.sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.materialManager = new MaterialManager()
    this.materialManager.start()
  }

 

 

  groupModulesForCountertops() {
    const tolerance = 0.01; // 2 мм
    const filteredModels = plannerConfig.modelsDirect.filter(m => m.name !== 'penal' && m.name !=='fridge');

    // Сортируем по X
    filteredModels.sort((a, b) => a.root.position.x - b.root.position.x);

    const groups = [];
    let currentGroup = [];

    for (let i = 0; i < filteredModels.length; i++) {
      const current = filteredModels[i];
      const next = filteredModels[i + 1];

      const box1 = new THREE.Box3().setFromObject(current.root);
      currentGroup.push(current);

      if (next) {
        const box2 = new THREE.Box3().setFromObject(next.root);
        const gap = box2.min.x - box1.max.x;

        if (gap > tolerance) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        groups.push(currentGroup);
      }
    }

    return groups;
  }


  groupModulesForCountertopsLeft() {
    const tolerance = 0.02; // 2 мм (если 1 единица = 1 метр)
     const filteredModels = plannerConfig.modelsLeft.filter(m => m.name !== 'penal' && m.name !=='fridge');

    // сортируем по X
    filteredModels.sort((a, b) => a.root.position.z - b.root.position.z);

  //  console.log('modelsSortLeft', models)

    const groups = [];
    let currentGroup = [];

    for (let i = 0; i < filteredModels.length; i++) {
      const current = filteredModels[i];
      const next = filteredModels[i + 1];

      const box1 = new THREE.Box3().setFromObject(current.root);
      currentGroup.push(current);

      if (next) {
        const box2 = new THREE.Box3().setFromObject(next.root);
        const gap = box2.min.z - box1.max.z;
       

        // если есть зазор больше допустимого — закрываем группу
        if (gap > tolerance) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        // последний модуль — закрываем группу
        groups.push(currentGroup);
      }
    }

    return groups;
  }

  createTableTops(parts){
  //  console.log('parts', parts)
      // удаляем старые столешницы из сцены
      plannerConfig.tabletops.forEach(top => this.scene.remove(top));
      plannerConfig.tabletops.length = 0;  
      const countertopHeight = 0.036; 
      const countertopDepth = 0.6;

      const countertops = [];

      parts.forEach((group) => {
          let isSink = false;
          let boxForHole;

          const groupBox = new THREE.Box3();
          group.forEach(model => {
            if(model.name === 'm'){ 
              isSink = true;
              boxForHole = model.root.getObjectByName('BoxForHole');
        //      console.log('bxHole', boxForHole)
              if (boxForHole) boxForHole.visible = false;
            } 
            const box = new THREE.Box3().setFromObject(model.root);
            groupBox.union(box);
          });

          const width = groupBox.max.x - groupBox.min.x;
          const depth = groupBox.max.z - groupBox.min.z;
      //    console.log('width', width)

          const atlas = this.materialManager.setTexture(width, 'x') 

          const geometry = new THREE.BoxGeometry(width, countertopHeight, countertopDepth);
          const tabletop = new THREE.Mesh(geometry, atlas);

          tabletop.position.set(
            groupBox.min.x + width / 2,
            0.835,
            groupBox.min.z + depth / 2
          );

       //   console.log('tabletop', tabletop)
       //   console.log('boxHole', boxForHole)

          if(isSink && boxForHole){
         //   console.log('makeHole')
            const newTabletop = this.makeHole(tabletop, boxForHole);
            this.scene.remove(tabletop);
            newTabletop.position.copy(tabletop.position);
            this.scene.add(newTabletop);
            plannerConfig.tabletops.push(newTabletop);
          } else {
            this.scene.add(tabletop);
            plannerConfig.tabletops.push(tabletop);
          }
      });
  }

  createTableTopsLeft(parts) {
  // удаляем старые столешницы левой стороны
  plannerConfig.tabletopsLeft.forEach(top => this.scene.remove(top));
  plannerConfig.tabletopsLeft.length = 0;

  const countertopHeight = 0.036;
  const countertopDepth = 0.6;

  parts.forEach(group => {
    let isSink = false;
    let boxForHole;

    const groupBox = new THREE.Box3();
    group.forEach(model => {
      if (model.name === 'm') {
        isSink = true;
        boxForHole = model.root.getObjectByName('BoxForHole');
        if (boxForHole) boxForHole.visible = false;
      }
      const box = new THREE.Box3().setFromObject(model.root);
      groupBox.union(box);
    });

    

    const width = groupBox.max.x - groupBox.min.x;
    const depth = groupBox.max.z - groupBox.min.z;

 //   console.log('width', width)
 //   console.log('depth', depth)


    const atlas = this.materialManager.setTexture(depth , 'z');

    const geometry = new THREE.BoxGeometry( countertopDepth,  countertopHeight, depth );
    const tabletop = new THREE.Mesh(geometry, atlas);

    tabletop.position.set(
      0.3,
      0.835,
      groupBox.min.z + depth / 2
    );

    if (isSink && boxForHole) {
      const newTabletop = this.makeHole(tabletop, boxForHole);
      this.scene.remove(tabletop);
      newTabletop.position.copy(tabletop.position);
      this.scene.add(newTabletop);
      plannerConfig.tabletopsLeft.push(newTabletop);
    } else {
      this.scene.add(tabletop);
      plannerConfig.tabletopsLeft.push(tabletop);
    }
  });
}


  

  setMaterial(){
    // материал для всех столешниц модулей

    plannerConfig.modelsDirect.forEach(model=>{
      if (['penal', 'fridge'].includes(model.name)) return;
    //  const width = Number((model.width).toFixed(2))
     // const atlas = this.materialManager.setTexture(width, 'x') 
       model.tabletop.material = new THREE.MeshPhysicalMaterial({
        color: 'grey'
      });
    })
    plannerConfig.modelsLeft.forEach(model=>{
      if (['penal', 'fridge'].includes(model.name)) return;

    //  const width = Number((model.width).toFixed(2))
  //    const atlas = this.materialManager.setTexture(width, 'z') 

      model.tabletop.material = new THREE.MeshPhysicalMaterial({
        color: 'grey'
      });
    })
  }

  create() {
    this.removeObjectsByName('tabletop1')
    this.removeObjectsByName('tableTopSink')

    const parts = this.groupModulesForCountertops()
    const partsLeft = this.groupModulesForCountertopsLeft()

  //  console.log('partsLeft', partsLeft)

  //  console.log('модули столешниц', parts )
   this.createTableTops(parts)
   this.createTableTopsLeft(partsLeft)

 
  }

  makeHole(tableObject, box) {
    const prepareObject = (obj) => {
      if (!obj.geometry) {
        console.error("Object has no geometry:", obj);
        return null;
      }

      obj.updateWorldMatrix(true, true);

      const clonedGeometry = obj.geometry.clone();
      clonedGeometry.applyMatrix4(obj.matrixWorld);
      return new THREE.Mesh(clonedGeometry, obj.material);
    };

    const tableClone = prepareObject(tableObject);
    const sinkClone = prepareObject(box);

    if (!tableClone || !sinkClone) {
      console.error("Не удалось подготовить объекты для CSG");
      return null;
    }

    const tableCSG = CSG.fromMesh(tableClone);
    const sinkCSG = CSG.fromMesh(sinkClone);
    const resultCSG = tableCSG.subtract(sinkCSG);
    const resultMesh = CSG.toMesh(
      resultCSG,
      tableObject.matrixWorld,
      tableObject.material
    );

    return resultMesh;
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


  removeObjectByUUID(uuid) {
  const object = this.scene.getObjectByProperty('uuid', uuid);
  if (object) {
    this.scene.remove(object);
    object.geometry?.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => mat.dispose());
      } else {
        object.material.dispose();
      }
    }
  }
}
}
