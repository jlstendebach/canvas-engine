export class Timer {
    #startTime: number;

    constructor(now: number = performance.now()) {
        this.#startTime = now;
    }

    reset(now: number = performance.now()): void {
        this.#startTime = now;
    }

    elapsed(now: number = performance.now()): number {
        return now - this.#startTime;
    }
}