import * as THREE from 'three'
import { Line } from './Line'
import { LineWithouText } from './LineWithoutText'
import { Model_In_Sector } from './Model_In_Sector'
import { useKitchenSizesStore } from '../../../pinia/kitchenSizes'
import { controlsTextures } from './controlsTextures'




export class SectorInstanse {
  constructor(size, sceneSetup, box = true) {
   
    
   
    this.sceneSetup = sceneSetup
 //   this.modelScene = modelScene
    this.size = size
    this.root = new THREE.Group()
    this.modelsGroup = new THREE.Group()
    this.emptiesGroup = new THREE.Group()
    this.kitchenStore = useKitchenSizesStore()

    this.emptiesGroup.name = 'emptiesGroup'
     this.modelsGroup.name = 'modelsGroup'

    this.root.add(this.emptiesGroup)
   // const model = new Model_In_Sector(modelScene, this.sceneSetup)


    this.box = box
    
    


  //  this.name = this.findObjectName(this.root, "modelName");
    this.name = 'sector'
    this.width = null
    this.side = ''
    this.level = 2
    this.sublevel = null
    this.heightType = 0
    
    this.modules = []
  //  this.modules.push(model)
    this.edit = false

    //пустой
    this.ready = false

  
    


    this.doorState = {
      leftOpen: false,
      rightOpen: false,
    }

   // this.axesHelper = new THREE.AxesHelper(5)
    //this.root.add(this.axesHelper)

    this.index = 0
    this.center = 0
    this.slot = 0
    this.slots = []

    //кнопки управления
    this.controls=[]

    this.empties = []
    

    this.raycasterBox = null
    this.objectSize = new THREE.Vector3();
    this.boxHelper = null
    this.center = new THREE.Vector3()
    
    
    this.createBox()
   
    this.createControls()
  //  this.modelsGroup.add(modelScene)
    this.root.add(this.modelsGroup)
    
    //  this.root.add(modelScene)
  //   this.createLines()
        // this.axis = new THREE.AxesHelper(5)
         
     //   this.root.add(this.axis)
   

  }

   createLines(){
    this.lineHotizontal = new Line(this.sceneSetup,{x:-(this.objectSize.x)/2, y:0.9, z:-0.15}, 
                                   {x:(this.objectSize.x)/2, y:0.9, z:-0.15})
    
    this.lineLeft = new LineWithouText({x:-(this.objectSize.x)/2, y:this.objectSize.y, z:-0.15}, 
                                   {x:-(this.objectSize.x)/2, y:1, z:-0.15}, 1, true)

    this.lineRight = new LineWithouText({x:(this.objectSize.x)/2, y:this.objectSize.y, z:-0.15}, 
                                   {x:(this.objectSize.x)/2, y:1, z:-0.15}, 1, true)                                   
                                       

    this.root.add(this.lineHotizontal.group)
    this.root.add(this.lineLeft.group)
    this.root.add(this.lineRight.group)
  }


 

  // createNewBoxHelper(){
  //   const namesToRemove = ["boxHelper", "boxHelperYellow"];

  //   namesToRemove.forEach((name) => {
  //     const obj = this.root.getObjectByName(name);
  //     if (obj) {
  //       this.root.remove(obj);
  //       obj.geometry?.dispose?.();
  //       obj.material?.dispose?.();
  //     }
  //   });

  //   const group = this.root.getObjectByName("modelsGroup");
  //   group.updateMatrixWorld(true,true)
  //   const box = new THREE.Box3().setFromObject(group);
  //   const size = new THREE.Vector3();
    
  //   const center = new THREE.Vector3();
  //   box.getSize(size);
  //   box.getSize(this.objectSize)

  //  // computeBoundingBox

   
  //   box.getCenter(center);


  //   console.log('size', size)
  //   console.log('center', center)

  

  //   const helper = new THREE.Mesh(
  //   new THREE.BoxGeometry(size.x, 0.7, size.z),
  //   new THREE.MeshBasicMaterial({  visible:false })
  //   );
  // //  helper.position.copy(this.root.position);
  
  //   helper.name = 'boxHelper'
  //   helper.userData.controller = this;
  //   helper.position.y = 0.35
    

  //   this.raycasterBox = helper; // сохраняем для Raycaster
    
   
  //   this.root.add(this.raycasterBox)
   
  

  //   const boxHelper = new THREE.BoxHelper(this.raycasterBox, 0xffff00 );
  //   boxHelper.name = 'boxHelperYellow'

  //   this.root.attach(boxHelper)
  //   this.boxHelper = boxHelper
  //   this.boxHelper.visible = true

  //   this.width = this.objectSize.x

  //  // this.axis = new THREE.AxesHelper(5)
         
  //  // this.root.add(this.axis)


  // }

  createBox(){
   // const box = new THREE.Box3().setFromObject(this.modelScene);
    const is900 = this.kitchenStore.modules_height.height2level == 0.9

    

   // const size = new THREE.Vector3();
    
    //const center = new THREE.Vector3();
    //box.getSize(size);
  //  box.getSize(this.objectSize)

   

   // computeBoundingBox

  // 
   // box.getCenter(center);

    const center = is900 ? 0.45 : 0.35



  

    const helper = new THREE.Mesh(
    new THREE.BoxGeometry(this.size,  is900 ? 0.9 : 0.7, 0.3),
    new THREE.MeshBasicMaterial({  visible:false })
    );
    helper.position.y = center
  
    helper.name = 'boxHelper'
  //  helper.userData.controller = this;
    
    

    this.raycasterBox = helper; // сохраняем для Raycaster
    if(this.box){
     // console.log('root')
      this.root.add(this.raycasterBox)
    }
    if(!this.box){
     // console.log('ssene')
      this.root.attach(this.raycasterBox);
    }

    const axis = new THREE.AxesHelper(5)
         
   // helper.add(axis)


    const box = new THREE.Box3().setFromObject(this.root);
    box.getSize(this.objectSize)
    this.width = this.objectSize.x



    const boxHelper = new THREE.BoxHelper( this.root, 0xffff00 );
    boxHelper.name = 'boxHelperYellow'

    this.root.attach(boxHelper)
    this.boxHelper = boxHelper
    this.boxHelper.visible = true

   // this.width = this.objectSize.x
  //  this.root.add(axis)

   
  }


  createControls(){
  //  console.log('objSize', this.objectSize)
    this.leftControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.2, 0.03),
    new THREE.MeshStandardMaterial({  color:0x60fa39 }));
    this.root.add(this.leftControl)
    this.leftControl.position.set((this.objectSize.x)/2, 0.2, (this.objectSize.x/2)-0.01)
    this.leftControl.name = 'leftControl'
    this.leftControl.visible = false
    // this.leftControl.rotation.z = Math.PI/2
     

    this.rightControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.2, 0.03),
    new THREE.MeshStandardMaterial({  color:0x60fa39 }));
    this.root.add(this.rightControl)
    this.rightControl.position.set((this.objectSize.x)/2, 0.2, -(this.objectSize.x/2)+0.01)
    this.rightControl.name = 'rightControl'
    this.rightControl.visible = false




    const material3 = new THREE.MeshStandardMaterial({
      map: controlsTextures.centerControl.normal,
      transparent: true,
      depthWrite: false
    });


    this.centerControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    material3);
    this.root.add(this.centerControl)
    this.centerControl.position.set(0, this.objectSize.y/2, this.objectSize.z/2)
    this.centerControl.rotation.x = Math.PI/2
    this.centerControl.rotation.y = Math.PI/2
    this.centerControl.name = 'centerControl'
    this.centerControl.userData.name = 'двигать'

    this.centerControl.visible = false


    
    this.menuControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    new THREE.MeshStandardMaterial({  color:0xD2691E  }));
    this.root.add(this.menuControl)
    this.menuControl.position.set(0.12, 0.1, this.objectSize.z/2)
    this.menuControl.rotation.x = Math.PI/2
    this.menuControl.name = 'menuControl'
    this.menuControl.visible = false

        const material5 = new THREE.MeshStandardMaterial({
          map: controlsTextures.copyControl.normal,
          transparent: true,
          depthWrite: false
        });


    this.copyControl = new THREE.Mesh( new THREE.CylinderGeometry(0.04, 0.04, 0.02, 32),
    material5);
    this.root.add(this.copyControl)
    this.copyControl.position.set(0, 0.1,this.objectSize.z/2)
    this.copyControl.rotation.x = Math.PI/2
    this.copyControl.name = 'clone'
    this.copyControl.userData.name = 'копировать'

    this.copyControl.visible = false

    this.ungroup = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    new THREE.MeshStandardMaterial({  color:'blue'  }));
    this.root.add(this.ungroup)
    this.ungroup.position.set(0, 0.3, this.objectSize.z/2)
    this.ungroup.rotation.x = Math.PI/2
    this.ungroup.name = 'ungroup'
    this.ungroup.visible = false

    this.add = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    new THREE.MeshStandardMaterial({  color:'red'  }));
    this.root.add(this.add)
    this.add.position.set(0.15, 0.1, this.objectSize.z/2)
    this.add.rotation.x = Math.PI/2
    this.add.name = 'add'
    this.add.visible = false

   

   // this.controls.push(this.leftControl, this.rightControl, this.centerControl, this.menuControl, this.ungroupCombo)
    this.controls.push( this.centerControl, this.copyControl)   
  }


}