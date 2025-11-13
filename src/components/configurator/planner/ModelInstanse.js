import * as THREE from 'three'
import { Line } from './Line'
import { LineWithouText } from './LineWithoutText'
import { algorithmConfig } from '../builders/Algorithm/algorithmConfig'
import { controlsTextures } from './controlsTextures'


export class ModelInstanse {
  constructor(modelScene, sceneSetup) {
    this.sceneSetup = sceneSetup
    this.root = modelScene
    
    
   
    this.doorLeft = this.root.getObjectByName('doorLeft')
    this.doorRight = this.root.getObjectByName('doorRight')
    this.tabletop = this.root.getObjectByName('tabletop')

  //  this.name = this.findObjectName(this.root, "modelName");
    this.id = 0
    this.name = ''
    this.fullname = ''
    this.width = null
    this.side = ''
    this.level =1
    this.isSelected = false


    this.doorState = {
      leftOpen: false,
      rightOpen: false,
    }

  //  this.axesHelper = new THREE.AxesHelper(5)
   // this.root.add(this.axesHelper)

    this.index = 0
    this.slot  = 0
    this.center = 0
    this.controls=[]
    

    this.raycasterBox = null
    this.frontBox = null

    this.objectSize = new THREE.Vector3();
    this.boxHelper = null
    this.createBox()
    this.createControls()
    this.lineHotizontal = new Line(this.sceneSetup,{x:-(this.objectSize.x)/2, y:1, z:-0.29}, 
                                   {x:(this.objectSize.x)/2, y:1, z:-0.29}, 1)
    
    this.lineLeft = new LineWithouText({x:-(this.objectSize.x)/2, y:this.objectSize.y, z:-0.29}, 
                                       {x:-(this.objectSize.x)/2, y:1, z:-0.29}, 1, true)

    this.lineRight = new LineWithouText({x:(this.objectSize.x)/2, y:this.objectSize.y, z:-0.29}, 
                                        {x:(this.objectSize.x)/2, y:1, z:-0.29}, 1, true)                                    
                                       

    this.root.add(this.lineHotizontal.group)
    this.root.add(this.lineLeft.group)
    this.root.add(this.lineRight.group)

    algorithmConfig.lines.push(this.lineHotizontal, this.lineLeft, this.lineRight)

  


  }


 
  createBox(){
    const box = new THREE.Box3().setFromObject(this.root);
   

    const size = new THREE.Vector3();
    box.getSize(size);
    box.getSize(this.objectSize)
    const center = new THREE.Vector3();
    box.getCenter(center);
   // console.log('size', size)

    const helper = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    new THREE.MeshBasicMaterial({  visible:false })
    );

    helper.position.copy(center);
    helper.name = 'boxHelper'
   // helper.userData.controller = this;


    const frontBox = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, 0.05),
    new THREE.MeshBasicMaterial({   visible:false })
    );

    frontBox.position.set(0, this.objectSize.y/2, (this.objectSize.z/2)-0.05)
    this.frontBox = frontBox
    this.root.add(frontBox)
    

    this.raycasterBox = helper; // сохраняем для Raycaster
    this.root.add(this.raycasterBox)
    this.width = this.objectSize.x


    const boxHelper = new THREE.BoxHelper( this.root, 0xffff00 );
    this.root.add(boxHelper)
   
    this.boxHelper = boxHelper
    this.boxHelper.visible = false
    


  }

  createControls(){

  

   const material = new THREE.MeshStandardMaterial({
      map: controlsTextures.leftControl.normal,
      transparent: true,
      depthWrite: false
   });

  

    this.leftControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.005, 32),
      material,  // верх
  );
  
    this.leftControl.rotation.x = Math.PI/2
    this.leftControl.rotation.y = Math.PI/2

    if(this.width < 0.3){
      this.leftControl.position.set( 0 , 0.57, (this.objectSize.z/2))
    } else {
      this.leftControl.position.set( -this.objectSize.x/4, 0.45, (this.objectSize.z/2))
    }
    this.root.add(this.leftControl)

    this.leftControl.name = 'leftControl'
    this.leftControl.visible = false
    this.leftControl.userData.name = 'изменить размер'
    this.leftControl.userData.state = 'normal'
    // this.leftControl.rotation.z = Math.PI/2
     

    
    const material2 = new THREE.MeshStandardMaterial({
      map: controlsTextures.rightControl.normal,
      transparent: true,
      depthWrite: false
    });

    this.rightControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.01, 32),
    material2);
 
    this.rightControl.rotation.x = Math.PI/2
    this.rightControl.rotation.y = Math.PI/2

  
    if(this.width < 0.3){
      this.rightControl.position.set( 0 , 0.325, (this.objectSize.z/2))
    } else {
      this.rightControl.position.set( this.objectSize.x/4, 0.45, (this.objectSize.z/2))
    }
    this.root.add(this.rightControl)
    
    this.rightControl.name = 'rightControl'
    this.rightControl.userData.name = 'изменить размер'
    this.rightControl.visible = false


    const material3 = new THREE.MeshStandardMaterial({
      map: controlsTextures.centerControl.normal,
      transparent: true,
      depthWrite: false
    });
    


    this.centerControl = new THREE.Mesh( new THREE.CylinderGeometry(0.06, 0.06, 0.01, 32),
    material3);
    this.root.add(this.centerControl)
    this.centerControl.position.set(0, 0.45, this.objectSize.z/2)
    this.centerControl.rotation.x = Math.PI/2
    this.centerControl.rotation.y = Math.PI/2

    this.centerControl.name = 'centerControl'
    this.centerControl.userData.name = 'двигать'

    this.centerControl.visible = false



    const material4 = new THREE.MeshStandardMaterial({
      map: controlsTextures.menuControl.normal,
      transparent: true,
      depthWrite: false
    });
    
    this.menuControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    material4);
    this.root.add(this.menuControl)
    this.menuControl.position.set(0, 0.7, this.objectSize.z/2)
    this.menuControl.rotation.x = Math.PI/2
    this.menuControl.name = 'menuControl'
    this.menuControl.userData.name = 'меню'

    this.menuControl.visible = false


    const material5 = new THREE.MeshStandardMaterial({
      map: controlsTextures.copyControl.normal,
      transparent: true,
      depthWrite: false
    });

    this.copyControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    material5);
    this.root.add(this.copyControl)
    this.copyControl.position.set(0, 0.2,this.objectSize.z/2)
    this.copyControl.rotation.x = Math.PI/2
    this.copyControl.name = 'copyControl'
    this.copyControl.userData.name = 'копировать'

    this.copyControl.visible = false

    this.controls.push(this.leftControl, this.rightControl, this.centerControl, this.menuControl, this.copyControl)
 // this.controls.push( this.centerControl)




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