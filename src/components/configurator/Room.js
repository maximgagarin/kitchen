import * as THREE from "three";
import { basicMaterial } from "./materials";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useKitchenSizesStore } from "../../pinia/kitchenSizes";
import { floorMaterial } from "./materials";


import config from "../config/config";


export class Room {
  constructor( scene, camera, controls) {
    this.scene = scene;
    this.width = config.room.width;
    this.depth = config.room.depth;
    this.height = config.room.height;
    this.objects = []; // Массив для хранения объектов комнаты
    this.camera = camera;
    this.controls = controls;
    this.KitchenSizes = useKitchenSizesStore()

    //this.addLines()
    this.createRoom();
  }

  createRoom() {
    this.floorGeometry = new THREE.PlaneGeometry(this.width, this.depth);
    this.wallGeometry = new THREE.PlaneGeometry(this.width, this.height);
    this.wallLeftGeometry = new THREE.PlaneGeometry(this.depth, this.height);
    this.wallRightGeometry = new THREE.PlaneGeometry(this.depth, this.height);

    this.floor = new THREE.Mesh(this.floorGeometry, basicMaterial);
    this.wall = new THREE.Mesh(this.wallGeometry, basicMaterial);
    this.wallLeft = new THREE.Mesh(this.wallLeftGeometry, basicMaterial);
    this.wallRight = new THREE.Mesh(this.wallRightGeometry, basicMaterial);

    this.wall.receiveShadow = true;
    this.wall.castShadow = true;
    this.floor.receiveShadow = true;
    this.floor.castShadow = true;
    this.wallLeft.receiveShadow =true
    this.wallLeft.castShadow =true


    this.wall.position.set(0, this.height / 2, -0.005);
    this.wallLeft.position.set(-0.001, this.height / 2, this.depth / 2);
    this.wallRight.position.set(
      config.kitchen_size.width,
      this.height / 2,
      this.depth / 2
    );
    this.floor.position.set(0, 0, this.depth / 2);

    this.floor.rotation.x = -Math.PI / 2;
    this.wallLeft.rotation.y = Math.PI / 2;
    this.wallRight.rotation.y = -Math.PI / 2;

    this.scene.add(this.floor);
    this.scene.add(this.wall);
    this.scene.add(this.wallLeft);
    this.scene.add(this.wallRight);


      
  //    this.scene.add(this.wallRight)

    this.objects.push(this.floor, this.wall, this.wallLeft, this.wallRight);
   
  }



  updateSizes(w, h, d) {
    this.objects.forEach((obj) => {
      this.scene.remove(obj);
      obj.geometry.dispose();
    });
    this.objects = [];

    this.width = w;
    this.depth = d;
    this.height = h;
    this.createRoom();
  }

}
