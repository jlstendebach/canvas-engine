export class ImageManager {
    #images = new Map();
    #aliases = new Map();

    // -------------------------------------------------------------------------
    // MARK: - Loading
    // -------------------------------------------------------------------------

    /**
     * Loads an image from the given path, optionally registering an alias for 
     * it.
     * @param {string} path - The path to the image file.
     * @param {string|null} alias - An optional alias to register for the image.
     * @returns {Promise<HTMLImageElement>} A promise that resolves to the 
     *     loaded image.
     * @throws {Error} - Throws if the image fails to load.
     */
    async load(path, alias = null) {
        let image = this.get(path);
        if (!image) {
            image = await new Promise((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error(`Failed to load image at ${path}`));
                image.src = path;
            });
        }
        this.register(path, image, alias);
        return image;
    }

    /**
     * Loads multiple images at once, each with an optional alias.
     * @param {{ path: string, alias?: string|null }[]} imagePaths - An array of
     *     objects, each containing a path and optional alias.
     * @returns {Promise<HTMLImageElement[]>} A promise that resolves to an 
     *     array of loaded images.
     * @throws {AggregateError} - Throws an AggregateError if one or more images 
     *     fail to load. Will not stop other images from loading.
     */
    async loadAll(imagePaths) {
        const errors = [];

        const promises = imagePaths.map(async ({ path, alias }) => {
            try {
                return await this.load(path, alias);
            } catch (error) {
                errors.push(error);
            }
        });
        const images = await Promise.all(promises);

        if (errors.length > 0) {
            throw new AggregateError(errors, "One or more images failed to load.");
        }
        return images;
    }

    // -------------------------------------------------------------------------
    // MARK: - Image Management 
    // -------------------------------------------------------------------------

    /**
     * Registers an image with the given path and optional alias. If an existing
     * alias conflicts with the path, the alias will be removed to avoid 
     * confusion and a warning will be logged.
     * @param {string} path - The path to the image file.
     * @param {HTMLImageElement} image - The image element to register.
     * @param {string|null} alias - An optional alias to register for the image.
     */
    register(path, image, alias = null) {
        this.#images.set(path, image);

        // Paths and aliases should not conflict. If an alias is the same as a 
        // path, remove the alias to avoid confusion.
        if (this.hasAlias(path)) {
            this.removeAlias(path);
            console.warn(`Alias "${path}" removed to avoid conflict with image path.`);
        }

        if (alias) {
            this.setAlias(alias, path);
        }
    }

    /**
     * Returns the image associated with the given alias or path.
     * @param {string} aliasOrPath - The alias or path of the image to retrieve.
     * @returns {HTMLImageElement|undefined} The image element, or undefined if 
     *     no image is registered under the given path or alias.
     */
    get(aliasOrPath) {
        const path = this.#resolveToPath(aliasOrPath);
        return this.#images.get(path);
    }

    /**
     * Returns true if the given alias or path exists, false otherwise.
     * @param {string} aliasOrPath - The alias or path of the image to check.
     * @returns {boolean} True if the image exists, false otherwise.
     */
    has(aliasOrPath) {
        return this.hasAlias(aliasOrPath) || this.hasPath(aliasOrPath);
    }

    // -------------------------------------------------------------------------
    // MARK: - Name Management
    // -------------------------------------------------------------------------

    /**
     * Creates an alias for an already-loaded image path.
     * @param {string} alias - The alias to add.
     * @param {string} path - The path the alias points to.
     * @throws {Error} - Throws if the alias matches an existing path, or if the
     *     path does not exist.
     */
    setAlias(alias, path) {
        // Paths and aliases should not conflict. If an alias is the same as a
        // path, disallow the alias to avoid confusion.
        if (this.hasPath(alias)) {
            throw new Error(`Alias "${alias}" conflicts with an existing image path.`);
        }

        // Ensure the path exists before creating an alias for it.
        if (!this.hasPath(path)) {
            throw new Error(`Cannot create alias "${alias}" for non-existent path "${path}".`);
        }

        this.#aliases.set(alias, path);
    }

    /**
     * Removes the given alias.
     * @param {string} alias - The alias to remove.
     */
    removeAlias(alias) {
        this.#aliases.delete(alias);
    }

    /**
     * Returns true if the given alias exists, false otherwise.
     * @param {string} alias - The alias to check.
     * @returns {boolean} True if the alias exists, false otherwise.
     */
    hasAlias(alias) {
        return this.#aliases.has(alias);
    }

    /**
     * Returns true if the given path exists, false otherwise.
     * @param {string} path - The path to check.
     * @returns {boolean} True if the path exists, false otherwise.
     */
    hasPath(path) {
        return this.#images.has(path);
    }

    // -------------------------------------------------------------------------
    // MARK: - Unloading
    // -------------------------------------------------------------------------

    /**
     * Unloads the image at the given path and automatically removes any 
     * associated aliases.
     * @param {string} path - The path of the image to unload. 
     */
    unload(path) {
        // Remove the image
        this.#images.delete(path);

        // Remove all aliases for this path
        const aliasesToRemove = [];
        for (const [alias, aliasedPath] of this.#aliases.entries()) {
            if (aliasedPath === path) {
                aliasesToRemove.push(alias);
            }
        }
        for (const alias of aliasesToRemove) {
            this.removeAlias(alias);
        }
    }

    /**
     * Unloads all images and clears all aliases.
     */
    clear() {
        this.#images.clear();
        this.#aliases.clear();
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    #resolveToPath(aliasOrPath) {
        return this.#aliases.get(aliasOrPath) ?? aliasOrPath;
    }

}