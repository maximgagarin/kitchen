import { gsap } from "gsap";
import { plannerConfig } from "./planerConfig";

export class RotationController {
  constructor(sceneSetup) {
    this.sceneSetup = sceneSetup;
  }

  rotateSelected(rotate) {
    if (this.isRotating) return;


    this.isRotating = true;

    const targetRotation = rotate
      ? plannerConfig.selectedObject.root.rotation.y - Math.PI / 2
      : plannerConfig.selectedObject.root.rotation.y + Math.PI / 2;

    gsap.to(plannerConfig.selectedObject.root.rotation, {
      y: targetRotation,
      duration: 0.2,
      ease: "power2.out",
      onUpdate: () => this.sceneSetup.requestRender(),
      onComplete: () => {
        this.isRotating = false;
      },
    });
  }
}
