/**
 * Jest setup file to mock WebGL contexts and canvas methods for testing.
 * This allows tests to run in environments without actual WebGL support.
 * It mocks the WebGLRenderingContext and WebGL2RenderingContext constructors,
 * as well as the getContext method of HTMLCanvasElement to return a mock 
 * context.
 */

if (typeof window !== 'undefined') {
    // MARK: - document
    Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
        configurable: true
    });

    // MARK: - MutationObserver
    if (!window.MutationObserver) {
        window.MutationObserver = class {
            constructor(callback) { void callback; }
            disconnect() {}
            observe(element, options) { void element; void options; }
            takeRecords() { return []; }
        };
        globalThis.MutationObserver = window.MutationObserver;
    }

    // MARK: - ResizeObserver
    if (!window.ResizeObserver) {
        window.ResizeObserver = class {
            constructor(callback) { void callback; }
            disconnect() {}
            observe(element, options) { void element; void options; }
            unobserve(element) { void element; }
        };
        globalThis.ResizeObserver = window.ResizeObserver;
    }

    // MARK: - HTMLCanvasElement
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
            drawImage: () => {},
            fillRect: () => {},
        };
    };

    // MARK: - WebGL contexts
    if (!window.WebGLRenderingContext) {
        window.WebGLRenderingContext = class { };
        globalThis.WebGLRenderingContext = window.WebGLRenderingContext;
    }
    if (!window.WebGL2RenderingContext) {
        window.WebGL2RenderingContext = class { };
        globalThis.WebGL2RenderingContext = window.WebGL2RenderingContext;
    }
}