export class Bounds {
    minX; maxX; minY; maxY;

    get width() {
        return this.maxX - this.minX;
    }

    get height() {
        return this.maxY - this.minY;
    }

    // MARK: - Initialization
    constructor(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    // MARK: - Bounds manipulation
    set(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    reset() {
        this.minX = Infinity;
        this.maxX = -Infinity;
        this.minY = Infinity;
        this.maxY = -Infinity;
    }

    addPoint(x, y) {
        if (x < this.minX) { this.minX = x; }
        if (y < this.minY) { this.minY = y; }
        if (x > this.maxX) { this.maxX = x; }
        if (y > this.maxY) { this.maxY = y; }
    }

    addBounds(bounds) {
        if (bounds.minX < this.minX) { this.minX = bounds.minX; }
        if (bounds.minY < this.minY) { this.minY = bounds.minY; }
        if (bounds.maxX > this.maxX) { this.maxX = bounds.maxX; }
        if (bounds.maxY > this.maxY) { this.maxY = bounds.maxY; }
    }

    // MARK: - Bounds queries
    containsPoint(x, y) {
        return (
            x >= this.minX && 
            x <= this.maxX && 
            y >= this.minY && 
            y <= this.maxY
        );
    }

    intersects(other) {
        return (
            this.maxX >= other.minX && 
            this.minX <= other.maxX && 
            this.maxY >= other.minY && 
            this.minY <= other.maxY
        );
    }

    isEmpty() {
        return (
            this.minX >= this.maxX || 
            this.minY >= this.maxY
        );
    }
}