export class SelectedObject {
  constructor() {
   // this.sceneSetup = sceneSetup;
    this.selectedObject = false;
    this.subscribers = [];
  }

  setSelectedObject(obj) {
    this.selectedObject = obj;
    this.notifySubscribers(obj);
  }
  notifySubscribers(obj) {
    this.subscribers.forEach((subscriber) => {
      subscriber.updateSelectedObject(obj);
    });
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }
}
