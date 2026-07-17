export class ImageManager {
    #images = new Map();
    #aliases = new Map();

    // -------------------------------------------------------------------------
    // MARK: - Loading
    // -------------------------------------------------------------------------

    async load(path, alias = null) {
        if (this.#images.has(path)) {
            return this.#images.get(path);
        }

        const image = await new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous'; 
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Failed to load image at ${path}`));
            image.src = path;
        });

        this.register(path, image, alias);

        return image;
    }

    async loadAll(imagePaths) {
        const errors = [];

        const loadPromises = imagePaths.map(({ path, alias }) => {
            return this.load(path, alias).catch(error => {
                errors.push(error);
            });
        });
        const images = await Promise.all(loadPromises);

        if (errors.length > 0) {
            throw new AggregateError(errors, "One or more images failed to load.");
        }
        return images;
    }

    // -------------------------------------------------------------------------
    // MARK: - Image Management 
    // -------------------------------------------------------------------------

    get(aliasOrPath) {
        const key = this.#aliases.get(aliasOrPath) ?? aliasOrPath;
        return this.#images.get(key);
    }

    register(path, image, alias = null) {
        this.#images.set(path, image);
        if (this.#aliases.has(path)) {
            this.removeAlias(path);
            console.warn(`Alias "${path}" removed to avoid conflict with image path.`);
        }
        if (alias) {
            this.addAlias(alias, path);
        }
    }

    has(aliasOrPath) {
        const key = this.#aliases.get(aliasOrPath) ?? aliasOrPath;
        return this.#images.has(key);
    }

    // -------------------------------------------------------------------------
    // MARK: - Alias Management
    // -------------------------------------------------------------------------

    addAlias(alias, path) {
        if (this.#images.has(alias)) {
            throw new Error(`Alias "${alias}" conflicts with an existing image path.`);
        }
        this.#aliases.set(alias, path);
    }

    removeAlias(alias) {
        this.#aliases.delete(alias);
    }

    hasAlias(alias) {
        return this.#aliases.has(alias);
    }

    // -------------------------------------------------------------------------
    // MARK: - Helpers
    // -------------------------------------------------------------------------


}