import { plannerConfig } from "./planerConfig";
import { blackMaterial, whiteMaterial } from "../materials";

export class MenuController {
  constructor(sceneSetup, loaderModels) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
  }

  changeHandle(selectedHandle) {
    const handleModel = this.loaderModels.get(selectedHandle);

    console.log("Выбранная ручка:", selectedHandle);

    if (!handleModel) {
      console.warn(`Модель ${selectedHandle} не найдена`);
      return;
    }

    const handle = handleModel.children[0].children[0];

    console.log("Новая ручка:", handle);

    handle.visible = true;

    const modelGroups = [
      ...plannerConfig.modelsDirect2L,
      ...plannerConfig.modelsLeft2L,
    ];

    const toRemove = []; // Массив для хранения объектов, которые нужно удалить
    const toAdd = []; // Массив для хранения новых объектов

    modelGroups.forEach((model) => {
      model.root.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes("handle")) {
          console.log("Обрабатываемая деталь:", child);

          // Проверяем, все ли координаты и состояния верны
          const pos = child.position.clone();
          const rot = child.rotation.clone();
          const scale = child.scale.clone();
          const parentGroup = child.parent;

          toRemove.push(child); // Добавляем в список для удаления

          // Создаем новый объект
          const newHandle = handle.clone(true);
          newHandle.position.copy(pos);
          newHandle.rotation.copy(rot);
          newHandle.scale.copy(scale);
          newHandle.name = "handle";

          toAdd.push({ parentGroup, newHandle }); // Сохраняем информацию о новом объекте для добавления позже
        }
      });
    });

    // После завершения traverse удаляем все собранные объекты
    toRemove.forEach((child) => {
      const parentGroup = child.parent;
      parentGroup.remove(child);
    });

    // После удаления добавляем новые объекты
    toAdd.forEach(({ parentGroup, newHandle }) => {
      parentGroup.add(newHandle);
      console.log("Добавлена новая ручка:", newHandle);
    });

    this.sceneSetup.requestRender();
  }

  changeColor(selectedColor) {
    const map = {
      black: blackMaterial,
      white: whiteMaterial,
    };

    const selectMaterial = map[selectedColor];

    const modelGroups = [
      ...plannerConfig.modelsDirect2L,
      ...plannerConfig.modelsLeft2L,
      
    ];

    modelGroups.forEach((model) => {
      console.log(model);
      model.root.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes("panel")) {
          //   console.log(child)
          child.material = selectMaterial;
          child.material.needsUpdate = true; // чтобы обновить материал
        }
      });
    });

    this.sceneSetup.requestRender();
  }

  changeFacade(selectedHandle) {
    const handleModel = this.loaderModels.get("facade-1");

    console.log("Выбранная ручка:", selectedHandle);

    if (!handleModel) {
      console.warn(`Модель ${selectedHandle} не найдена`);
      return;
    }

    const handle = handleModel.children[0].children[0];

    console.log("Новая ручка:", handle);

    handle.visible = true;

    const modelGroups = [...plannerConfig.modelsDirect2L];

    const toRemove = []; // Массив для хранения объектов, которые нужно удалить
    const toAdd = []; // Массив для хранения новых объектов

    modelGroups.forEach((model) => {
      model.root.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes("door")) {
          console.log("Обрабатываемая деталь:", child);

          // Проверяем, все ли координаты и состояния верны
          const pos = child.position.clone();
          const rot = child.rotation.clone();
          const scale = child.scale.clone();
          const parentGroup = child.parent;

          toRemove.push(child); // Добавляем в список для удаления

          // Создаем новый объект
          const newHandle = handle.clone(true);
          newHandle.position.copy(pos);
          newHandle.rotation.copy(rot);
          newHandle.scale.copy(scale);
          newHandle.name = "door";

          toAdd.push({ parentGroup, newHandle }); // Сохраняем информацию о новом объекте для добавления позже
        }
      });
    });

    // После завершения traverse удаляем все собранные объекты
    toRemove.forEach((child) => {
      const parentGroup = child.parent;
      parentGroup.remove(child);
    });

    // После удаления добавляем новые объекты
    toAdd.forEach(({ parentGroup, newHandle }) => {
      parentGroup.add(newHandle);
      console.log("Добавлена новая ручка:", newHandle);
    });

    this.sceneSetup.requestRender();
  }
}
