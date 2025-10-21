import * as THREE from "three";
import { Text } from "troika-three-text";
import { lines } from "../../config/lines";

export class Line {
  constructor(sceneSetup, start, end, height = 1, rotation = 1, color = 0x303030) {
    this.sceneSetup = sceneSetup;
    this.rotation = rotation;
    this.color = color;
    this.group = new THREE.Group();
    this.group.name = "line";
    lines.push(this.group);

    this.start = new THREE.Vector3(start.x, height, start.z);
    this.end = new THREE.Vector3(end.x, height, end.z);

    this.createLine();
    this.createArrows();
    this.createText();
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

    // Сместить конус так, чтобы остриё попадало в нужную точку
    this.arrow1.position.copy(
      this.start.clone().add(dir.clone().multiplyScalar(arrowOffset))
    );
    this.arrow2.position.copy(
      this.end.clone().add(dir.clone().negate().multiplyScalar(arrowOffset))
    );

    this.alignArrow(this.arrow1, dir);
    this.alignArrow(this.arrow2, dir.clone().negate());

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

    text.fontSize = 0.07;
    text.sdfGlyphSize = 64; // ускоряем подготовку
    text.anchorX = "center";
    text.anchorY = "middle";
    text.color = "#000000";
    text.billboard = true;
    text.material.depthTest = false;
    text.position.set(
      (this.start.x + this.end.x) / 2,
      this.start.y + 0.05,
      (this.start.z + this.end.z) / 2
    );

    this.rotation == 1
      ? (text.rotation.y = 0)
      : (text.rotation.y = Math.PI / 2);

    this.group.add(text);
    this.text = text;
    this.text.userData.len = distance;

    // 👉 гарантируем, что сразу подготовится
    text.sync(() => {
      this.sceneSetup?.requestRender?.();
    });
  }

  update(start, end) {
    this.start.set(start.x, this.start.y, start.z);
    this.end.set(end.x, this.end.y, end.z);

    this.line.geometry.setFromPoints([this.start, this.end]);

    const dir = new THREE.Vector3()
      .subVectors(this.end, this.start)
      .normalize();
    const arrowOffset = 0.05;

    this.arrow1.position.copy(
      this.start.clone().add(dir.clone().multiplyScalar(arrowOffset))
    );
    this.arrow2.position.copy(
      this.end.clone().add(dir.clone().negate().multiplyScalar(arrowOffset))
    );

    this.alignArrow(this.arrow1, dir);
    this.alignArrow(this.arrow2, dir.clone().negate());

    const distance = this.start.distanceTo(this.end);
    this.text.text = `${Math.round(distance * 100)} см`;
    this.text.position.set(
      (this.start.x + this.end.x) / 2,
      this.start.y + 0.05,
      (this.start.z + this.end.z) / 2
    );
    this.text.sync(() => {
      this.sceneSetup.requestRender();
    });
  }

  updateText() {
    this.text.sync(() => {
      this.sceneSetup.requestRender();
    });
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
}
