export class SelectedManager{
    constructor(){
        this.selectedObject = null
        this.listeners = []
    }

    setSelected(selectedObject){
        this.selectedObject = selectedObject
        this.listeners.forEach(item=>{
            item.selectedObject = selectedObject
        })
    }
}