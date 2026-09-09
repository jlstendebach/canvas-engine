export class Profiler {
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
    constructor(sampleCount: any);
    lastTime: number;
    accumTime: number;
    cachedTotal: number;
    samples: number[];
    start(): void;
    accumulate(): void;
    mark(): void;
    getTime(): number;
}
export namespace Profiler {
    let profilers: {};
}
//# sourceMappingURL=Profiler.d.ts.map