class Timer {
	constructor() {
		this.startTime = performance.now();
	}

	start() {
		this.startTime = performance.now();
	}

	getTime() {
		return (performance.now() - this.startTime);
	}
}