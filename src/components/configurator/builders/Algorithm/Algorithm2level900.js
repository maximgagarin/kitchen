
import { useRowSegmentsStore } from "../../../../pinia/RowSegments";
import { useKitchenSizesStore } from "../../../../pinia/kitchenSizes";
import { usePenalStore } from "../../../../pinia/penals";
import { algorithmConfig } from "./algorithmConfig";
import { usePlannerStore } from "../../../../pinia/PlannerStore";
import { resultData2level900 } from "../resultData2level900";


export class Algorithm2level900 {
  constructor(sceneSetup, loaderModels, cabinetBuilder) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.scene;
    this.loaderModels = loaderModels;
    this.rowSegmentsStore = useRowSegmentsStore();
    this.kitchenSizesStore = useKitchenSizesStore();
    this.penalStore = usePenalStore();
    this.plannerStore = usePlannerStore()
    this.sinkSide = null;
    this.sinkSize = null;
    this.NamesToDeleteDirect = [];
    this.NamesToDeleteLeft = [];
    this.currentDirect = 0;
    this.currentLeft = 0.3;
    this.currentRight = 0.3;
    this.offsets = null
    this.rotationMap = {
      direct: 0,
      left: Math.PI / 2,
      right: Math.PI,
    };
  }


  run() {
   
    algorithmConfig.level2.rules = resultData2level900["Уровень 900"];
 
  }


  


}
