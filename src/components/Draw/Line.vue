<template></template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import maplibregl, { Map, GeoJSONSource } from 'maplibre-gl';
import {

	type Ref,

	inject,
	computed,
	onMounted,
	watchEffect,
	watch,
	onBeforeUnmount,

} from 'vue';
import { useFormat } from '../../composables/useFormat';

interface IProps {

	geometry: [number, number][];

	color: string;
	opacity: string | number;
	width: string | number;
	gapWidth: string | number;
	offset: string | number;

	blur: string | number;
	translate: [x: string | number, y: string | number];
	translateAnchor: 'map' | 'viewport';

	cap: 'butt' | 'round' | 'square';
	join: 'bevel' | 'round' | 'miter';

};

const map = inject<Ref<Map | null>>( 'mapInstance' );

const emit = defineEmits<{
	click:       [ e: maplibregl.MapMouseEvent ];
	dblclick:    [ e: maplibregl.MapMouseEvent ];
	mousedown:   [ e: maplibregl.MapMouseEvent ];
	mouseup:     [ e: maplibregl.MapMouseEvent ];
	mousemove:   [ e: maplibregl.MapMouseEvent ];
	mouseenter:  [ e: maplibregl.MapMouseEvent ];
	mouseleave:  [ e: maplibregl.MapMouseEvent ];
	mouseover:   [ e: maplibregl.MapMouseEvent ];
	mouseout:    [ e: maplibregl.MapMouseEvent ];
	contextmenu: [ e: maplibregl.MapMouseEvent ];
}>();

const props = withDefaults( defineProps<Partial<IProps>>(), {

	geometry: () => [],

	color: 'white',
	cap: 'butt',
	join: 'miter',

} );

const { parseColor } = useFormat();

const name = uuidv4();

const geometry      = computed( () => props?.geometry ?? [] );
const color         = computed( () => parseColor( props?.color )?.toString() ?? '#ffffff' );
const opacity       = computed( () => props?.opacity  ? +props.opacity  : 1 );
const width         = computed( () => props?.width    ? +props.width    : 1 );
const gapWidth      = computed( () => props?.gapWidth ? +props.gapWidth : 0 );
const offset        = computed( () => props?.offset   ? +props.offset   : 0 );
const blur          = computed( () => props?.blur     ? +props.blur     : 0 );
const translate     = computed<[number, number]>( () => {
	const t = props?.translate ?? [0, 0];
	return [ +t[0], +t[1] ];
} );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );
const cap           = computed( () => props?.cap  ?? 'butt' );
const join          = computed( () => props?.join ?? 'miter' );

function draw ( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		const propertyName: string = `line-${ property }`;

		map?.value?.setPaintProperty( name, propertyName, value );

	}

}

function layout ( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		const propertyName: string = `line-${ property }`;

		map?.value?.setLayoutProperty( name, propertyName, value );

	}

}

onMounted( () => {

	watchEffect( () => {

		if ( map?.value instanceof Map && !map.value.getSource( name ) ) {

			map.value.addSource( name, {

				'type': 'geojson',

				'data': {

					'type': 'Feature',
					'geometry': {

						'type': 'LineString',
						'coordinates': geometry.value,

					},

					'properties': {}

				}

			} );

			map.value.addLayer( {

				'id': name,
				'type': 'line',
				'source': name as any,

				'layout': {

					'line-cap': cap.value,
					'line-join': join.value,

				},

				'paint': {

					'line-color': color.value,
					'line-opacity': opacity.value,
					'line-width': width.value,
					'line-gap-width': gapWidth.value,
					'line-offset': offset.value,

					'line-blur': blur.value,
					'line-translate': translate.value,
					'line-translate-anchor': translateAnchor.value,

				}

			} );

			addEvents();

		}

	} );

} );

onBeforeUnmount( () => {

	try {

		if ( map?.value instanceof Map ) {

			removeEvents();
			map.value.removeLayer( name );
			map.value.removeSource( name );

		}

	} catch ( e ) {

		console.error( e );

	}

} );

const EVENTS = [ 'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'contextmenu' ] as const;

const handlers: Record<string, ( e: maplibregl.MapMouseEvent ) => void> = {};

function addEvents() {

	if ( !( map?.value instanceof Map ) ) return;

	for ( const event of EVENTS ) {

		const handler = ( e: maplibregl.MapMouseEvent ) => ( emit as any )( event, e );
		handlers[ event ] = handler;
		( map.value as any ).on( event, name, handler );

	}

}

function removeEvents() {

	if ( !( map?.value instanceof Map ) ) return;

	for ( const event of EVENTS ) {

		if ( handlers[ event ] ) ( map.value as any ).off( event, name, handlers[ event ] );

	}

}

function updateGeometry ( coords: [number, number][] ) {

	if ( map?.value instanceof Map ) {

		const source = map.value.getSource( name );

		if ( source ) {

			( source as GeoJSONSource ).setData( {

				'type': 'Feature',
				'geometry': {

					'type': 'LineString',
					'coordinates': coords,

				},
				'properties': {}

			} );

		}

	}

}

watch( () => geometry.value, ( val ) => updateGeometry( val ), { immediate: true, deep: true } );

watch( () => color.value,           ( val: string )             => draw( 'color', val ) );
watch( () => opacity.value,         ( val: number )             => draw( 'opacity', val ) );
watch( () => width.value,           ( val: number )             => draw( 'width', val ) );
watch( () => gapWidth.value,        ( val: number )             => draw( 'gap-width', val ) );
watch( () => offset.value,          ( val: number )             => draw( 'offset', val ) );
watch( () => blur.value,            ( val: number )             => draw( 'blur', val ) );
watch( () => translate.value,       ( val )                     => draw( 'translate', val ) );
watch( () => translateAnchor.value, ( val: 'map' | 'viewport' ) => draw( 'translate-anchor', val ) );

watch( () => cap.value,  ( val: 'butt' | 'round' | 'square' )  => layout( 'cap', val ) );
watch( () => join.value, ( val: 'bevel' | 'round' | 'miter' )  => layout( 'join', val ) );

</script>
