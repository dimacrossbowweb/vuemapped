import { LayerSpecification } from 'maplibre-gl';

export interface IMapLayer {

	name: string;
	source: string;
	type: string;

	options: Partial<LayerSpecification>;

	set: <K extends keyof LayerSpecification>(name: K, value: LayerSpecification[K]) => this;

};
