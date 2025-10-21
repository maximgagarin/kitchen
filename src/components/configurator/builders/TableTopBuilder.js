import config4 from "../../config/config4";
import config from "../../config/config";
import * as THREE from "three";
import { useKitchenSizesStore } from "../../../pinia/kitchenSizes";
import { whiteMaterial, blackMaterial } from "../materials";
import { TableTop } from "./TableTop";

export class TableTopBuilder {
  constructor(sceneSetup) {
    this.scene = sceneSetup.scene;
    this.modules = [];
    this.KitchenSizesStore = useKitchenSizesStore();
  }


  generateTableTop() {
    let sizes = this.KitchenSizesStore.rowSizes;

    let tableTopDirect = this.createExtrudedTableTop(sizes.side_a,0.6,1);
    tableTopDirect.position.set(0, 0.819, 0.6);
    this.scene.add(tableTopDirect);

    let tableTopLeft = this.createExtrudedTableTop(sizes.side_c - 0.05, 0.6, 1);
    tableTopLeft.rotation.y = Math.PI / 2;
    tableTopLeft.position.set(0.6, 0.819, sizes.side_c + 0.55);
    this.scene.add(tableTopLeft);

    let tableTopRight = this.createExtrudedTableTop(sizes.side_c - 0.05, 0.6, 1);
    tableTopRight.rotation.y = Math.PI / 2;
    tableTopRight.position.set(sizes.side_a, 0.819, sizes.side_c + 0.55);
    this.scene.add(tableTopRight);
  }


  createDirect(point, withCutout){

    let object = this.scene.getObjectByName('tableTopDirect')
    this.scene.remove(object)

    let sizes = this.KitchenSizesStore.rowSizes;

    let tableTopDirect = this.createExtrudedTableTop(sizes.side_a,0.6, point, withCutout);
    tableTopDirect.position.set(0, 0.819, 0.6);
    tableTopDirect.name = 'tableTopDirect'
    this.scene.add(tableTopDirect);
    return tableTopDirect
  }

  createLeft(point, withCutout){

    let object = this.scene.getObjectByName('tableTopLeft')
    this.scene.remove(object)

    let sizes = this.KitchenSizesStore.rowSizes;

    let tableTopLeft = this.createExtrudedTableTop(sizes.side_c - 0.05, 0.6, point,withCutout );
    tableTopLeft.rotation.y = Math.PI / 2;
    tableTopLeft.position.set(0.6, 0.819, sizes.side_c + 0.55);
    tableTopLeft.name = 'tableTopLeft'
    this.scene.add(tableTopLeft);
    return tableTopLeft
  }

  createRight(point, withCutout){

    let object = this.scene.getObjectByName('tableTopRight')
    this.scene.remove(object)

    let sizes = this.KitchenSizesStore.rowSizes;

    let tableTopRight = this.createExtrudedTableTop(sizes.side_d - 0.05, 0.6, point,withCutout );
    tableTopRight.rotation.y = Math.PI / 2;
    tableTopRight.position.set(sizes.side_a, 0.819, sizes.side_d + 0.55);
    tableTopRight.name = 'tableTopRight'
    this.scene.add(tableTopRight);
    return tableTopRight
  }

  createExtrudedTableTop(sizeX, sizeZ, x, withCutout = false) {
    const shape = new THREE.Shape();
    let thickness = 0.038;

    shape.moveTo(0, 0);
    shape.lineTo(sizeX, 0);
    shape.lineTo(sizeX, sizeZ);
    shape.lineTo(0, sizeZ);
    shape.lineTo(0, 0);

    if (withCutout) {
      const hole = new THREE.Path();
      hole.moveTo(x - 0.45, 0.05);
      hole.lineTo(x, 0.05);
      hole.lineTo(x, 0.485);
      hole.lineTo(x - 0.45, 0.485);
      hole.lineTo(x - 0.45, 0.05);
      shape.holes.push(hole);
    }

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const tabletop = new THREE.Mesh(geometry, material);

    return tabletop;
  }
}
