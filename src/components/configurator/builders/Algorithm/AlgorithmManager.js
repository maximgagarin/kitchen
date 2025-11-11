import * as THREE from "three";
import { plannerConfig } from "../../planner/planerConfig";
import { algorithmConfig } from "./algorithmConfig";
import { AlgorithmManager1level } from "./AlgorithmManager1level";
import { AlgorithmManager2level } from "./AlgorithmManager2level";
import { useKitchenSizesStore } from "../../../../pinia/kitchenSizes";
import { Algorithm2level900 } from "./Algorithm2level900";
import { TableTop } from "./TableTop";




export class AlgorithmManager {
  constructor(sceneSetup, loaderModels, cabinetBuilder) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.kitchenSizesStore = useKitchenSizesStore();
    this.algorithm1level = new AlgorithmManager1level(this.sceneSetup, this.loaderModels  );
    this.algorithm2level = new AlgorithmManager2level(this.sceneSetup, this.loaderModels  );
    this.algorithm2level900 = new Algorithm2level900(this.sceneSetup, this.loaderModels)
    this.tableTop = new TableTop(this.sceneSetup, loaderModels)
  }

  run() {
    this.kitchenSizesStore.algorythm.start = true;
    this.algorithm1level.run();
    this.algorithm2level.run();
    this.tableTop.create() 
    this.tableTop.setMaterial()
  
  }
}
