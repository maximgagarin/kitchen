import * as THREE from "three";
import { Text } from "troika-three-text";
import { lines } from "../../config/lines";

export class DimensionLine {
  constructor(
    sceneSetup,
    scene,
    start,
    end,
    rotation,
    vertical = false,
    color = 0x696969,
    name = "line"
  ) {
    this.sceneSetup = sceneSetup;
    this.scene = scene;
    this.color = color;
    this.group = new THREE.Group();
    this.group.name = name;
    this.vertical = vertical;

    lines.push(this.group);

    this.start = new THREE.Vector3(start.x, start.y, start.z);
    this.end = new THREE.Vector3(end.x, end.y, end.z);

    this.name = "";
    this.rotation = rotation;
    this.rotationRules = {
      0: 0,
      1: Math.PI / 2,
    };

    this.createLine();
    this.createArrows();
    this.createText();

    scene.add(this.group);
  }

  createLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      this.start,
      this.end,
    ]);
    const material = new THREE.LineBasicMaterial({ color: this.color });
    this.line = new THREE.Line(geometry, material);
    this.group.add(this.line);
  }

  createArrows() {
    const arrowMat = new THREE.MeshBasicMaterial({ color: this.color });
    const coneGeo = new THREE.ConeGeometry(0.01, 0.05, 12);
    const arrowOffset = 0.025; // Половина высоты конуса

    this.arrow1 = new THREE.Mesh(coneGeo, arrowMat);
    this.arrow2 = new THREE.Mesh(coneGeo, arrowMat);

    const dir = new THREE.Vector3()
      .subVectors(this.end, this.start)
      .normalize();

    //  console.log('dir', dir)

    // Сместить конус так, чтобы остриё попадало в нужную точку
    this.arrow1.position.copy(
      this.start.clone().add(dir.clone().multiplyScalar(arrowOffset))
    );
    this.arrow2.position.copy(
      this.end.clone().add(dir.clone().negate().multiplyScalar(arrowOffset))
    );

    if (this.vertical) {
      this.alignArrow(this.arrow2, dir);
      this.alignArrow(this.arrow1, dir.clone().negate());
    } else {
      this.alignArrow(this.arrow1, dir);
      this.alignArrow(this.arrow2, dir.clone().negate());
    }

    this.group.add(this.arrow1, this.arrow2);
  }

  alignArrow(arrow, dir) {
    const up = new THREE.Vector3(0, 1, 0); // Конус по умолчанию смотрит вверх
    const quaternion = new THREE.Quaternion().setFromUnitVectors(dir, up);
    arrow.quaternion.copy(quaternion);
  }

  createText() {
    const distance = this.start.distanceTo(this.end);
    const text = new Text();
    text.text = `${Math.round(distance * 100)} см`;
    text.fontSize = 0.08;
    text.anchorX = "center";
    text.anchorY = "middle";
    text.color = "#000000";
    text.billboard = true; // ← до sync
    text.material.depthTest = false;
    text.renderOrder = 999;
    text.position.set(
      (this.start.x + this.end.x) / 2,
      this.start.y + 0.05,
      (this.start.z + this.end.z) / 2
    );

    if (this.vertical) {
      //text.rotation.y = Math.PI / 2;
      text.position.set(
        this.start.x + 0.2,
        this.end.y + 0.1,
        (this.start.z + this.end.z) / 2
      );
    }

    text.rotation.y = this.rotationRules[this.rotation];
   

    this.group.add(text);
    this.text = text;
    this.text.userData.len = distance;
    text.sync();
    this.sceneSetup.requestRender();

  }

 update(start, end, rotation) {
  if (this.vertical) {
    this.start.set(start.x, start.y, start.z);
    this.end.set(start.x, end.y, start.z);
  } else {
    this.start.set(start.x, this.start.y, start.z);
    this.end.set(end.x, this.end.y, end.z);
  }

  this.line.geometry.setFromPoints([this.start, this.end]);

  const dir = new THREE.Vector3()
    .subVectors(this.end, this.start)
    .normalize();
  const arrowOffset = 0.025;

  this.arrow1.position.copy(this.start.clone().addScaledVector(dir, arrowOffset));
  this.arrow2.position.copy(this.end.clone().addScaledVector(dir, -arrowOffset));

    if (this.vertical) {
      this.alignArrow(this.arrow2, dir);
      this.alignArrow(this.arrow1, dir.clone().negate());
    } else {
      this.alignArrow(this.arrow1, dir);
      this.alignArrow(this.arrow2, dir.clone().negate());
    }

  const distance = this.start.distanceTo(this.end);
  this.text.text = `${Math.round(distance * 100)} см`;

  // 👉 теперь позиция корректная
  if (this.vertical) {
    this.text.position.set(
      this.start.x + 0.2,
      this.end.y + 0.1,
      (this.start.z + this.end.z) / 2
    );
  } else {
    const mid = new THREE.Vector3()
      .addVectors(this.start, this.end)
      .multiplyScalar(0.5);
    this.text.position.set(mid.x, mid.y + 0.05, mid.z);
  }

  this.text.sync(() => this.sceneSetup.requestRender());
  this.sceneSetup.requestRender();
}

  updateEnd(newEnd) {
    this.update(this.start, newEnd);
  }

  dispose() {
    if (this.group) {
      this.group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        // if (Array.isArray(obj.material)) {
        //   obj.material.forEach((m) => m.dispose?.());
        // } else if (obj.material) {
        //   obj.material.dispose?.();
        // }
      });
      this.scene.remove(this.group);
      this.group = null;
    }

    this.line = null;
    this.arrow1 = null;
    this.arrow2 = null;
    this.text = null;
  }

  visibleOn() {
    this.group.visible = true;
  }

  visibleOff() {
    this.group.visible = false;
  }
}
