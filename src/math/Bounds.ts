export class Bounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;

    // MARK: - Properties
    set x(value: number) {
        this.maxX = value + this.width;
        this.minX = value;
    }
    get x(): number {
        return this.minX;
    }

    set y(value: number) {
        this.maxY = value + this.height;
        this.minY = value;
    }
    get y(): number {
        return this.minY;
    }

    set width(value: number) {
        this.maxX = this.minX + value;
    }
    get width(): number {
        return this.maxX - this.minX;
    }

    set height(value: number) {
        this.maxY = this.minY + value;
    }
    get height(): number {
        return this.maxY - this.minY;
    }

    get centerX(): number {
        return (this.minX + this.maxX) / 2;
    }

    get centerY(): number {
        return (this.minY + this.maxY) / 2;
    }

    // MARK: - Initialization
    constructor(
        minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity
    ) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    // MARK: - Bounds manipulation
    set(minX, minY, maxX, maxY) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        return this;
    }

    reset() {
        this.minX = Infinity;
        this.maxX = -Infinity;
        this.minY = Infinity;
        this.maxY = -Infinity;
        return this;
    }

    addPointXY(x, y) {
        if (x < this.minX) { this.minX = x; }
        if (y < this.minY) { this.minY = y; }
        if (x > this.maxX) { this.maxX = x; }
        if (y > this.maxY) { this.maxY = y; }
        return this;
    }

    addPoint(point) {
        return this.addPointXY(point.x, point.y);
    }

    addBounds(bounds) {
        if (bounds.minX < this.minX) { this.minX = bounds.minX; }
        if (bounds.minY < this.minY) { this.minY = bounds.minY; }
        if (bounds.maxX > this.maxX) { this.maxX = bounds.maxX; }
        if (bounds.maxY > this.maxY) { this.maxY = bounds.maxY; }
        return this;
    }

    // MARK: - Bounds queries
    containsPointXY(x, y) {
        return (
            x >= this.minX &&
            x <= this.maxX &&
            y >= this.minY &&
            y <= this.maxY
        );
    }

    containsPoint(point) {
        return this.containsPointXY(point.x, point.y);
    }

    intersects(other) {
        return (
            this.maxX >= other.minX &&
            this.minX <= other.maxX &&
            this.maxY >= other.minY &&
            this.minY <= other.maxY
        );
    }

    equals(other) {
        return (
            this.minX === other.minX &&
            this.minY === other.minY &&
            this.maxX === other.maxX &&
            this.maxY === other.maxY
        );
    }

    isEmpty() {
        return (
            this.minX >= this.maxX ||
            this.minY >= this.maxY
        );
    }

    // MARK: - Utilities
    clone() {
        return new Bounds(this.minX, this.minY, this.maxX, this.maxY);
    }

    copy(other) {
        this.minX = other.minX;
        this.minY = other.minY;
        this.maxX = other.maxX;
        this.maxY = other.maxY;
        return this;
    }
}