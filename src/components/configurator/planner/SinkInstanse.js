import * as THREE from 'three'
import { Line } from './Line'
import { LineWithouText } from './LineWithoutText'
import { algorithmConfig } from '../builders/Algorithm/algorithmConfig'
import { LoaderModels2 } from '../LoaderModels2'
//const loaderModels = new LoaderModels2()


export class SinkInstanse {
  constructor(modelScene) {
   // this.sceneSetup = sceneSetup
    this.root = modelScene
  this.id = 0

   
    this.doorLeft = this.root.getObjectByName('doorLeft')
    this.doorRight = this.root.getObjectByName('doorRight')

    this.sinkOn = false
    this.sink = this.root.getObjectByName('Sink_and_ktichen_faucet')
  //  this.tabletopFull = this.root.getObjectByName('tabletopfull')
    this.tabletopWidthHole = this.root.getObjectByName('tabletop')
   // this.tabletopFull.visible = false
    this.tabletop = this.root.getObjectByName('tabletop')

    this.controls = []
  


  //  this.name = this.findObjectName(this.root, "modelName");
    this.name = ''
    this.width = null
    this.side = ''
    this.level =1


    this.doorState = {
      leftOpen: false,
      rightOpen: false,
    }

   // this.axesHelper = new THREE.AxesHelper(5)
    //this.root.add(this.axesHelper)

    this.index = 0
    this.slot = 0
    this.center = 0
    

    this.raycasterBox = null
    this.objectSize = new THREE.Vector3();
    this.createBox()
    this.createControls()
    this.lineHotizontal = new Line(false,{x:-(this.objectSize.x)/2, y:1, z:-0.29}, 
                                   {x:(this.objectSize.x)/2, y:1, z:-0.29}, 1)
    
    this.lineLeft = new LineWithouText({x:-(this.objectSize.x)/2, y:this.objectSize.y - 0.2, z:-0.29}, 
                                       {x:-(this.objectSize.x)/2, y:1, z:-0.29}, 1, true)

    this.lineRight = new LineWithouText({x:(this.objectSize.x)/2, y:this.objectSize.y - 0.2, z:-0.29}, 
                                        {x:(this.objectSize.x)/2, y:1, z:-0.29}, 1, true)                                    
                                       

    this.root.add(this.lineHotizontal.group)
   // this.root.add(this.lineLeft.group)
   // this.root.add(this.lineRight.group)

    algorithmConfig.lines.push(this.lineHotizontal, this.lineLeft, this.lineRight)

    


  }


  createBox(){
    const box = new THREE.Box3().setFromObject(this.root);
   

    const size = new THREE.Vector3();
    box.getSize(size);
    box.getSize(this.objectSize)
    const center = new THREE.Vector3();
    box.getCenter(center);

    const helper = new THREE.Mesh(
    new THREE.BoxGeometry(size.x, size.y, size.z),
    new THREE.MeshBasicMaterial({  visible:false })
    );
    helper.position.copy(center);
    helper.name = 'boxHelper'
  //  helper.userData.controller = this;
    

    this.raycasterBox = helper; // сохраняем для Raycaster
    this.root.add(this.raycasterBox)
    this.width = this.objectSize.x

    const boxHelper = new THREE.BoxHelper( this.root, 0xffff00 );
        this.root.add(boxHelper)
        this.boxHelper = boxHelper
        this.boxHelper.visible = false
  }

  createControls(){
     this.leftControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.3, 0.03),
        new THREE.MeshStandardMaterial({  color:0x60fa39 }));
        this.root.add(this.leftControl)
        this.leftControl.position.set(-(this.objectSize.x)/2+0.05, 0.5, (this.objectSize.z/2))
        this.leftControl.name = 'leftControl'
        this.leftControl.visible = false
        // this.leftControl.rotation.z = Math.PI/2
         
    
        this.rightControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.3, 0.03),
        new THREE.MeshStandardMaterial({  color:0x60fa39 }));
        this.root.add(this.rightControl)
        this.rightControl.position.set((this.objectSize.x)/2-0.05, 0.5, (this.objectSize.z/2))
        this.rightControl.name = 'rightControl'
        this.rightControl.visible = false
    
    
        this.centerControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
        new THREE.MeshStandardMaterial({  color:0x696969  }));
        this.root.add(this.centerControl)
        this.centerControl.position.set(0, 0.45, this.objectSize.z/2)
        this.centerControl.rotation.x = Math.PI/2
        this.centerControl.name = 'centerControl'
        this.centerControl.visible = false
    
    
        
        this.menuControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
        new THREE.MeshStandardMaterial({  color:0xD2691E  }));
        this.root.add(this.menuControl)
        this.menuControl.position.set(0, 0.7, this.objectSize.z/2)
        this.menuControl.rotation.x = Math.PI/2
        this.menuControl.name = 'menuControl'
        this.menuControl.visible = false
    
        this.copyControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
        new THREE.MeshStandardMaterial({  color:'red'  }));
        this.root.add(this.copyControl)
        this.copyControl.position.set(0, 0.2,this.objectSize.z/2)
        this.copyControl.rotation.x = Math.PI/2
        this.copyControl.name = 'copyControl'
        this.copyControl.visible = false
    
        this.controls.push(this.leftControl, this.rightControl, this.centerControl, this.menuControl, this.copyControl)


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