import { Vec2 } from "../../math/Vec2.js";

/**
 * A representational Vec2 object that notifies observers when its components 
 * change. Use raw() to get a standard Vec2 object with the same values.
 * 
 * @example
 * class MyClass {
 *     #position = new ObservableVec2(0, 0, () => this.#onPositionChanged());
 *     
 *     set position(value) { // <-- pass in a Vec2 object
 *         this.#position.copy(value);
 *     }
 *     get position() { 
 *         return this.#position; // <-- returns an ObservableVec2 object
 *     }
 * 
 *     #onPositionChanged() {
 *         // Handle position change here
 *         const newX = this.#position.x.toFixed(1);
 *         const newY = this.#position.y.toFixed(1);
 *         console.log(`New position: (${newX}, ${newY})`);
 *     }
 * }
 * 
 * const obj = new MyClass();
 * obj.position = new Vec2(10, 20); // prints "New position: (10, 20)"
 * obj.position.x = 30;             // prints "New position: (30, 20)"
 * obj.position.y = 40;             // prints "New position: (30, 40)"
 * obj.position.set(50, 60);        // prints "New position: (50, 60)"
 * 
 * let position = obj.position.raw(); // Get a standard Vec2 object
 * position.rotate(Math.PI / 4).scale(2); // Will not trigger the onChange callback
 * obj.position = position; // prints "New position: (-14.1, 155.6)"
 */
export class ObservableVec2 {
    // MARK: - Statics
    static #NOOP = () => {};

    // MARK: - Fields
    #x; 
    #y; 
    #onChange;

    // MARK: - Accessors
    get x() { 
        return this.#x; 
    }
    set x(value) {
        if (this.#x === value) { return; }
        this.#x = value;
        this.#onChange();
    }

    get y() { 
        return this.#y; 
    }
    set y(value) {
        if (this.#y === value) { return; }
        this.#y = value;
        this.#onChange();
    }

    // MARK: - Initialization
    constructor(x, y, onChange) {
        this.#x = x;
        this.#y = y;
        this.#onChange = onChange ?? ObservableVec2.#NOOP;
    }

    // MARK: - Methods
    set(x, y) {
        if (this.#x === x && this.#y === y) { return this; }
        this.#x = x;
        this.#y = y;
        this.#onChange();
        return this;
    }

    copy(v) {
        return this.set(v.x, v.y);
    }

    raw() {
        return new Vec2(this.#x, this.#y);
    }
}