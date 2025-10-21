import * as THREE from 'three'

export const addOutline = (mesh) => {
    // Если обводка уже существует, удаляем её
    if (mesh.outline) {
        mesh.remove(mesh.outline); // Удаляем старую обводку
    }

    // Создаем геометрию для границ
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    // Создаем линии для отображения
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));

    line.raycast = () => {};
    
    // Сохраняем ссылку на линию обводки в свойство mesh.outline
    mesh.outline = line;

    // Добавляем контур в меш
    mesh.add(line);
};