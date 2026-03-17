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

interface IProps {

	latitude: number;
	longitude: number;

	// Icon
	iconImage?: string;
	iconSize?: number;
	iconColor?: string;
	iconOpacity?: number;
	iconRotate?: number;
	iconHaloColor?: string;
	iconHaloWidth?: number;
	iconHaloBlur?: number;
	iconOffset?: [number, number];
	iconAnchor?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	iconPitchAlignment?: 'map' | 'viewport' | 'auto';
	iconRotationAlignment?: 'map' | 'viewport' | 'auto';

	// Text
	textField?: string;
	textSize?: number;
	textColor?: string;
	textOpacity?: number;
	textHaloColor?: string;
	textHaloWidth?: number;
	textHaloBlur?: number;
	textFont?: string[];
	textOffset?: [number, number];
	textAnchor?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	textRotate?: number;
	textTransform?: 'none' | 'uppercase' | 'lowercase';

	// Common
	allowOverlap?: boolean;
	ignorePlacement?: boolean;
	optional?: boolean;

}

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

const props = withDefaults( defineProps<IProps>(), {

	iconSize: 1,
	iconOpacity: 1,
	iconRotate: 0,
	iconHaloColor: '#ffffff',
	iconHaloWidth: 0,
	iconHaloBlur: 0,
	iconOffset: () => [0, 0],
	iconAnchor: 'center',
	iconPitchAlignment: 'auto',
	iconRotationAlignment: 'auto',

	textField: '',
	textSize: 12,
	textColor: '#000000',
	textOpacity: 1,
	textHaloColor: '#ffffff',
	textHaloWidth: 1,
	textHaloBlur: 0,
	textFont: () => ['Open Sans Regular'],
	textOffset: () => [0, 1.5],
	textAnchor: 'top',
	textRotate: 0,
	textTransform: 'none',

	allowOverlap: false,
	ignorePlacement: false,
	optional: false,

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const name = uuidv4();
const imageName = uuidv4();

const lat = computed( () => +props.latitude );
const lng = computed( () => +props.longitude );

function setIconLayout ( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name ) ) {

		map.value.setLayoutProperty( name, `icon-${ property }`, value );

	}

}

function setTextLayout ( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name ) ) {

		map.value.setLayoutProperty( name, `text-${ property }`, value );

	}

}

function setIconPaint ( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name ) ) {

		map.value.setPaintProperty( name, `icon-${ property }`, value );

	}

}

function setTextPaint ( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name ) ) {

		map.value.setPaintProperty( name, `text-${ property }`, value );

	}

}

async function loadAndRegisterImage ( url: string ) {

	if ( !( map?.value instanceof Map ) || !url ) return;

	if ( map.value.hasImage( imageName ) ) {

		map.value.removeImage( imageName );

	}

	const image = await map.value.loadImage( url );

	map.value.addImage( imageName, image.data );

}

function updateCoordinates ( lngVal: number, latVal: number ) {

	if ( map?.value instanceof Map ) {

		const source = map.value.getSource( name );

		if ( source ) {

			( source as GeoJSONSource ).updateData( {

				update: [ {
					id: 0,
					newGeometry: {
						type: 'Point',
						coordinates: [ lngVal, latVal ],
					},
				} ],

			} );

		}

	}

}

onMounted( () => {

	watchEffect( async () => {

		if ( map?.value instanceof Map && !map.value.getSource( name ) ) {

			if ( props.iconImage ) {

				await loadAndRegisterImage( props.iconImage );

			}

			if ( map.value.getSource( name ) ) return;

			map.value.addSource( name, {

				type: 'geojson',
				data: {

					id: 0,
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [ lng.value, lat.value ],
					},
					properties: {},

				},

			} );

			map.value.addLayer( {

				id: name,
				type: 'symbol',
				source: name,

				layout: {

					'icon-image': imageName,
					'icon-size': props.iconSize,
					'icon-rotate': props.iconRotate,
					'icon-anchor': props.iconAnchor,
					'icon-offset': props.iconOffset,
					'icon-allow-overlap': props.allowOverlap,
					'icon-ignore-placement': props.ignorePlacement,
					'icon-optional': props.optional,
					'icon-pitch-alignment': props.iconPitchAlignment,
					'icon-rotation-alignment': props.iconRotationAlignment,

					'text-field': props.textField,
					'text-size': props.textSize,
					'text-font': props.textFont,
					'text-anchor': props.textAnchor,
					'text-offset': props.textOffset,
					'text-rotate': props.textRotate,
					'text-transform': props.textTransform,
					'text-allow-overlap': props.allowOverlap,
					'text-ignore-placement': props.ignorePlacement,
					'text-optional': props.optional,

				},

				paint: {

					'icon-opacity': props.iconOpacity,
					'icon-halo-color': props.iconHaloColor,
					'icon-halo-width': props.iconHaloWidth,
					'icon-halo-blur': props.iconHaloBlur,

					'text-color': props.textColor,
					'text-opacity': props.textOpacity,
					'text-halo-color': props.textHaloColor,
					'text-halo-width': props.textHaloWidth,
					'text-halo-blur': props.textHaloBlur,

				},

			} );

			addEvents();

		}

	} );

} );

onBeforeUnmount( () => {

	try {

		if ( map?.value instanceof Map ) {

			removeEvents();
			if ( map.value.getLayer( name ) ) map.value.removeLayer( name );
			if ( map.value.getSource( name ) ) map.value.removeSource( name );
			if ( map.value.hasImage( imageName ) ) map.value.removeImage( imageName );

		}

	} catch ( e ) {

		console.error( e );

	}

} );

// Coordinates
watch( [ lat, lng ], ( [ newLat, newLng ] ) => updateCoordinates( newLng, newLat ), { immediate: true } );

// iconImage: reload image (source/layer stay intact)
watch( () => props.iconImage, async ( url ) => {

	if ( url ) await loadAndRegisterImage( url );

} );

// Icon layout
watch( () => props.iconSize,              ( val ) => setIconLayout( 'size', val ) );
watch( () => props.iconRotate,            ( val ) => setIconLayout( 'rotate', val ) );
watch( () => props.iconAnchor,            ( val ) => setIconLayout( 'anchor', val ) );
watch( () => props.iconOffset,            ( val ) => setIconLayout( 'offset', val ) );
watch( () => props.iconPitchAlignment,    ( val ) => setIconLayout( 'pitch-alignment', val ) );
watch( () => props.iconRotationAlignment, ( val ) => setIconLayout( 'rotation-alignment', val ) );

// Text layout
watch( () => props.textField,     ( val ) => setTextLayout( 'field', val ) );
watch( () => props.textSize,      ( val ) => setTextLayout( 'size', val ) );
watch( () => props.textFont,      ( val ) => setTextLayout( 'font', val ) );
watch( () => props.textAnchor,    ( val ) => setTextLayout( 'anchor', val ) );
watch( () => props.textOffset,    ( val ) => setTextLayout( 'offset', val ) );
watch( () => props.textRotate,    ( val ) => setTextLayout( 'rotate', val ) );
watch( () => props.textTransform, ( val ) => setTextLayout( 'transform', val ) );

// Shared layout (allow-overlap, ignore-placement, optional affect both icon and text)
watch( () => props.allowOverlap, ( val ) => {

	setIconLayout( 'allow-overlap', val );
	setTextLayout( 'allow-overlap', val );

} );

watch( () => props.ignorePlacement, ( val ) => {

	setIconLayout( 'ignore-placement', val );
	setTextLayout( 'ignore-placement', val );

} );

watch( () => props.optional, ( val ) => {

	setIconLayout( 'optional', val );
	setTextLayout( 'optional', val );

} );

// Icon paint
watch( () => props.iconOpacity,    ( val ) => setIconPaint( 'opacity', val ) );
watch( () => props.iconColor,      ( val ) => setIconPaint( 'color', val ) );
watch( () => props.iconHaloColor,  ( val ) => setIconPaint( 'halo-color', val ) );
watch( () => props.iconHaloWidth,  ( val ) => setIconPaint( 'halo-width', val ) );
watch( () => props.iconHaloBlur,   ( val ) => setIconPaint( 'halo-blur', val ) );

// Text paint
watch( () => props.textColor,      ( val ) => setTextPaint( 'color', val ) );
watch( () => props.textOpacity,    ( val ) => setTextPaint( 'opacity', val ) );
watch( () => props.textHaloColor,  ( val ) => setTextPaint( 'halo-color', val ) );
watch( () => props.textHaloWidth,  ( val ) => setTextPaint( 'halo-width', val ) );
watch( () => props.textHaloBlur,   ( val ) => setTextPaint( 'halo-blur', val ) );

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
