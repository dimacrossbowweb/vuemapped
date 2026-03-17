import { LayerSpecification } from 'maplibre-gl';
import { type IMapLayer } from './map-layer.type';

export class MapLayer implements IMapLayer {

	name!: string;
	source!: string;
	type!: string;

	options!: Partial<LayerSpecification>;

	constructor(
		
		name: string,
		source: string,
		type: string,

		options: Partial<LayerSpecification> = {}
	
	) {

		try {

			if ( typeof name !== 'string' ) {

				throw new Error( `[MapLayer.constructor] invalid layer "name". Expected "string", got "${ typeof name }"` );

			}

			if ( typeof source !== 'string' ) {

				throw new Error( `[MapLayer.constructor] invalid "source". Expected "string", got "${ typeof source }"` );

			}

			if ( typeof type !== 'string' ) {

				throw new Error( `[MapLayer.constructor] invalid layer "type". Expected "string", got "${ typeof type }"` );

			}

			this.name = name;
			this.source = source;
			this.type = type;

			this.options = options ?? {};

		} catch (e: unknown) {

			console.error(e);

		}

	}

	set<K extends keyof LayerSpecification>(name: K, value: LayerSpecification[K]): this {

		try {

			this.options[name] = value;

		} catch (e: unknown) {

			console.error(e);

		}

		return this;
	}

	static create(
		
		name: string,
		source: string,
		type: string,

		options: Partial<LayerSpecification> = {}
	
	): MapLayer {

		return new MapLayer(
			name,
			source,
			type,
			options
		);

	}

}
