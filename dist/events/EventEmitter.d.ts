/**
 * EventEmitter provides a simple implementation of the observer pattern,
 * allowing you to add, remove, and emit events with associated listeners.
 */
export declare class EventEmitter {
    #private;
    /**
     * Adds a listener for the specified event type. If the same callback and
     * owner are already registered for the event type, the listener will not be
     * added again.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @param {boolean} once - Whether the listener should be invoked only once.
     * @returns {boolean} Returns true if the listener was added, false if it already existed.
     * @throws {TypeError} Throws if the event type is not defined or the callback is not a function.
     */
    addListener(type: any, callback: Function, owner?: any, once?: boolean): boolean;
    /**
     * Removes a listener for the specified event type.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was found and removed, false otherwise.
     */
    removeListener(type: any, callback: Function, owner?: any): boolean;
    /**
     * Removes all listeners for the specified event type.
     * @param {*} type - The event type. If omitted, removes all listeners for all event types.
     * @returns {boolean} Returns true if listeners were removed, false otherwise.
     */
    removeAllListeners(type: any): boolean;
    /**
     * Checks if a listener is registered for the specified event type.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener is registered, false otherwise.
     */
    hasListener(type: any, callback: Function, owner?: any): boolean;
    /**
     * Gets the number of listeners for the specified event type.
     * @param {*} type - The event type.
     * @returns {number} Returns the number of listeners.
     */
    getListenerCount(type: any): number;
    /**
     * Gets an array of all event types that have registered listeners.
     * @returns {Array} Returns an array of event types with registered listeners.
     */
    getListenerTypes(): any[];
    /**
     * Adds a listener for the specified event type. Alias for addListener with once=false.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was added, false if it already existed.
     */
    on(type: any, callback: Function, owner?: any): boolean;
    /**
     * Adds a listener for the specified event type that will be invoked only
     * once. Alias for addListener with once=true.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was added, false if it already existed.
     */
    once(type: any, callback: Function, owner?: any): boolean;
    /**
     * Removes a listener for the specified event type. Alias for removeListener.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was found and removed, false otherwise.
     */
    off(type: any, callback: Function, owner?: any): boolean;
    /**
     * Emits an event of the specified type, invoking all associated listeners
     * with the given event object.
     * @param {*} type - The event type.
     * @param {*} event - The event object to pass to listeners.
     * @throws {AggregateError} Throws an AggregateError if listeners throw errors during event emission.
     */
    emit(type: any, event: any): void;
}
