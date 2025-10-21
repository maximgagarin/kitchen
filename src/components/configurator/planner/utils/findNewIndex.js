import { plannerConfig } from "../planerConfig"

export  function  findNewIndex(position){
    let count = 0   
    modelsDirect.forEach(model=>{
        if(model.root.position.x < position){
            count++
        }
    })



    return count
}

export function setIndex(){
    plannerConfig.modelsDirect.sort((a, b) => a.root.position.x - b.root.position.x);
    for(i=0 ; i<planerConfig.modelsDirect.length; i++){
        plannerConfig.modelsDirect[i].slot = i
    }
}