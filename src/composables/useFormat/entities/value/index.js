import { Type } from '../type/index.js';

export class Value extends Type {
    value;
    unit;

    constructor(value, unit) {
        super('value');

        try {
            if (typeof value !== 'number') {
                throw new Error('Value -> constructor :: invalid value');
            }

            if (typeof unit !== 'string') {
                throw new Error('Value -> constructor :: invalid unit');
            }

            this.value = value;
            this.unit = unit;
        } catch (e) {
            console.error(e);
        }
    }

    static validate(value) {
        if (Number(value).toString() === value.toString()) { return true; }
        return /^(-?\d+(\.\d+)?)(px|%|em|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc)$/.test(value.toString());
    }

    static parse(value = '0px', defUnit = 'px') {
        if (Number(value).toString() === value.toString()) {
            const unit = defUnit ?? '';
            return new Value(Number(value), unit);
        }

        const sizeRegex = /^(-?\d+(\.\d+)?)(px|%|em|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc)$/;
        const match = value.toString().match(sizeRegex);

        if (match) {
            const val = parseFloat(match[1]);
            const unit = match[3];
            return new Value(val, unit);
        }

        return null;
    }

    toString() {
        return `${this.value}${this.unit}`;
    }
}