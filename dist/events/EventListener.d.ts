/**
 * Internal helper used by EventEmitter to store listener metadata.
 */
export declare class EventListener {
    #private;
    constructor(callback: any, owner?: any, once?: boolean);
    /**
     * Gets a value indicating whether this event listener should be invoked only once.
     * @returns {boolean} Returns true if the listener should be invoked only once, false otherwise.
     */
    get once(): boolean;
    /**
     * Invokes the callback function for this event listener.
     * @param {*} type - The event type.
     * @param {*} event - The event object.
     */
    onEvent(type: any, event: any): void;
    /**
     * Checks if this event listener matches the given callback and owner.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener matches, false otherwise.
     */
    matches(callback: Function, owner: any): boolean;
}
