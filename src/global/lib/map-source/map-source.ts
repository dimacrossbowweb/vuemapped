import { SourceSpecification } from 'maplibre-gl';
import { type IMapSource } from './map-source.type';

export class MapSource implements IMapSource {

	name!: string;

    options!: Partial<SourceSpecification>;

    constructor(name: string, options: Partial<SourceSpecification> = {}) {

        try {

			this.name = name;

            this.options = options ?? {};

        } catch (e: unknown) {

            console.error(e);

        }

    }

    set<K extends keyof SourceSpecification>(name: K, value: SourceSpecification[K]): this {

        try {

            this.options[name] = value;

        } catch (e: unknown) {

            console.error(e);

        }

        return this;
    }

	static create(name: string, options: Partial<SourceSpecification> = {}): MapSource {

		return new MapSource( name, options );

	}

}
