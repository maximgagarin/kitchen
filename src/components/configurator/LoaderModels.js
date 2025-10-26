import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { addOutline } from "./addOutline";
import { glass , whiteMaterial , blackMaterial} from "./materials";

export class LoaderModels {
  constructor(scene) {
    this.loader = new GLTFLoader();
    this.cache = {};
    this.scene = scene.scene;
    this.sceneMain = scene;
  }
  start() {
    const path = [

   
    
      { name: "cd-150", path: "/models/lowerCabinet/c150.glb" },
      { name: "cd-200", path: "/models/lowerCabinet/c200.glb" },
      { name: "cd-300", path: "/models/lowerCabinet/c300.glb" },
      { name: "cd-350", path: "/models/lowerCabinet/c350.glb" },
      { name: "cd-400", path: "/models/lowerCabinet/c400.glb" },
      { name: "cd-450", path: "/models/lowerCabinet/c450.glb" },
      { name: "cd-500", path: "/models/lowerCabinet/c500.glb" },
      { name: "cd-600", path: "/models/lowerCabinet/c600.glb" },
      { name: "cd-700", path: "/models/lowerCabinet/c700.glb" },
      { name: "cd-800", path: "/models/lowerCabinet/c800.glb" },
      { name: "cd-1000", path: "/models/lowerCabinet/c1000.glb" },
      { name: "b1000", path: "/models/lowerCabinet/b1000.glb" },
      { name: "b1000left", path: "/models/lowerCabinet/b1000left.glb" },




      { name: "c1-400", path: "/models/lowerCabinet/c1-400.glb" },
      { name: "c1-600", path: "/models/lowerCabinet/c1-600.glb" },
      { name: "c1-800", path: "/models/lowerCabinet/c1-800.glb" },


      { name: "c2-400", path: "/models/lowerCabinet/c2-400.glb" },
      { name: "c2-500", path: "/models/lowerCabinet/c2-500.glb" },
      { name: "c2-600", path: "/models/lowerCabinet/c2-600.glb" },
      { name: "c2-800", path: "/models/lowerCabinet/c2-800.glb" },

      { name: "c3-300", path: "/models/lowerCabinet/c3-300.glb" },
      { name: "c3-350", path: "/models/lowerCabinet/c3-350.glb" },

      { name: "c3-400", path: "/models/lowerCabinet/c3-400.glb" },
      { name: "c3-500", path: "/models/lowerCabinet/c3-500.glb" },
      { name: "c3-600", path: "/models/lowerCabinet/c3-600.glb" },
      { name: "c3-800", path: "/models/lowerCabinet/c3-800.glb" },

      { name: "su-1000", path: "/models/lowerCabinet/su-1000.glb" },
      { name: "su-1050", path: "/models/lowerCabinet/su-1050.glb" },




      // верхние модули
       { name: "П-150", path: "/models/upperModels/700/p150.glb" },
       { name: "П-200", path: "/models/upperModels/700/p200.glb" },
       { name: "П-300", path: "/models/upperModels/700/p300.glb" },
       { name: "П-350", path: "/models/upperModels/700/p350.glb" },
       { name: "П-400", path: "/models/upperModels/700/p400.glb" },
       { name: "П-450", path: "/models/upperModels/700/p450.glb" },
       { name: "П-500", path: "/models/upperModels/700/p500.glb" },
       { name: "П-600", path: "/models/upperModels/700/p600.glb" },
       { name: "П-700", path: "/models/upperModels/700/p700.glb" },
       { name: "П-800", path: "/models/upperModels/700/p800.glb" },

       { name: "ВП-200", path: "/models/upperModels/900/p200-900.glb" },
       { name: "ВП-300", path: "/models/upperModels/900/p300-900.glb" },
       { name: "ВП-350", path: "/models/upperModels/900/p350-900.glb" },
       { name: "ВП-400", path: "/models/upperModels/900/p400-900.glb" },
       { name: "ВП-450", path: "/models/upperModels/900/p450-900.glb" },
       { name: "ВП-500", path: "/models/upperModels/900/p500-900.glb" },
       { name: "ВП-600", path: "/models/upperModels/900/p600-900.glb" },
       { name: "ВП-700", path: "/models/upperModels/900/p700-900.glb" },
       { name: "ВП-800", path: "/models/upperModels/900/p800-900.glb" },


       { name: "к1-500", path: "/models/upperModels/700/К1-500.glb" },
       { name: "к2-600", path: "/models/upperModels/700/К2-600.glb" },
       { name: "к3-800", path: "/models/upperModels/700/К3-800.glb" },
       { name: "к4-800", path: "/models/upperModels/700/К4-800.glb" },
       { name: "к5-800", path: "/models/upperModels/700/К5-800.glb" },
       { name: "к6-500", path: "/models/upperModels/700/К6-500.glb" },
       { name: "к7-600", path: "/models/upperModels/700/К7-600.glb" },
       { name: "к8-800", path: "/models/upperModels/700/К8-800.glb" },
       { name: "к9-800", path: "/models/upperModels/700/К9-800.glb" },
       { name: "к10-800", path: "/models/upperModels/700/К10-800.glb" },
       { name: "к11-400", path: "/models/upperModels/700/К11-400.glb" },



       { name: "кб1-500", path: "/models/upperModels/900/КБ1-500.glb" },
       { name: "кб2-600", path: "/models/upperModels/900/КБ2-600.glb" },
       { name: "кб3-800", path: "/models/upperModels/900/КБ3-800.glb" },
       { name: "кб4-500", path: "/models/upperModels/900/КБ4-500.glb" },
       { name: "кб5-600", path: "/models/upperModels/900/КБ5-600.glb" },
       { name: "кб6-800", path: "/models/upperModels/900/КБ6-800.glb" },
    //   { name: "кб9-500", path: "/models/upperModels/900/КБ9-500.glb" },
       { name: "кб9-800", path: "/models/upperModels/900/КБ9-800.glb" },
       { name: "кб11-800", path: "/models/upperModels/900/КБ11-800.glb" },
       { name: "кб12-800", path: "/models/upperModels/900/КБ12-800.glb" },
       { name: "кб14-1200", path: "/models/upperModels/900/КБ14-1200.glb" },
       { name: "кб16-1600", path: "/models/upperModels/900/КБ16-1600.glb" },
       { name: "кб17-800", path: "/models/upperModels/900/КБ17-800.glb" },


       { name: "ПЛД-500", path: "/models/upperModels/ПЛД-500.glb" },
       { name: "ПЛД-600", path: "/models/upperModels/ПЛД-600.glb" },
       { name: "ПЛД-800", path: "/models/upperModels/ПЛД-800.glb" },



       { name: "ОПМ-400", path: "/models/upperModels/700/ОПМ-400.glb" },
       { name: "ОПМ-600", path: "/models/upperModels/700/ОПМ-600.glb" },
       { name: "ОПМГ-500", path: "/models/upperModels/700/ОПМГ-500.glb" },
       { name: "ОПМГ-600", path: "/models/upperModels/700/ОПМГ-600.glb" },

       { name: "ПС-300", path: "/models/upperModels/700/ПС-300.glb" },
       { name: "ПС-400", path: "/models/upperModels/700/ПС-400.glb" },
       { name: "ПС-600", path: "/models/upperModels/700/ПС-600.glb" },
       { name: "ПС-800", path: "/models/upperModels/700/ПС-800.glb" },

       { name: "ПГ-350", path: "/models/upperModels/700/ПГ-350.glb" },
       { name: "ПГ-500", path: "/models/upperModels/700/ПГ-500.glb" },
       { name: "ПГ-600", path: "/models/upperModels/700/ПГ-600.glb" },
       { name: "ПГ-800", path: "/models/upperModels/700/ПГ-800.glb" },
       
       { name: "ПГС-500", path: "/models/upperModels/700/ПГС-500.glb" },
       { name: "ПГС-600", path: "/models/upperModels/700/ПГС-600.glb" },
       { name: "ПГС-800", path: "/models/upperModels/700/ПГС-800.glb" },

       { name: "ПГС2-500", path: "/models/upperModels/700/ПГС2-500.glb" },
       { name: "ПГС2-600", path: "/models/upperModels/700/ПГС2-600.glb" },
       { name: "ПГС2-800", path: "/models/upperModels/700/ПГС2-800.glb" },

       { name: "ПГ2-350", path: "/models/upperModels/700/ПГ2-350.glb" },
       { name: "ПГ2-500", path: "/models/upperModels/700/ПГ2-500.glb" },
       { name: "ПГ2-600", path: "/models/upperModels/700/ПГ2-600.glb" },
       { name: "ПГ2-800", path: "/models/upperModels/700/ПГ2-800.glb" },

       { name: "ПК-400", path: "/models/upperModels/700/ПК-400.glb" },
       //крест
       { name: "ПЛВ-400", path: "/models/upperModels/700/ПЛВ-400.glb" },
       { name: "ПЛВ2-400", path: "/models/upperModels/700/ПЛВ2-400.glb" },


        // 900

       { name: "ВПГ2-350", path: "/models/upperModels/900/ВПГ2-350.glb" },
       { name: "ВПГ2-500", path: "/models/upperModels/900/ВПГ2-500.glb" },
       { name: "ВПГ2-600", path: "/models/upperModels/900/ВПГ2-600.glb" },
       { name: "ВПГ2-800", path: "/models/upperModels/900/ВПГ2-800.glb" },

       { name: "ВПГС2-500", path: "/models/upperModels/900/ВПГС2-500.glb" },
       { name: "ВПГС2-600", path: "/models/upperModels/900/ВПГС2-600.glb" },
       { name: "ВПГС2-800", path: "/models/upperModels/900/ВПГС2-800.glb" },

       { name: "ВПС-300", path: "/models/upperModels/900/ВПС-300.glb" },
       { name: "ВПС-400", path: "/models/upperModels/900/ВПС-400.glb" },
       { name: "ВПС-600", path: "/models/upperModels/900/ВПС-600.glb" },
       { name: "ВПС-800", path: "/models/upperModels/900/ВПС-800.glb" },

       { name: "ВПГ-350", path: "/models/upperModels/900/ВПГ-350.glb" },
       { name: "ВПГ-500", path: "/models/upperModels/900/ВПГ-500.glb" },
       { name: "ВПГ-600", path: "/models/upperModels/900/ВПГ-600.glb" },
       { name: "ВПГ-800", path: "/models/upperModels/900/ВПГ-800.glb" },

       { name: "ВПГС-500", path: "/models/upperModels/900/ВПГС-500.glb" },
       { name: "ВПГС-600", path: "/models/upperModels/900/ВПГС-600.glb" },
       { name: "ВПГС-800", path: "/models/upperModels/900/ВПГС-800.glb" },


       


       { name: "ОПМВГ2-800", path: "/models/upperModels/900/ОПМВГ2-800.glb" },  
       { name: "ОПМВ-400", path: "/models/upperModels/900/ОПМВ-400.glb" },    
       { name: "ОПМВ-600", path: "/models/upperModels/900/ОПМВ-600.glb" },    
       { name: "ОПМВГ-500", path: "/models/upperModels/900/ОПМВГ-500.glb" },    
       { name: "ОПМВГ-600", path: "/models/upperModels/900/ОПМВГ-600.glb" },    
       { name: "ОПМВГ-800", path: "/models/upperModels/900/ОПМВГ-800.glb" },    
       { name: "ВПК-400", path: "/models/upperModels/900/ВПК-400.glb" },
       { name: "ВПК2-400", path: "/models/upperModels/900/ВПК2-400.glb" },


       { name: "ПУ-650", path: "/models/upperModels/ПУ-650.glb" },
       { name: "ПУ900-650", path: "/models/upperModels/ПУ-650-900.glb" },
       { name: "ПУЛ-650", path: "/models/upperModels/ПУЛ-650.glb" },
       { name: "ПУЛ900-650", path: "/models/upperModels/ПУЛ-650-900.glb" },

       { name: "ДЛП0,8-200", path: "/models/upperModels/ДЛПО-800.glb" },

       { name: "handle-1", path: "/models/handles/handle-1.glb" },
       { name: "handle-2", path: "/models/handles/handle-2.glb" },
       { name: "handle-3", path: "/models/handles/handle-3.glb" },

       { name: "facade-1", path: "/models/facade/facade-1.glb" },







       { name: "dw-450", path: "/models/dish-washer-450.glb" },
       { name: "dw-600", path: "/models/dish-washer-600.glb" },

     //  { name: "dw-450", path: "/models/dish-washer-450-2.glb" },
      //{ name: "dw-600", path: "/models/dish-washer-600-2.glb" },

      { name: "hood-600", path: "/models/hood.glb" },
      { name: "hood2-600", path: "/models/hood-3.glb" },
      { name: "hood2-450", path: "/models/hood-3-450.glb" },
      { name: "hood-400", path: "/models/hood-400.glb" },



      // модуль + встоенная духовка
      { name: "i-oven-600",   path: "/models/module-integrated-oven-600.glb", },
      { name: "i-oven-450",   path: "/models/module-integrated-oven-450.glb", },

      { name: "mc-450",   path: "/models/module-cooktop-450.glb", },
      { name: "mc-600",   path: "/models/module-cooktop-600.glb", },

      //модули мойки
      { name: "ms500", path: "/models/module-sink-500.glb" },
      { name: "ms800", path: "/models/module-sink-800.glb" },
      { name: "ms600", path: "/models/module-sink-600.glb" },


      { name: "module-sink-1000", path: "/models/module-sink-1000.glb" },
      { name: "module-sink-1000-left", path: "/models/module-sink-1000-left.glb",},
      { name: "module-sink-1000-left1",   path: "/models/module-sink-1000-left1.glb", },

      { name: "penal600-1", path: "/models/penal600-1.glb" },
      { name: "penal600-2", path: "/models/penal600-2.glb" },
    
      { name: "penal600-3", path: "/models/penal600-3.glb" },
      { name: "penal600-4", path: "/models/penal600-4.glb" },
      { name: "penal600-5", path: "/models/penal600-4.glb" },
      { name: "penal600-6", path: "/models/penal600-4.glb" },
      { name: "penal600-7", path: "/models/penal600-4.glb" },
      { name: "penal600-8", path: "/models/penal600-4.glb" },

      { name: "penal450-1", path: "/models/penal450-1.glb" },
      { name: "penal450-2", path: "/models/penal450-2.glb" },
      { name: "penal450-3", path: "/models/penal450-3.glb" },
      { name: "penal450-4", path: "/models/penal450-4.glb" },
      { name: "penal450-5", path: "/models/penal450-4.glb" },
      { name: "penal450-6", path: "/models/penal450-4.glb" },
      { name: "penal450-7", path: "/models/penal450-4.glb" },

      { name: "penal400-1", path: "/models/penal400-4.glb" },
      { name: "penal400-2", path: "/models/penal400-4.glb" },
      { name: "penal400-3", path: "/models/penal400-4.glb" },
      { name: "penal400-4", path: "/models/penal400-4.glb" },
      { name: "penal400-5", path: "/models/penal400-4.glb" },
      { name: "penal400-6", path: "/models/penal400-4.glb" },
      { name: "penal400-7", path: "/models/penal400-4.glb" },


      { name: "penal180-10", path: "/models/penal450-10.glb" },
      { name: "penal200-10", path: "/models/penal450-10.glb" },

      { name: "penal600-15", path: "/models/fridge.glb" },



      { name: "АНП-400", path: "/models/upperModels/АНП-400.glb" },
      { name: "АНП-450", path: "/models/upperModels/АНП-450.glb" },
      { name: "АНП-600", path: "/models/upperModels/АНП-600.glb" },
      { name: "АНП-180", path: "/models/upperModels/АНП-180.glb" },



      { name: "but", path: "/models/button.glb" },


      { name: "fridge",   path: "/models/fridge.glb", }, //холодильник
 
      { name: "sink-dsv2", path: "/models/sink-dsv2.glb" },
      { name: "sink5", path: "/models/sink5.glb" },

      { name: 'stove600', path: '/models/stove600.glb' },
      { name: 'stove450', path: '/models/stove600.glb' },

      { name: 'arrow', path: '/models/arrow.glb' },
      { name: 'icon', path: '/models/icon.glb' },
      { name: 'test', path: '/models/test.glb' },
      { name: 'box-for-hole', path: '/models/box-for-hole.glb' },

     
    ];

    path.forEach((item) => {
      this.loader.load(item.path, (glb) => {
        let object = glb.scene;
        // object.updateMatrixWorld(true);
        // const box = new THREE.Box3().setFromObject(object);
        // const center = new THREE.Vector3();
        // box.getCenter(center);
        // object.position.sub(center);

        const group = new THREE.Group();
        group.add(object);
        // object.traverse((child) => {
        //     if (child.isMesh) {
        //       addOutline(child)
        //     }
        //   });

        //материал для стекла
     


        //материал дял корпуса
         object.traverse((child) => {
          if (child.isMesh && child.name.toLowerCase().includes('panel')) {
            child.material = whiteMaterial;
          }
        });


          //отключить видимость заготовки для выреза столешницы
           object.traverse((child) => {
          if (child.isMesh && child.name.includes('BoxForHole')) {
            child.visible = false;
          }
        });

        

        group.visible = false;

      //  this.scene.add(group);
        // 🔥 Прожарка
      //  console.log(this.sceneMain.renderer);
        this.sceneMain.renderer.render(this.scene, this.sceneMain.camera);
        this.cache[item.name] = group;
     //   console.log(`Модель ${item.name} загружена и "прожарена"`);
      });
    });
  }

  updateMaterialTextures(material) {
  ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'].forEach((mapType) => {
    if (material[mapType]) {
    
      material[mapType].colorSpace = THREE.SRGBColorSpace;
      material[mapType].needsUpdate = true;
    }
  });
}

  get(name) {
    return this.cache[name] ? this.cache[name].clone(true) : null;
  }
}
