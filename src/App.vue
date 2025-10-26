<template>
  <div ref="canvasContainer" class="canvas-container"></div>
 
 <div class="main_menu">
  <MainMenu />
  <!-- <div class="bottom">Чёрная полоса</div> -->
 </div>

  <div v-if="showLoading" class="loading-screen">
    <div class="loading-message">Подождите, загрузка...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, provide, markRaw , watchEffect} from "vue";
import { SceneSetup } from "./components/configurator/SceneSetup";
import { Light } from "./components/configurator/light";
import { Room } from "./components/configurator/room";
import { CabinetBuilder } from "./components/configurator/CabinetBuilder";
import MainMenu from "./components/menu/MainMenu.vue";
import { LoaderModels } from "./components/configurator/LoaderModels";
import { PanalBuilder } from "./components/configurator/builders/PenalBuilder";
import { TableTopBuilder } from "./components/configurator/builders/TableTopBuilder";
import { usePenalStore } from "./pinia/penals";
import { useKitchenSizesStore } from './pinia/kitchenSizes'
import { useRaycasterPanelsStore } from "./pinia/raycasterPanels";
import { useRowSegmentsStore } from "./pinia/RowSegments";
import { SetTech } from "./components/configurator/setTech/setTech";
import { SetStove } from "./components/configurator/setTech/setStove";
import { SetFirdge } from "./components/configurator/setTech/setFridge";
import { AlgorithmManager } from "./components/configurator/builders/Algorithm/AlgorithmManager";
import { useAllModelsStore } from "./pinia/AllModels";
import { PlannerManager } from "./components/configurator/planner/PlannerManager";
import { Init } from "./components/configurator/Init";

const canvasContainer = ref(null);
let room, sceneSetup, lineBuilder , textBuilder, textWidth , textHeight, textLeft, textRight 
const cabinetBuilder = ref(null);
const penalBuilder = ref(null);
let tableTopBuilder = ref(null);
let setTech = ref(null);
let setStove = ref(null);
let setFridge = ref(null);
const algorithmManager = ref(null);
const plannerManager = ref(null)

const showLoading = ref(true);


const penalStore = usePenalStore()
const kitchenSizesStore = useKitchenSizesStore()
const raycasterPanelsStore = useRaycasterPanelsStore()
const rowSegmentsStore = useRowSegmentsStore()
const allModelsStore = useAllModelsStore()

provide("cabinetBuilder", cabinetBuilder);
provide("penalBuilder", penalBuilder);
provide("tableTopBuilder", tableTopBuilder);
provide("setTech", setTech);
provide("setStove", setStove);
provide("setFridge", setFridge);
provide("algorithmManager", algorithmManager);
provide("plannerManager", plannerManager);




onMounted(() => {
    setTimeout(() => {
    showLoading.value = false;
  }, 100);
  
  const init = new Init()
  init.start()
  sceneSetup = new SceneSetup(canvasContainer.value);
  const light = new Light();
  light.addToScene(sceneSetup.scene);
 
  let loaderModels = new LoaderModels(sceneSetup)
  loaderModels.start()

  room = new Room(sceneSetup.scene, sceneSetup.camera,  sceneSetup.controls  );
  cabinetBuilder.value = new CabinetBuilder(sceneSetup, loaderModels, kitchenSizesStore, penalStore, rowSegmentsStore);
  penalBuilder.value = new PanalBuilder(sceneSetup, loaderModels, penalStore, );
  tableTopBuilder = new TableTopBuilder(sceneSetup, kitchenSizesStore)

  setTech.value = new SetTech(sceneSetup, tableTopBuilder, loaderModels , cabinetBuilder.value)
  setStove.value = new SetStove(sceneSetup,  loaderModels , cabinetBuilder.value, setTech.value)
  setFridge.value = new SetFirdge(sceneSetup,  loaderModels , cabinetBuilder.value)

  algorithmManager.value = new AlgorithmManager(sceneSetup, loaderModels, cabinetBuilder.value)

  plannerManager.value = new PlannerManager(sceneSetup, loaderModels)

  
});

</script>

<style>



 body { 
    cursor: default; /* Обычный курсор */
    margin: 0;
    overflow: hidden;
  }

  .pointer-cursor { cursor: pointer; } /* Курсор-указатель */
  
* {
  overflow-y: auto; /* включаем вертикальный скролл */
  overflow-x: hidden; /* скрываем горизонтальный */
  margin: 0;

  font-optical-sizing: auto;
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: black;
  width: 100%;
  height: 100px;
  z-index: 1000;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>


    
     

     
     
     
