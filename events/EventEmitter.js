export class EventListener {
    #callback = null;
    #owner = null;
    #boundCallback = null;

	constructor(callback, owner = null) {
		this.#callback = callback;        
		this.#owner = owner;
        this.#boundCallback = callback === null ? callback : callback.bind(owner);
	}

	onEvent(type, event) {
		this.#boundCallback(type, event);
	}

    isEqual(other) {
        return this.#callback === other.#callback && this.#owner === other.#owner;
    }
}

export class EventEmitter {
	constructor() {
		this.listeners = {}; // type => [EventListener]
	}

	add(type, callback, owner = null) {
		let listenerList = this.listeners[type];
		if (listenerList === undefined) {
			listenerList = [];
			this.listeners[type] = listenerList;
		}

		listenerList.push(new EventListener(callback, owner));
	}

	remove(type, callback, owner = null) {
		const listenerList = this.listeners[type];
		if (listenerList !== undefined) {
            const listenerToRemove = new EventListener(callback, owner);
			for (let i = 0; i < listenerList.length; i++) {
				if (listenerList[i].isEqual(listenerToRemove)) {
					listenerList.splice(i, 1);
					return;
				}
			}
		}
	}

	emit(type, event) {
		let listenerList = this.listeners[type];
		if (listenerList !== undefined) {
			for (let i = 0; i < listenerList.length; i++) {
				listenerList[i].onEvent(type, event);
			}
		}
	}

}