  export function deletePlane(scene) {
    ["directPlane"].forEach((name) => {
      scene.children
        .filter((element) => element.name === name)
        .forEach((element) => this.scene.remove(element));
    });
  }