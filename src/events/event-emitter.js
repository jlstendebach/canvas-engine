class EventListener {
  constructor(callback, owner=null) {
    this.callback = callback;
    this.owner = owner;
    if (owner !== null) {
      this.callback.bind(owner);
    }
  }

  onEvent(type, event) {
    this.callback(type, event);
  }  
}



class EventEmitter {
  constructor() {
    this.listeners = {}; // type => [EventListener]
  }

  add(type, callback, owner=null) {
    var listenerList = this.listeners[type];
    if (typeof listenerList === "undefined") {
      listenerList = [];
      this.listeners[type] = listenerList;
    }  
    
    listenerList.push(new EventListener(callback, owner));
  }

  remove(type, callback, owner=null) {
    var listenerList = this.listeners[type];
    if (typeof listenerList !== "undefined") {
      for (var i=0; i<listenerList.length; i++) {
        if (listenerList[i].callback === callback && listenerList[i].owner === owner) {
          listenerList.splice(i, 1);
          return;
        }
      }
    }  
  }

  emit(type, event) {
    var listenerList = this.listeners[type];
    if (typeof listenerList !== "undefined") {
      for (var i=0; i<listenerList.length; i++) {
        listenerList[i].onEvent(type, event);
      }
    }
  }

}