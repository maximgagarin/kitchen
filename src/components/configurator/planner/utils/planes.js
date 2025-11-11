  import * as THREE from 'three'
  export function  createPlanesForRaycaster(x,z){
           const transparentMaterial = new THREE.MeshBasicMaterial({
              color: 0x00ff00,
          
               transparent: true,
               opacity: 0,
                 depthWrite: false, // <=== вот это важно!
            });
            const directPlane = new THREE.Mesh(
              new THREE.PlaneGeometry(10, 10 ),
              transparentMaterial
            );
            const leftPlane = new THREE.Mesh(
              new THREE.PlaneGeometry(5, 2 ),
              transparentMaterial
            );
              const directPlane2level = new THREE.Mesh(
              new THREE.PlaneGeometry(4, 2 ),
              transparentMaterial
            );
              const wallPlane = new THREE.Mesh(
              new THREE.PlaneGeometry(5, 1 ),
              transparentMaterial
            );
            leftPlane.name = "leftplane"
            directPlane.name = "directPlane";
            directPlane.rotation.x = Math.PI/2
            directPlane.position.set(2,0,2)

            leftPlane.rotation.y = Math.PI/2  
            leftPlane.position.set(0,1.5,2) 

            directPlane2level.name = "directPlane2level";
           // directPlane2level.rotation.x = Math.PI/2
            directPlane2level.position.set(2,1.5,0.29)

            wallPlane.position.set(2,0.5,0)
           
            return {directPlane, directPlane2level, wallPlane, leftPlane}
          }
