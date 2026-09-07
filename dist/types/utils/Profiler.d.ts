export declare class Profiler {
    lastTime: number;
    accumTime: number;
    cachedTotal: number;
    samples: number[];
    constructor(sampleCount: any);
    start(): void;
    accumulate(): void;
    mark(): void;
    getTime(): number;
    static start(name: any, sampleCount?: number): void;
    static mark(name: any): void;
    static accumulate(name: any): void;
    static getTime(name: any): any;
    static profile(method: any, iterations: any): {
        total: number;
        average: number;
        min: number;
        max: number;
    };
    static currentTime(): number;
}
export declare namespace Profiler {
    var profilers: {};
}
