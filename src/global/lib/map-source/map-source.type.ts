import { SourceSpecification } from 'maplibre-gl';

export interface IMapSource {

	name: string;

	options: Partial<SourceSpecification>;

	set: <K extends keyof SourceSpecification>(name: K, value: SourceSpecification[K]) => this;

};
