/**
 * Parent space:
 * - Coordinates relative to the parent view's position.
 * - A point at (0, 0) is the origin of the parent view.
 * - A point at (position.x, position.y) represents the origin of this view.
 * 
 * Local space: 
 * - Coordinates relative to this view's position. 
 * - A point at (0, 0) represents the origin of this view.
 * 
 * Child space:
 * - Coordinates relative to this view's children before any transformations.
 * - If this view has no transformations, then local space and child space are the same.
 * - If this view has transformations (translation, rotation, scale), then child
 *   space is the coordinate space of the children before any transformations 
 *   are applied.
 */
export const CoordinateSpace = Object.freeze({
    LOCAL: 0,
    CONTENT: 1,
});