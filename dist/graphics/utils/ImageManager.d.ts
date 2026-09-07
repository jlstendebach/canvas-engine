export declare class ImageManager {
    #private;
    /**
     * Loads an image from the given path, optionally registering an alias for
     * it.
     * @param {string} path - The path to the image file.
     * @param {string|null} alias - An optional alias to register for the image.
     * @returns {Promise<HTMLImageElement>} A promise that resolves to the
     *     loaded image.
     * @throws {Error} - Throws if the image fails to load.
     */
    load(path: string, alias?: string | null): Promise<HTMLImageElement>;
    /**
     * Loads multiple images at once, each with an optional alias.
     * @param {{ path: string, alias?: string|null }[]} imagePaths - An array of
     *     objects, each containing a path and optional alias.
     * @returns {Promise<HTMLImageElement[]>} A promise that resolves to an
     *     array of loaded images.
     * @throws {AggregateError} - Throws an AggregateError if one or more images
     *     fail to load. Will not stop other images from loading.
     */
    loadAll(imagePaths: {
        path: string;
        alias?: string | null;
    }[]): Promise<HTMLImageElement[]>;
    /**
     * Registers an image with the given path and optional alias. If an existing
     * alias conflicts with the path, the alias will be removed to avoid
     * confusion and a warning will be logged.
     * @param {string} path - The path to the image file.
     * @param {HTMLImageElement} image - The image element to register.
     * @param {string|null} alias - An optional alias to register for the image.
     */
    register(path: string, image: HTMLImageElement, alias?: string | null): void;
    /**
     * Returns the image associated with the given alias or path.
     * @param {string} aliasOrPath - The alias or path of the image to retrieve.
     * @returns {HTMLImageElement|undefined} The image element, or undefined if
     *     no image is registered under the given path or alias.
     */
    get(aliasOrPath: string): HTMLImageElement | undefined;
    /**
     * Returns true if the given alias or path exists, false otherwise.
     * @param {string} aliasOrPath - The alias or path of the image to check.
     * @returns {boolean} True if the image exists, false otherwise.
     */
    has(aliasOrPath: string): boolean;
    /**
     * Creates an alias for an already-loaded image path.
     * @param {string} alias - The alias to add.
     * @param {string} path - The path the alias points to.
     * @throws {Error} - Throws if the alias matches an existing path, or if the
     *     path does not exist.
     */
    setAlias(alias: string, path: string): void;
    /**
     * Removes the given alias.
     * @param {string} alias - The alias to remove.
     */
    removeAlias(alias: string): void;
    /**
     * Returns true if the given alias exists, false otherwise.
     * @param {string} alias - The alias to check.
     * @returns {boolean} True if the alias exists, false otherwise.
     */
    hasAlias(alias: string): boolean;
    /**
     * Returns true if the given path exists, false otherwise.
     * @param {string} path - The path to check.
     * @returns {boolean} True if the path exists, false otherwise.
     */
    hasPath(path: string): boolean;
    /**
     * Unloads the image at the given path and automatically removes any
     * associated aliases.
     * @param {string} path - The path of the image to unload.
     */
    unload(path: string): void;
    /**
     * Unloads all images and clears all aliases.
     */
    clear(): void;
}
