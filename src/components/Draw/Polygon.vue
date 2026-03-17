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

	geometry: [number, number][][];

	color: string;
	opacity: string | number;
	outlineColor: string;
	antialias: boolean;

	translate: [x: string | number, y: string | number];
	translateAnchor: 'map' | 'viewport';

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
	outlineColor: 'white',
	antialias: true,

} );

const { parseColor } = useFormat();

const name = uuidv4();

const geometry     = computed( () => props?.geometry ?? [] );
const color        = computed( () => parseColor( props?.color )?.toString() ?? '#ffffff' );
const opacity      = computed( () => props?.opacity ? +props.opacity : 1 );
const outlineColor = computed( () => parseColor( props?.outlineColor )?.toString() ?? '#ffffff' );
const antialias    = computed( () => props?.antialias ?? true );

const translate       = computed<[number, number]>( () => {
	const t = props?.translate ?? [0, 0];
	return [ +t[0], +t[1] ];
} );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );

function draw ( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		const propertyName: string = `fill-${ property }`;

		map?.value?.setPaintProperty( name, propertyName, value );

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

						'type': 'Polygon',
						'coordinates': geometry.value,

					},

					'properties': {}

				}

			} );

			map.value.addLayer( {

				'id': name,
				'type': 'fill',
				'source': name as any,
				'paint': {

					'fill-color': color.value,
					'fill-opacity': opacity.value,
					'fill-outline-color': outlineColor.value,
					'fill-antialias': antialias.value,

					'fill-translate': translate.value,
					'fill-translate-anchor': translateAnchor.value,

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

function updateGeometry ( coords: [number, number][][] ) {

	if ( map?.value instanceof Map ) {

		const source = map.value.getSource( name );

		if ( source ) {

			( source as GeoJSONSource ).setData( {

				'type': 'Feature',
				'geometry': {

					'type': 'Polygon',
					'coordinates': coords,

				},
				'properties': {}

			} );

		}

	}

}

watch( () => geometry.value, ( val ) => updateGeometry( val ), { immediate: true, deep: true } );

watch( () => color.value,           ( val: string )            => draw( 'color', val ) );
watch( () => opacity.value,         ( val: number )            => draw( 'opacity', val ) );
watch( () => outlineColor.value,    ( val: string )            => draw( 'outline-color', val ) );
watch( () => antialias.value,       ( val: boolean )           => draw( 'antialias', val ) );
watch( () => translate.value,       ( val )                    => draw( 'translate', val ) );
watch( () => translateAnchor.value, ( val: 'map' | 'viewport' ) => draw( 'translate-anchor', val ) );

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
</script>
