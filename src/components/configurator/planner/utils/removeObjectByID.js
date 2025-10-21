export function   removeObjectById(targetId, scene) {
    let objectToRemove = null;

    // Ищем объект
    scene.traverse((child) => {
      if (child.userData?.id === targetId) {
        objectToRemove = child;
      }
    });

    // Удаляем если найден
    if (objectToRemove && objectToRemove.parent) {
      // Очищаем ресурсы (геометрию, материалы)
      if (objectToRemove.geometry) objectToRemove.geometry.dispose();

      if (objectToRemove.material) {
        if (Array.isArray(objectToRemove.material)) {
          objectToRemove.material.forEach((m) => m.dispose());
        } else {
          objectToRemove.material.dispose();
        }
      }

      // Удаляем из сцены
      objectToRemove.parent.remove(objectToRemove);
      return true; // Успешно удален
    }

    return false; // Не найден
  }