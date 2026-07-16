export class AssetManager {
    static #images = new Map();
    static #aliases = new Map();

    // -------------------------------------------------------------------------
    // MARK: - Image Loading
    // -------------------------------------------------------------------------

    static async loadImage({ path, alias } = {}) {
        if (AssetManager.#images.has(path)) {
            return AssetManager.#images.get(path);
        }

        const image = await new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous'; 
            image.onload = () => resolve(image);
            image.onerror = (err) => reject(new Error(`Failed to load image at ${path}`));
            image.src = path;
        });

        this.setByPath(path, image);
        if (alias) {
            this.setAlias(alias, path);
        }

        return image;
    }

    static async loadImages(imagePaths) {
        const errors = [];

        const loadPromises = imagePaths.map(({ path, alias }) => {
            return AssetManager.loadImage({ path, alias }).catch(error => {
                errors.push(error);
            });
        });
        await Promise.all(loadPromises);

        if (errors.length > 0) {
            throw new AggregateError(errors, "One or more images failed to load.");
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Image Management 
    // -------------------------------------------------------------------------

    static get(aliasOrPath) {
        const key = AssetManager.#aliases.get(aliasOrPath) ?? aliasOrPath;
        return AssetManager.#images.get(key);
    }

    static set(aliasOrPath, image) {
        const key = AssetManager.#aliases.get(aliasOrPath) ?? aliasOrPath;
        AssetManager.#images.set(key, image);
    }

    static getByPath(path) {
        return AssetManager.#images.get(path);
    }

    static setByPath(path, image) {
        AssetManager.#images.set(path, image);
    }

    static getByAlias(alias) {
        const path = AssetManager.#aliases.get(alias);
        if (path) {
            return AssetManager.#images.get(path);
        }
        return null;
    }

    static setByAlias(alias, image) {
        const path = AssetManager.#aliases.get(alias);
        if (path) {
            this.setByPath(path, image);
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Alias Management
    // -------------------------------------------------------------------------

    static setAlias(alias, path) {
        AssetManager.#aliases.set(alias, path);
    }

    static removeAlias(alias) {
        AssetManager.#aliases.delete(alias);
    }

    static hasAlias(alias) {
        return AssetManager.#aliases.has(alias);
    }

}