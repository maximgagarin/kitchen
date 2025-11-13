import * as THREE from 'three'
import { Line } from './Line'
import { LineWithouText } from './LineWithoutText'
import { useKitchenSizesStore } from '../../../pinia/kitchenSizes'
import { algorithmConfig } from '../builders/Algorithm/algorithmConfig'
import { controlsTextures } from './controlsTextures'



export class ModelInstanse2L {
  constructor(modelScene, sceneSetup, box = true) {
    this.sceneSetup = sceneSetup
    this.root = modelScene
    this.box = box
    this.id = 0

  //  console.log('root', this.root)
   
    this.doorLeft = this.root.getObjectByName('doorLeft')
    this.doorRight = this.root.getObjectByName('doorRight')
  //  this.name = this.findObjectName(this.root, "modelName");
    this.name = ''
     this.fullname = ''
    this.width = null
    this.side = ''
    this.level = 2
    this.sublevel = null
    this.heightType = 0
    this.isCombo = false
    this.kitchenStore = useKitchenSizesStore()

     this.axis = new THREE.AxesHelper(5)

     
    


    this.doorState = {
      leftOpen: false,
      rightOpen: false,
    }

   // this.axesHelper = new THREE.AxesHelper(5)
    //this.root.add(this.axesHelper)

    this.index = 0
    this.center = 0
    this.slot = 0

    //кнопки управления
    this.controls=[]
    

    this.raycasterBox = null
    this.objectSize = new THREE.Vector3();
    this.boxHelper = null
    
    this.createBox()
   
    this.createControls()
     this.createLines()
 //    this.root.add(this.axis)

  }

   createLines(){

    const posY = this.kitchenStore.modules_height.height2level === 0.7? 0.85 : 1

    this.lineHotizontal = new Line(this.sceneSetup,{x:-(this.objectSize.x)/2, y:posY, z:-0.15}, 
                                   {x:(this.objectSize.x)/2, y:posY, z:-0.15})
    
    this.lineLeft = new LineWithouText({x:-(this.objectSize.x)/2, y:this.objectSize.y, z:-0.15}, 
                                   {x:-(this.objectSize.x)/2, y:posY, z:-0.15}, 1, true)

    this.lineRight = new LineWithouText({x:(this.objectSize.x)/2, y:this.objectSize.y, z:-0.15}, 
                                   {x:(this.objectSize.x)/2, y:posY, z:-0.15}, 1, true)                                   
                                       

    this.root.add(this.lineHotizontal.group)
    this.root.add(this.lineLeft.group)
    this.root.add(this.lineRight.group)
  }

  initTextures() {
      const loader = new THREE.TextureLoader();
  
      this.controlTextures = {
        leftControl: {
          normal: loader.load('textures/controls/leftControl.jpg'),
          hover: loader.load('textures/controls/leftControlHover.jpg'),
        },
        rightControl: {
          normal: loader.load('textures/controls/rightControl.jpg'),
          hover: loader.load('textures/controls/rightControlHover.jpg'),
        },
        centerControl: {
          normal: loader.load('textures/controls/centerControl.jpg'),
          hover: loader.load('textures/controls/centerControlHover.jpg'),
        },
        menuControl: {
          normal: loader.load('textures/controls/menuControl.jpg'),
          hover: loader.load('textures/controls/menuControl.jpg'),
        },
        copyControl: {
          normal: loader.load('textures/controls/menuControl.jpg'),
          hover: loader.load('textures/controls/menuControl.jpg'),
        },
      };
  
      Object.values(this.controlTextures).forEach(stateSet => {
        Object.values(stateSet).forEach(tex => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.transparent = true;
          
        });
      });
  
      console.log(this.controlTextures)
    }



  createBox(){
    const box = new THREE.Box3().setFromObject(this.root);

  //  console.log(box)

    const size = new THREE.Vector3();
    
     const center = new THREE.Vector3();
    box.getSize(size);
    box.getSize(this.objectSize)

   // computeBoundingBox

   
    box.getCenter(center);


   // console.log('size', size)
  //  console.log('center', center)

  

    const frontBox = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, 0.05),
    new THREE.MeshBasicMaterial({  visible:false})
    );

    frontBox.position.set(0, this.objectSize.y/2, (this.objectSize.z/2)-0.05)
    this.frontBox = frontBox
    this.root.add(frontBox)

    const helper = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    new THREE.MeshBasicMaterial({  visible:false })
    );
    helper.position.copy(center);
  
    helper.name = 'boxHelper'
    

    this.raycasterBox = helper; // сохраняем для Raycaster
    if(this.box){
     // console.log('root')
      this.root.add(this.raycasterBox)
    }
    if(!this.box){
     // console.log('ssene')
      this.root.attach(this.raycasterBox);
    }


    const boxHelper = new THREE.BoxHelper( this.root, 0xffff00 );
    this.root.attach(boxHelper)
    this.boxHelper = boxHelper
    this.boxHelper.visible = false

    this.width = this.objectSize.x

    if (this.objectSize.y <= 0.37) {
      this.heightType = 0.35;
    

    } else if (this.objectSize.y > 0.37 && this.objectSize.y <= 0.72) {
      this.heightType = 0.7;
    } else {
      this.heightType = 0.9;
    }
  }


  createControls(){
  //  console.log('objSize', this.objectSize)
    // this.leftControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.2, 0.03),
    // new THREE.MeshStandardMaterial({  color:0x60fa39 }));
    // this.root.add(this.leftControl)
    // this.leftControl.position.set((this.objectSize.x)/2, 0.2, (this.objectSize.x/2)-0.01)
    // this.leftControl.name = 'leftControl'
    // this.leftControl.visible = false
    // this.leftControl.rotation.z = Math.PI/2
     

    // this.rightControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.2, 0.03),
    // new THREE.MeshStandardMaterial({  color:0x60fa39 }));
    // this.root.add(this.rightControl)
    // this.rightControl.position.set((this.objectSize.x)/2, 0.2, -(this.objectSize.x/2)+0.01)
    // this.rightControl.name = 'rightControl'
    // this.rightControl.visible = false



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
    this.copyControl.name = 'copyControl'
    this.copyControl.userData.name = 'копировать'

    this.copyControl.visible = false


    
    // this.menuControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    // new THREE.MeshStandardMaterial({  color:0xD2691E  }));
    // this.root.add(this.menuControl)
    // this.menuControl.position.set(0.12, 0.15, this.objectSize.z/2)
    // this.menuControl.rotation.x = Math.PI/2
    // this.menuControl.name = 'menuControl'
    // this.menuControl.visible = false

    // this.ungroupCombo = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    // new THREE.MeshStandardMaterial({  color:'green'  }));
    // this.root.add(this.ungroupCombo)
    // this.ungroupCombo.position.set(0, 0.3, this.objectSize.z/2)
    // this.ungroupCombo.rotation.x = Math.PI/2
    // this.ungroupCombo.name = 'ungroupCombo'
    // this.ungroupCombo.visible = false

   

   // this.controls.push(this.leftControl, this.rightControl, this.centerControl, this.menuControl, this.ungroupCombo)
    //this.controls.push( this.centerControl, this.menuControl, this.copyControl )
    this.controls.push( this.centerControl , this.copyControl)

    
  }


  

  toggleLeftDoor() {
    if (!this.doorLeft) return
    const open = !this.doorState.leftOpen
    this.doorLeft.rotation.y = open ? -Math.PI / 2 : 0 // поворот на 90°
    this.doorState.leftOpen = open
  }

  toggleRightDoor() {
    if (!this.doorRight) return
    const open = !this.doorState.rightOpen
    this.doorRight.rotation.y = open ? Math.PI / 2 : 0
    this.doorState.rightOpen = open
  }

 

//   setPosition(x, y, z) {
//     this.root.position.set(x, y, z)
//   }

  dispose() {
    this.root.traverse(child => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) child.material.dispose()
    })
    this.root.parent?.remove(this.root)
  }

  findObjectName(scene, name) {
  let result = null;
  
  scene.traverse((child) => {
    if (child.userData?.modelName) {
      result = child.userData.modelName;
    }
  });
  
  return result;
}
}