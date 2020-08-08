class Profiler {
  constructor(sampleCount) {  
    this.lastTime = Profiler.currentTime();
    this.accumTime = -1;
    this.cachedTotal = 0;
    this.samples = [];
    
    for (let i=0; i<sampleCount; ++i) {
      this.samples.push(0);
    }
  }

  // ---------------------------------------------------------------------------
  start() { 
    this.lastTime = Profiler.currentTime(); 
  }
  
  accumulate() {
    if (this.accumTime === -1) { this.accumTime = 0; }
    this.accumTime += Profiler.currentTime() - this.lastTime;
  }
  
  mark() { 
    let time = 0;
    if (this.accumTime === -1) {
      time = Profiler.currentTime() - this.lastTime

    } else {
      time = this.accumTime;
      this.accumTime = -1;
    }
    
    
    // Add the new time, remove the oldest time.
    this.samples.push(time);
    this.cachedTotal += time - this.samples.shift();
  }
  
  getTime() {
    return this.cachedTotal/this.samples.length;
  }

  
  // --[ static profilers ]-----------------------------------------------------
  static start(name, sampleCount=10) {
    if (!Profiler.profilers.hasOwnProperty(name)) {
      Profiler.profilers[name] = new Profiler(sampleCount);
    }
    Profiler.profilers[name].start();
  }

  static mark(name) {
    Profiler.profilers[name].mark();
  }
  
  static accumulate(name) {
    Profiler.profilers[name].accumulate();
  }
  
  static getTime(name) {
    return Profiler.profilers[name].getTime();
  }
  
  
  // --[ method profiling ]-----------------------------------------------------
  static profile(method, iterations) {
    let min = 1000000000; // over 11.5 days should be good enough
    let max = 0;
    let start = Profiler.currentTime();
    let itrStart = 0;
    let itrTime = 0;
    
    for (let i=0; i<iterations; ++i) {
      itrStart = Profiler.currentTime();
      method();
      itrTime = Profiler.currentTime() - itrStart;

      min = Math.min(min, itrTime);
      max = Math.max(max, itrTime);
    }
    
    let total = Profiler.currentTime() - start;
    
    return {
      total: total,
      average: total / iterations,
      min: min,
      max: max
    };
  }
  
  
  // --[ convenience methods ]--------------------------------------------------
  static currentTime() {
    return performance.now();
  }
  
}

Profiler.profilers = {};