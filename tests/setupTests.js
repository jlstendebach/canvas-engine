/**
 * Jest setup file to mock WebGL contexts and canvas methods for testing.
 * This allows tests to run in environments without actual WebGL support.
 * It mocks the WebGLRenderingContext and WebGL2RenderingContext constructors,
 * as well as the getContext method of HTMLCanvasElement to return a mock 
 * context.
 */
if (typeof window !== 'undefined') {
    if (!window.WebGLRenderingContext) {
        window.WebGLRenderingContext = class { };
        globalThis.WebGLRenderingContext = window.WebGLRenderingContext;
    }
    if (!window.WebGL2RenderingContext) {
        window.WebGL2RenderingContext = class { };
        globalThis.WebGL2RenderingContext = window.WebGL2RenderingContext;
    }

    HTMLCanvasElement.prototype.getContext = function () {
        return {
            viewport: () => {},
            save: () => {},     
            restore: () => {}, 
            clearRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            fill: () => {},
            translate: () => {},
            rotate: () => {},
            scale: () => {},
        };
    };
}