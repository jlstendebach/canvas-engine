/**
 * Signature for event callbacks. Parameters are `any` rather than `unknown`
 * so that callbacks with narrower parameter types (e.g. `(type: string, e: PointerEvent) => void`)
 * remain assignable under `strictFunctionTypes`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventCallback = (type: any, event: any) => void;