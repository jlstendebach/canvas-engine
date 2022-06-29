export class EventListener {
	constructor(callback, owner = null) {
		this.callback = (owner === null) ? callback : callback.bind(owner);
		this.owner = owner;
	}

	onEvent(type, event) {
		this.callback(type, event);
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
		let listenerList = this.listeners[type];
		if (listenerList !== undefined) {
			for (let i = 0; i < listenerList.length; i++) {
				if (listenerList[i].callback === callback && listenerList[i].owner === owner) {
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