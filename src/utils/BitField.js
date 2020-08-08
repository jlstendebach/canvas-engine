class BitField {
  constructor() {
    this.flags = BitField.toInt32(0);
  }
  

  // ---------------------------------------------------------------------------
  hasFlags(flags) {
    return (this.flags & flags) === flags;
  }
  
  addFlags(flags) {
    this.flags |= flags;
  }
  
  removeFlags(flags) {
    this.flags &= ~flags;
  }  
  
  
  // --[ helpers ]--------------------------------------------------------------
  static toInt32(value) {
    // The output of a bitwise operation is a 32-bit signed integer.
    return value | 0;
  }
  
}