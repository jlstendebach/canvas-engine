/**
 * Internal helper used by EventEmitter to store listener metadata.
 */
export class EventListener {
	#callback = null;
	#owner = null;
	#boundCallback = null;
	#once = false;

	constructor(callback, owner = null, once = false) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function");
        }

		this.#callback = callback;
		this.#owner = owner;
        this.#boundCallback = owner === null ? callback : callback.bind(owner);
        this.#once = once === true; // Ensure once is a boolean
	}

    /** 
     * Gets a value indicating whether this event listener should be invoked only once.
     * @returns {boolean} Returns true if the listener should be invoked only once, false otherwise.
     */
    get once() {
        return this.#once;
    }

    // MARK: - Methods
    /**
     * Invokes the callback function for this event listener.
     * @param {*} type - The event type.
     * @param {*} event - The event object.
     */
	onEvent(type, event) {
		this.#boundCallback(type, event);
	}
    
    /**
     * Checks if this event listener matches the given callback and owner.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener matches, false otherwise.
     */
    matches(callback, owner) {
        return this.#callback === callback && this.#owner === owner;
    }
}