import { Type } from '../type';

export class AspectRatio extends Type {
    w;
    h;

    constructor(w, h) {
        super('aspect-ratio');

        try {
            if (typeof w !== 'number' || w <= 0) {
                throw new Error('AspectRatio -> constructor :: invalid w');
            }

            if (typeof h !== 'number' || h <= 0) {
                throw new Error('AspectRatio -> constructor :: invalid h');
            }

            this.w = w;
            this.h = h;
        } catch (e) {
            console.error(e);
        }
    }

    static validate(value) {
        return /\s*\/\s*|\s*:\s*/.test(value);
    }

    static parse(aspectRatio = '16/9') {
        let w = 16, h = 9;

        if (!aspectRatio) {
            return null;
        }

        const parts = aspectRatio.trim().split(/\s*\/\s*|\s*:\s*/);

        if (parts.length !== 2) {
            return null;
        }

        const width = parseFloat(parts[0]);
        const height = parseFloat(parts[1]);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            return null;
        }

        w = width;
        h = height;

        return new AspectRatio(w, h);
    }

    toString() {
        return `${this.w}/${this.h}`;
    }
}