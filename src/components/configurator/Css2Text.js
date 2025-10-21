import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'; 

export class Css2Text {
  constructor(scene) {
    this.scene = scene;
    this.label = null;
  }

  addText(x, y, z, text = "") {
    y = Number(y) + 0.2
    x = Number(x) + 0.1
    z = Number(z) + 0.1


    const div = document.createElement("div");
    div.className = "label";
    div.textContent = text;
    div.style.color = "black";
    div.style.fontSize = "16px";
    div.style.padding = "5px";
    div.style.borderRadius = "5px";

    this.label = new CSS2DObject(div);
    this.label.position.set(x, y, z);
    this.scene.add(this.label);
  }

  updateText(newText) {
    if (this.label && this.label.element) {
      this.label.element.textContent = newText;
    }
  }

  setPosition(x, y, z) {
    y = Number(y) + 0.2
    x = Number(x) + 0.1
    z = Number(z) + 0.1
    if (this.label) {
      this.label.position.set(x, y, z);
    }
  }

  remove() {
    if (this.label) {
      this.scene.remove(this.label);
      this.label = null;
    }
  }
}