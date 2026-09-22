/**
 * Signature for event callbacks. Parameters are `any` rather than `unknown`
 * so that callbacks with narrower parameter types (e.g. `(type: string, e: PointerEvent) => void`)
 * remain assignable under `strictFunctionTypes`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventCallback = (type: any, event: any) => void;

/**
 * Internal helper used by EventEmitter to store listener metadata.
 */
export class EventListener {
    readonly #callback: EventCallback;
    readonly #owner: object | null;
    readonly #boundCallback: EventCallback;
    readonly #once: boolean;

    constructor(
        callback: EventCallback,
        owner: object | null = null,
        once: boolean = false
    ) {
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
    get once(): boolean {
        return this.#once;
    }

    // MARK: - Methods
    /**
     * Invokes the callback function for this event listener.
     * @param {*} type - The event type.
     * @param {*} event - The event object.
     */
    onEvent(type: unknown, event: unknown): void {
        this.#boundCallback(type, event);
    }

    /**
     * Checks if this event listener matches the given callback and owner.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener matches, false otherwise.
     */
    matches(callback: EventCallback, owner: object | null): boolean {
        return this.#callback === callback && this.#owner === owner;
    }
}