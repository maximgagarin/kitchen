import * as THREE from 'three'
import { boxMaterial, tableTopMaterial, doorMaterial, cabinetMaterial, glass, whiteMaterial, blackMaterial , woodMaterial, lowerCabinetMaterial} from '../materials'
import { addOutline } from '../addOutline'

export class LowerCabinet extends THREE.Group {
    constructor(x, y, z,  configType , isFirst = false, isLast = false ) {
        super()
        this.x = x
        this.y = y
        this.z = z
        this.configType = configType
        this.isFirst = isFirst
        this.isLast = isLast        

        this.meshes = [] 
        this.tableTop = [] 

        this.addbox()
    }

    addbox() {
        const doorGeometry = new THREE.BoxGeometry(this.x - 0.01, this.y, 0.016)
        const backGeometry = new THREE.BoxGeometry(this.x, this.y, 0.008)
        const topGeometry = new THREE.BoxGeometry(this.x - 0.032, this.z, 0.016)
        const sideGeometry = new THREE.BoxGeometry(this.z, this.y, 0.016)
        const baseGeometry = new THREE.BoxGeometry(this.x, 0.1, 0.016)
        const baseGeometrySide = new THREE.BoxGeometry(this.x, 0.1, 0.016)

        const tableTopGeometry = new THREE.BoxGeometry(
            ((this.isFirst && (this.configType === "left" || this.configType === "uShaped")) ||
            (this.isLast && (this.configType === "right" || this.configType === "uShaped"))) ? 
            this.x + 0.0 : this.x, 0.038, this.z + 0.1
        );

        const door = new THREE.Mesh(doorGeometry, lowerCabinetMaterial)
        const panelback = new THREE.Mesh(backGeometry, lowerCabinetMaterial)
        const paneltop = new THREE.Mesh(topGeometry, lowerCabinetMaterial)
        const panelbottom = new THREE.Mesh(topGeometry, lowerCabinetMaterial)
        const panelleft = new THREE.Mesh(sideGeometry, lowerCabinetMaterial)
        const panelright = new THREE.Mesh(sideGeometry, lowerCabinetMaterial)
        const basepanel = new THREE.Mesh(baseGeometry, lowerCabinetMaterial)
        const basepanelSide = new THREE.Mesh(baseGeometrySide, lowerCabinetMaterial)

        const tableTop = new THREE.Mesh(tableTopGeometry, blackMaterial)

        tableTop.name = 'tableTop'

        
        //  addOutline(door)

        const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 16);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 'grey' });
    
        // Позиции ножек (по углам шкафа)
        const legPositions = [
            [-this.x / 2 + 0.05, -this.y / 2 - 0.05, 0.05], // Левый передний
            [this.x / 2 - 0.05, -this.y / 2 - 0.05, 0.05],  // Правый передний
            [-this.x / 2 + 0.05, -this.y / 2 - 0.05, this.z - 0.1], // Левый задний
            [this.x / 2 - 0.05, -this.y / 2 - 0.05, this.z - 0.1]  // Правый задний
        ];
    
        // Создаём и добавляем ножки
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            leg.name = "cabinet_leg";
            this.add(leg);
            this.meshes.push(leg);
        });

        door.castShadow = true
        door.receiveShadow = true
        panelbottom.castShadow = true
        panelbottom.receiveShadow = true
        panelleft.castShadow = true
        panelleft.receiveShadow = true
        panelright.castShadow = true
        panelright.receiveShadow = true
        panelback.castShadow = true
        panelback.receiveShadow = true
        tableTop.castShadow = true
        tableTop.receiveShadow = true

        panelleft.rotation.y = Math.PI / 2
        paneltop.rotation.x = Math.PI / 2
        panelbottom.rotation.x = -Math.PI / 2
        panelright.rotation.y = -Math.PI / 2
        panelback.rotation.y = Math.PI

        panelback.position.set(0, 0, -0.004)
        panelleft.position.set(-this.x / 2 + 0.0081, 0, this.z / 2)
        panelright.position.set(this.x / 2 - 0.0081, 0, this.z / 2)
        paneltop.position.set(0, 0.35 - 0.008, 0.15)
        panelbottom.position.set(0, -this.y / 2 + 0.008, this.z / 2)
        basepanel.position.set(0, -this.y / 2 - 0.05, this.z - 0.033)

        tableTop.position.set(
            this.isFirst && (this.configType === "left" || this.configType === "uShaped") ? -0.0 :
            this.isLast && (this.configType === "right" || this.configType === "uShaped") ? 0.0 :
            0, this.y / 2 + 0.019, this.z / 2 - 0.01
        );

        door.position.set(0, 0, this.z + 0.01)

        this.add( door ,panelback, panelleft, panelright,  tableTop,  basepanel, panelbottom)
       
        this.meshes.push(door, panelback, panelleft, panelright, basepanel, tableTop, panelbottom)
        this.tableTop.push(tableTop)
    }

    dispose() {
 
        this.meshes.forEach(mesh => {
            if (mesh.geometry) {
                mesh.geometry.dispose()
            }
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => {
                        if (mat.map) {
                            mat.map.dispose() 
                            mat.map = null
                        }
                        mat.dispose()
                    })
                } else {
                    if (mesh.material.map) {
                        mesh.material.map.dispose()
                        mesh.material.map = null
                    }
                    mesh.material.dispose()
                }
            }
            this.remove(mesh)
        })

        this.meshes = [] 
    }
}
