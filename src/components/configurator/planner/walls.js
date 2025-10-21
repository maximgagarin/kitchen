import * as THREE from "three";

export function createWalls(){


const wallThickness = 0.1;
const roomWidth = 4;
const roomDepth = 3;
const wallHeight = 3;

const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, roomDepth),
  new THREE.MeshBasicMaterial({ color: 0xcccccc })
);
leftWall.position.set(0, wallHeight / 2, 2);
leftWall.name = "wall";

const rightWall = leftWall.clone();
rightWall.position.set(roomWidth , wallHeight / 2, 2);

const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(roomWidth, wallHeight, wallThickness),
  new THREE.MeshBasicMaterial({ color: 0xcccccc })
);
backWall.position.set(2, wallHeight / 2, -0.1);
backWall.name = "wall";

return {leftWall, rightWall, backWall}
}

  