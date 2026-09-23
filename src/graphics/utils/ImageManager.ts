export class ImageManager {
    #images: Map<string, HTMLImageElement> = new Map();
    #aliases: Map<string, string> = new Map();

    // -------------------------------------------------------------------------
    // MARK: - Loading
    // -------------------------------------------------------------------------

    /**
     * Loads an image from the given path, optionally registering an alias for
     * it.
     * 
     * @param path - The path to the image file.
     * @param alias - An optional alias to register for the image.
     * @returns A promise that resolves to the loaded image.
     * @throws Throws if the image fails to load.
     */
    async load(path: string, alias?: string): Promise<HTMLImageElement> {
        let image = this.get(path);
        if (!image) {
            image = await new Promise<HTMLImageElement>((resolve, reject) => {
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
     * 
     * @param imagePaths - An array of objects, each containing a path and
     *     optional alias.
     * @returns A promise that resolves to an array of loaded images.
     * @throws Throws an `AggregateError` if one or more images fail to load. 
     *     Will not stop other images from loading.
     */
    async loadAll(imagePaths: { path: string; alias?: string }[]): Promise<HTMLImageElement[]> {
        const results = await Promise.allSettled(
            imagePaths.map(({ path, alias }) => this.load(path, alias))
        );

        const images: HTMLImageElement[] = [];
        const errors: unknown[] = [];

        for (const result of results) {
            if (result.status === 'fulfilled') {
                images.push(result.value);
            } else {
                errors.push(result.reason);
            }
        }

        if (errors.length > 0) {
            throw new AggregateError(errors, 'One or more images failed to load.');
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
     * 
     * @param path - The path to the image file.
     * @param image - The image element to register.
     * @param alias - An optional alias to register for the image.
     */
    register(path: string, image: HTMLImageElement, alias?: string): void {
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
     * 
     * @param aliasOrPath - The alias or path of the image to retrieve.
     * @returns The image element, or undefined if no image is registered under
     *     the given path or alias.
     */
    get(aliasOrPath: string): HTMLImageElement | undefined {
        const path = this.#resolveToPath(aliasOrPath);
        return this.#images.get(path);
    }

    /**
     * Returns true if the given alias or path exists, false otherwise.
     * 
     * @param aliasOrPath - The alias or path of the image to check.
     * @returns True if the image exists, false otherwise.
     */
    has(aliasOrPath: string): boolean {
        return this.hasAlias(aliasOrPath) || this.hasPath(aliasOrPath);
    }

    // -------------------------------------------------------------------------
    // MARK: - Name Management
    // -------------------------------------------------------------------------

    /**
     * Creates an alias for an already-loaded image path.
     * 
     * @param alias - The alias to add.
     * @param path - The path the alias points to.
     * @throws Throws if the alias matches an existing path, or if the path does
     *     not exist.
     */
    setAlias(alias: string, path: string): void {
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
     * 
     * @param alias - The alias to remove.
     */
    removeAlias(alias: string): void {
        this.#aliases.delete(alias);
    }

    /**
     * Returns true if the given alias exists, false otherwise.
     * 
     * @param alias - The alias to check.
     * @returns True if the alias exists, false otherwise.
     */
    hasAlias(alias: string): boolean {
        return this.#aliases.has(alias);
    }

    /**
     * Returns true if the given path exists, false otherwise.
     * 
     * @param path - The path to check.
     * @returns True if the path exists, false otherwise.
     */
    hasPath(path: string): boolean {
        return this.#images.has(path);
    }

    // -------------------------------------------------------------------------
    // MARK: - Unloading
    // -------------------------------------------------------------------------

    /**
     * Unloads the image at the given path and automatically removes any 
     * associated aliases.
     * 
     * @param path - The path of the image to unload.
     */
    unload(path: string): void {
        // Remove the image
        this.#images.delete(path);

        // Remove all aliases for this path
        const aliasesToRemove: string[] = [];
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
    clear(): void {
        this.#images.clear();
        this.#aliases.clear();
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------

    #resolveToPath(aliasOrPath: string): string {
        return this.#aliases.get(aliasOrPath) ?? aliasOrPath;
    }

}