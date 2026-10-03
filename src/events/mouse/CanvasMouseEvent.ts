
import type { View } from "../../graphics/views/core/View.js";
import type { MouseButton } from "./MouseButton.js";
import type { MouseEventType } from "./MouseEventType.js";

export class CanvasMouseEvent {
    type: MouseEventType | null = null;

    constructor(type: MouseEventType | null = null) {
        this.type = type;
    }

    canvasX: number = 0;
    canvasY: number = 0;
    canvasMovementX: number = 0;
    canvasMovementY: number = 0;

    parentX: number = 0;
    parentY: number = 0;
    parentMovementX: number = 0;
    parentMovementY: number = 0;

    x: number = 0;
    y: number = 0;
    movementX: number = 0;
    movementY: number = 0;

    wheelX: number = 0;
    wheelY: number = 0;
    wheelZ: number = 0;

    button: MouseButton | null = null;
    buttons: number = 0;
    target: View | null = null;
    related: View | null = null;

    // MARK: - Utilities
    clone(): CanvasMouseEvent {
        const event = new CanvasMouseEvent();

        event.canvasX = this.canvasX;
        event.canvasY = this.canvasY;
        event.canvasMovementX = this.canvasMovementX;
        event.canvasMovementY = this.canvasMovementY;

        event.parentX = this.parentX;
        event.parentY = this.parentY;
        event.parentMovementX = this.parentMovementX;
        event.parentMovementY = this.parentMovementY;

        event.x = this.x;
        event.y = this.y;
        event.movementX = this.movementX;
        event.movementY = this.movementY;

        event.wheelX = this.wheelX;
        event.wheelY = this.wheelY;
        event.wheelZ = this.wheelZ;

        event.button = this.button;
        event.buttons = this.buttons;
        event.target = this.target;
        event.related = this.related;

        return event;
    }

    copy(other: CanvasMouseEvent): this {
        this.type = other.type;

        this.canvasX = other.canvasX;
        this.canvasY = other.canvasY;
        this.canvasMovementX = other.canvasMovementX;
        this.canvasMovementY = other.canvasMovementY;

        this.parentX = other.parentX;
        this.parentY = other.parentY;
        this.parentMovementX = other.parentMovementX;
        this.parentMovementY = other.parentMovementY;

        this.x = other.x;
        this.y = other.y;
        this.movementX = other.movementX;
        this.movementY = other.movementY;

        this.wheelX = other.wheelX;
        this.wheelY = other.wheelY;
        this.wheelZ = other.wheelZ;

        this.button = other.button;
        this.buttons = other.buttons;
        this.target = other.target;
        this.related = other.related;

        return this;
    }

    isPressed(button: MouseButton): boolean {
        return (this.buttons & button) !== 0;
    }

}