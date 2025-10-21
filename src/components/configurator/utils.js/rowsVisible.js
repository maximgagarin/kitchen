export function rowsVisible(){
    this.scene.traverse((child) => {
        if (child.isGroup && child.name.includes("build_direct_l1")) {
          child.traverse((nestedChild) => {
            if (nestedChild.isMesh && nestedChild.material) {
              if (Array.isArray(nestedChild.material)) {
                nestedChild.material.forEach((mat) => {
                  mat.transparent = true;
                  mat.opacity = 0.4;
                  mat.needsUpdate = true;
                });
              } else {
                nestedChild.material.transparent = true;
                nestedChild.material.opacity = 0.4;
                nestedChild.material.needsUpdate = true;
              }
            }
          });
        }
      });
}