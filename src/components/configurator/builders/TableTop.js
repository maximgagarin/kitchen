import * as THREE from 'three';

export class TableTop extends THREE.Mesh {
  constructor(x, y, z) {
 
    const geometry = new THREE.BoxGeometry(x, y, z);

    
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // Цвет столешницы (коричневый)
      roughness: 0.6,
      metalness: 0.1,
    });

   
    super(geometry, material);

    // Дополнительно: включаем тени, если нужно
    this.castShadow = true;
    this.receiveShadow = true;

    // При необходимости можно добавить имя
   
  }
}