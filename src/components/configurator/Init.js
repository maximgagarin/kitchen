import { excel } from "./builders/resultData";
import { excel2level } from "./builders/resultData2level";
import { excel2level  as level900} from "./builders/resultData2level900";

export class Init {
    constructor(){

    }

    start(){
        excel() 
        excel2level()
        level900()
    }
}