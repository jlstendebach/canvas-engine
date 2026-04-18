export class Timer {
    #startTime = performance.now();

	constructor() {}

	start() {
		this.#startTime = performance.now();
	}

	getTime() {
		return performance.now() - this.#startTime;
	}
}