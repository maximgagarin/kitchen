import * as THREE from "three";
import { LineWithouText } from "../LineWithoutText";
import { Line } from "../Line";
import { plannerConfig } from "../planerConfig";



export function createEmptyBox(width, position, scene) {
  let posX = Number(position)
  const group = new THREE.Group()

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.854, 0.6),
    new THREE.MeshStandardMaterial({
      color: "yellow",
      transparent: true, // Включаем прозрачность
      opacity: 0.2,
    })
  );
  group.position.set(posX, 0.427, 0.3);
  group.name = "emptyBox";
  plannerConfig.boxesArray.push(box)




  group.add(box)


  const lineHotizontal = new Line({x:-width/2, y:-2, z:-0.3},{x:width/2, y:-2, z:-0.3}, 0.4, 0)

  
  group.add(lineHotizontal.group)

  scene.add(group);
 // console.log(boxesArray)
}
