import { EventListener } from "./EventListener.js";

/**
 * EventEmitter provides a simple implementation of the observer pattern, 
 * allowing you to add, remove, and emit events with associated listeners. 
 */
export class EventEmitter {
    #listeners = new Map(); // type => [EventListener]

    // MARK: - Listener Management ---------------------------------------------
    /**
     * Adds a listener for the specified event type. If the same callback and 
     * owner are already registered for the event type, the listener will not be 
     * added again.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @param {boolean} once - Whether the listener should be invoked only once.
     * @returns {boolean} Returns true if the listener was added, false if it already existed.
     */
    addListener(type, callback, owner = null, once = false) {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function");
        }

        let listenerList = this.#listeners.get(type);
        if (listenerList === undefined) {
            listenerList = [new EventListener(callback, owner, once)];
            this.#listeners.set(type, listenerList);
            return true;

        } else if (this.#indexOfListener(listenerList, callback, owner) >= 0) {
            // Listener already exists, do not add again
            return false; 
        }

        listenerList.push(new EventListener(callback, owner, once));
        return true;
    }

    /**
     * Removes a listener for the specified event type.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was found and removed, false otherwise.
     */
    removeListener(type, callback, owner = null) {
        const listenerList = this.#listeners.get(type);
        if (listenerList === undefined) {
            return false;
        }

        const index = this.#indexOfListener(listenerList, callback, owner);
        if (index < 0) {
            return false;
        }

        listenerList.splice(index, 1);
        if (listenerList.length === 0) {
            this.#listeners.delete(type);
        }

        return true;
    }

    /**
     * Removes all listeners for the specified event type.
     * @param {*} type - The event type. If omitted, removes all listeners for all event types.
     * @returns {boolean} Returns true if listeners were removed, false otherwise.
     */
    removeAllListeners(type = undefined) {
        if (type === undefined) {
            this.#listeners.clear();
            return true;
        } 
        return this.#listeners.delete(type);
    }

    /**
     * Checks if a listener is registered for the specified event type.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener is registered, false otherwise.
     */
    hasListener(type, callback, owner = null) {
        const listenerList = this.#listeners.get(type);
        if (listenerList === undefined) {
            return false;
        }
        return this.#indexOfListener(listenerList, callback, owner) !== -1;
    }

    /**
     * Gets the number of listeners for the specified event type.
     * @param {*} type - The event type.
     * @returns {number} Returns the number of listeners.
     */
    getListenerCount(type) {
        const listenerList = this.#listeners.get(type);
        if (listenerList === undefined) {
            return 0;
        }
        return listenerList.length;
    }

    /**
     * Gets an array of all event types that have registered listeners.
     * @returns {Array} Returns an array of event types with registered listeners.
     */
    getListenerTypes() {
        return Array.from(this.#listeners.keys());
    }

    // MARK: - Aliases ---------------------------------------------------------
    /**
     * Adds a listener for the specified event type. Alias for addListener with once=false.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was added, false if it already existed.
     */
    on(type, callback, owner = null) {
        return this.addListener(type, callback, owner, false);
    }

    /**
     * Adds a listener for the specified event type that will be invoked only 
     * once. Alias for addListener with once=true.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was added, false if it already existed.
     */
    once(type, callback, owner = null) {
        return this.addListener(type, callback, owner, true);
    }

    /**
     * Removes a listener for the specified event type. Alias for removeListener.
     * @param {*} type - The event type.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {boolean} Returns true if the listener was found and removed, false otherwise.
     */
    off(type, callback, owner = null) {
        return this.removeListener(type, callback, owner);
    }

    // MARK: - Event Emission --------------------------------------------------
    /**
     * Emits an event of the specified type, invoking all associated listeners
     * with the given event object.
     * @param {*} type - The event type.
     * @param {*} event - The event object to pass to listeners.
     * @throws {AggregateError} Throws an AggregateError if listeners throw errors during event emission.
     */
    emit(type, event) {
        const listenerList = this.#listeners.get(type);
        if (listenerList === undefined) {
            return;
        }

        // Use a shallow copy of the listener list to allow listeners to 
        // manipulate the list during event emission without affecting iteration.
        const snapshot = listenerList.slice();
        const errors = [];
        for (let i = 0; i < snapshot.length; i++) {
            const listener = snapshot[i];

            if (listener.once) {
                // Remove before callback invocation so 'once' remains correct
                // for re-entrant emits.
                const liveIndex = listenerList.indexOf(listener);
                if (liveIndex !== -1) {
                    listenerList.splice(liveIndex, 1);
                }
            }

            try {
                listener.onEvent(type, event);
            } catch (error) {
                errors.push(error);
            }
        }

        // If removeListener was called during event emission, this event type 
        // may have already been removed, then readded to the map as a new 
        // array. Double-check before deleting the listener list to avoid 
        // accidental deletion of a new listener list.
        if (listenerList.length === 0 && this.#listeners.get(type) === listenerList) {
            this.#listeners.delete(type);
        }                    

        // Throw an aggregate error after all listeners have been invoked. This 
        // also ensures that the listener list is properly cleaned up.
        if (errors.length > 0) {
            throw new AggregateError(errors, `Errors occurred while emitting event: ${type}`);
        }
    }

    // MARK: - Helpers ---------------------------------------------------------
    /**
     * Finds the index of a listener in the listener list using callback and 
     * owner for comparison. Should be better performance than using 
     * Array.findIndex with a callback function.
     * @param {Array} listenerList - The list of listeners.
     * @param {Function} callback - The callback function.
     * @param {*} owner - The owner object.
     * @returns {number} Returns the index of the listener, or -1 if not found.
     */
    #indexOfListener(listenerList, callback, owner) {
        for (let i = 0; i < listenerList.length; i++) {
            if (listenerList[i].matches(callback, owner)) {
                return i;
            }
        }
        return -1;
    }

}
