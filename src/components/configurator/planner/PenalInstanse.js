import * as THREE from 'three'
import { Line } from './Line'
import { LineWithouText } from './LineWithoutText'
import { LoaderModels2 } from '../LoaderModels2'
//const loaderModels = new LoaderModels2()


export class PenalInstanse {
  constructor(modelScene) {
    
    this.root = modelScene
   
    this.doorLeft = this.root.getObjectByName('doorLeft')
    this.doorRight = this.root.getObjectByName('doorRight')
    //  this.name = this.findObjectName(this.root, "modelName");
    this.id = 0

    this.name = 'penal'
    this.width = null
    this.side = ''
    this.controls  = []
   


    this.doorState = {
      leftOpen: false,
      rightOpen: false,
    }

   // this.axesHelper = new THREE.AxesHelper(5)
    //this.root.add(this.axesHelper)

    this.index = 0
    this.slot = 0
    this.center = 0
    this.level = 1
    

    this.raycasterBox = null
    this.objectSize = new THREE.Vector3();
        
    this.raycasterControl = []
    this.createBox()
    this.createControls()
    // this.lineHotizontal = new Line({x:-(this.objectSize.x)/2, y:1, z:-(this.objectSize.x)/2}, 
    //                                {x:-(this.objectSize.x)/2, y:1, z:(this.objectSize.x)/2})
    
    // this.lineLeft = new LineWithouText({x:-(this.objectSize.x)/2, y:this.objectSize.y, z:-(this.objectSize.x)/2}, 
    //                                    {x:-(this.objectSize.x)/2, y:1, z:-(this.objectSize.x)/2}, 1, true)

    // this.lineRight = new LineWithouText({x:-(this.objectSize.x)/2, y:this.objectSize.y, z:(this.objectSize.x)/2}, 
    //                                     {x:-(this.objectSize.x)/2, y:1, z:(this.objectSize.x)/2}, 1, true)                                   
                                       

    // this.root.add(this.lineHotizontal.group)
    // this.root.add(this.lineLeft.group)
    // this.root.add(this.lineRight.group)



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
    helper.userData.controller = this;
    

    this.raycasterBox = helper; // сохраняем для Raycaster
    this.root.add(this.raycasterBox)
    this.width = this.objectSize.x
     const boxHelper = new THREE.BoxHelper( this.raycasterBox, 0xffff00 );
        this.root.add(boxHelper)
        this.boxHelper = boxHelper
        this.boxHelper.visible = false
        
  }

  createControls(){
    // this.leftControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.3, 0.03),
    // new THREE.MeshStandardMaterial({  color:0x60fa39 }));
    // this.root.add(this.leftControl)
    // this.leftControl.position.set(-(this.objectSize.x)/2, 0.5, (this.objectSize.x/2)-0.01)
    // this.leftControl.name = 'leftControl'
    // this.leftControl.visible = false
    // // this.leftControl.rotation.z = Math.PI/2
     

    // this.rightControl = new THREE.Mesh( new THREE.BoxGeometry(0.03, 0.3, 0.03),
    // new THREE.MeshStandardMaterial({  color:0x60fa39 }));
    // this.root.add(this.rightControl)
    // this.rightControl.position.set((this.objectSize.x)/2, 0.5, (this.objectSize.x/2)+0.01)
    // this.rightControl.name = 'rightControl'
    // this.rightControl.visible = false


  this.centerControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    new THREE.MeshStandardMaterial({  color:0x696969  }));
    this.root.add(this.centerControl)
    this.centerControl.position.set(0, 0.2, this.objectSize.z/2)
    this.centerControl.rotation.x = Math.PI/2
    this.centerControl.name = 'centerControl'
    this.centerControl.visible = false

    this.deleteControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    new THREE.MeshStandardMaterial({  color:0x696969  }));
    this.root.add(this.deleteControl)
    this.deleteControl.position.set(0, 0.2,this.objectSize.x/2+0.1)
    this.deleteControl.rotation.x = Math.PI/2
    this.deleteControl.name = 'deleteControl'
    this.deleteControl.visible = false
    this.raycasterControl.push(this.deleteControl)


    
    this.menuControl = new THREE.Mesh( new THREE.CylinderGeometry(0.05, 0.05, 0.02, 32),
    new THREE.MeshStandardMaterial({  color:0xD2691E  }));
    this.root.add(this.menuControl)
    this.menuControl.position.set((this.objectSize.x)/2, 0.7, 0)
    this.menuControl.rotation.z = Math.PI/2
    this.menuControl.name = 'menuControl'
    this.menuControl.visible = false

     this.controls.push(  this.centerControl)


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