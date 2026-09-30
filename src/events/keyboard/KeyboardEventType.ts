export const KeyboardEventType = Object.freeze({
    DOWN: "KeyboardEventDown",
    REPEAT: "KeyboardEventRepeat",
    UP: "KeyboardEventUp"
} as const);

export type KeyboardEventType = (typeof KeyboardEventType)[keyof typeof KeyboardEventType];