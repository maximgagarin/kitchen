import * as THREE from "three";
import { CSG } from "three-csg-ts";

export function makeHole(tableObject, box) {
    const prepareObject = (obj) => {
      obj.updateWorldMatrix(true, true);
      const clonedGeometry = obj.geometry.clone();
      clonedGeometry.applyMatrix4(obj.matrixWorld);
      return new THREE.Mesh(clonedGeometry, obj.material);
    };

    const tableClone = prepareObject(tableObject);
    const sinkClone = prepareObject(box);

    const tableCSG = CSG.fromMesh(tableClone);
    const sinkCSG = CSG.fromMesh(sinkClone);
    const resultCSG = tableCSG.subtract(sinkCSG);
    const resultMesh = CSG.toMesh(
      resultCSG,
      tableObject.matrixWorld, // исправлено
      tableObject.material // исправлено
    );
    return resultMesh;
  }