import * as THREE from "three";
import { boxMaterial, doorMaterial, whiteMaterial ,woodMaterial , blackMaterial } from "../materials";
import { addOutline } from "../addOutline";

export class UpperCabinet extends THREE.Group {
  constructor(x, y, z) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;

    this.meshes = []; 
    this.addbox();
  }

  addbox() {
    const doorGeometry = new THREE.BoxGeometry(this.x - 0.01, this.y, 0.016);
    const backGeometry = new THREE.BoxGeometry(this.x, this.y, 0.008);
    const topGeometry = new THREE.BoxGeometry(this.x - 0.032, this.z, 0.016);
    const sideGeometry = new THREE.BoxGeometry(this.z, this.y, 0.016);

    const door = new THREE.Mesh(doorGeometry, whiteMaterial);
    const panelback = new THREE.Mesh(backGeometry, whiteMaterial);
    const paneltop = new THREE.Mesh(topGeometry, whiteMaterial);
    const panelbottom = new THREE.Mesh(topGeometry, whiteMaterial);
    const panelleft = new THREE.Mesh(sideGeometry, whiteMaterial);
    const panelright = new THREE.Mesh(sideGeometry, whiteMaterial);
    
    

    const randomX = Math.random() < 0.5 ? -1 : 1;  
    const randomY = Math.random() < 0.5 ? -1 : 1;  


 


   
    [door, paneltop, panelbottom, panelleft, panelright, panelback].forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    //  позиции и повороты
    panelleft.rotation.y = Math.PI / 2;
    paneltop.rotation.x = Math.PI / 2;
    panelbottom.rotation.x = -Math.PI / 2;
    panelright.rotation.y = -Math.PI / 2;
    panelback.rotation.y = Math.PI;

    panelback.position.set(0, 0, -0.004);
    panelleft.position.set(-this.x / 2 + 0.0081, 0, this.z / 2);
    panelright.position.set(this.x / 2 - 0.0081, 0, this.z / 2);
    paneltop.position.set(0, this.y / 2 - 0.008, this.z / 2);
    panelbottom.position.set(0, -this.y / 2 + 0.008, this.z / 2);
    door.position.set(0, 0, this.z + 0.01);

    this.add(door, panelback, panelleft, panelright, paneltop, panelbottom);

    //  addOutline(door)

   
    this.meshes.push(door, panelback, panelleft, panelright, paneltop, panelbottom);
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
  }

  setRotation(r) {
    this.rotation.y = Math.PI / r;
  }

  checkCollision(otherCabinet) {
    const box1 = this.getBoundingBox();
    const box2 = otherCabinet.getBoundingBox();
    return box1.intersectsBox(box2);
  }

  getBoundingBox() {
    return new THREE.Box3().setFromObject(this);
  }

  center() {
    return this.position.z - 2.5;
  }

  dispose() {
   
    this.meshes.forEach((mesh) => {
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat.map) {
            //  mat.map.dispose();
             // mat.map = null;
            }
            mat.dispose();
          });
        } else {
          if (mesh.material.map) {
          //  mesh.material.map.dispose();
          //  mesh.material.map = null;
          }
        //  mesh.material.dispose();
        }
      }
      this.remove(mesh);
    });

    this.meshes = []; 
  }
}