export class Type {
    name;

    constructor(name) {
        try {
            if (typeof name !== 'string') {
                throw new Error('Type -> constructor :: invalid name');
            }

            this.name = name;
        } catch (e) {
            console.error(e);
        }
    }

    static validate(value) {
        return !!value;
    }

    static parse(value) {
        return value;
    }
}