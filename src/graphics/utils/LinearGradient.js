class LinearGradient {
  constructor(context, x1=0, y1=0, x2=0, y2=0) {
    this.gradient = context.createLinearGradient()
    this.p1 = new Vec2(x1, y1);
    this.p2 = new Vec2(x2, y2);
    
  }
  
}