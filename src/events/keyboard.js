class Keyboard {
  static eventEmitter = null;
  static down = {};
  
  // ---------------------------------------------------------------------------
  static init() {
    if (!Keyboard.isInit()) {
      Keyboard.eventEmitter = new EventEmitter();
      document.addEventListener("keydown", Keyboard.onKeyDown);
      document.addEventListener("keyup", Keyboard.onKeyUp);
    }
  }
  
  static isInit() { 
    return Keyboard.eventEmitter !== null; 
  }
  
  // --[ polling ]--------------------------------------------------------------
  static isKeyDown(key) {
    return typeof Keyboard.down[key] !== "undefined";
  }
  
  // --[ events ]---------------------------------------------------------------
  static onKeyDown(event) {
    if (!Keyboard.isKeyDown(event.code)) {
      Keyboard.down[event.key] = true;
      Keyboard.down[event.code] = true;
      Keyboard.eventEmitter.emit("KeyDownEvent", event);
    }
  }

  static onKeyUp(event) {
    delete Keyboard.down[event.key];
    delete Keyboard.down[event.code];
    Keyboard.eventEmitter.emit("KeyUpEvent", event);
  }
  
  static addEventListener(type, callback, owner=null) {
    if (type === "KeyDownEvent" || type === "KeyUpEvent") {
      Keyboard.eventEmitter.add(type, callback, owner);
    }
  }

  static removeEventListener(type, callback, owner=null) {
    if (type === "KeyDownEvent" || type === "KeyUpEvent") {
      Keyboard.eventEmitter.remove(type, callback, owner);
    }
  }
}


window.addEventListener("load", function() {
  window.removeEventListener("load", this);
  Keyboard.init();
});