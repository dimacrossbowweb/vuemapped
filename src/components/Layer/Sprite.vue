<template>
	<div class="map-layer">
		<slot v-if="!isLoading"></slot>
	</div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { Map } from 'maplibre-gl';
import {

	type Ref,

	inject,
	provide,
	ref,
	computed,
	onMounted,
	watchEffect,
	watch,
	onBeforeUnmount,

} from 'vue';

interface IProps {

	name: string;
	source: string;

	// Icon
	iconImage: string;
	iconSize: number;
	iconColor: string;
	iconOpacity: number;
	iconRotate: number;
	iconHaloColor: string;
	iconHaloWidth: number;
	iconHaloBlur: number;
	iconOffset: [number, number];
	iconAnchor: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	iconPitchAlignment: 'map' | 'viewport' | 'auto';
	iconRotationAlignment: 'map' | 'viewport' | 'auto';

	// Text
	textField: string;
	textSize: number;
	textColor: string;
	textOpacity: number;
	textHaloColor: string;
	textHaloWidth: number;
	textHaloBlur: number;
	textFont: string[];
	textOffset: [number, number];
	textAnchor: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	textRotate: number;
	textTransform: 'none' | 'uppercase' | 'lowercase';

	// Common
	allowOverlap: boolean;
	ignorePlacement: boolean;
	optional: boolean;

};

const emit = defineEmits( ['click'] );

const props = withDefaults( defineProps<Partial<IProps>>(), {

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

const _name = uuidv4();
const name     = computed( () => props?.name   ?? _name );
const source   = computed( () => props?.source ?? '' );
const imageName = uuidv4();

const isLoading = ref( true );
const layerName = ref<string>( '' );

function setIconLayout( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name.value ) ) {

		map.value.setLayoutProperty( name.value, `icon-${ property }`, value );

	}

}

function setTextLayout( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name.value ) ) {

		map.value.setLayoutProperty( name.value, `text-${ property }`, value );

	}

}

function setIconPaint( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name.value ) ) {

		map.value.setPaintProperty( name.value, `icon-${ property }`, value );

	}

}

function setTextPaint( property: string, value: any ) {

	if ( map?.value instanceof Map && map.value.getLayer( name.value ) ) {

		map.value.setPaintProperty( name.value, `text-${ property }`, value );

	}

}

async function loadAndRegisterImage( url: string ) {

	if ( !( map?.value instanceof Map ) || !url ) return;

	if ( map.value.hasImage( imageName ) ) {

		map.value.removeImage( imageName );

	}

	const image = await map.value.loadImage( url );

	map.value.addImage( imageName, image.data );

}

function onClick( e: unknown ) {
	emit( 'click', e );
}

onMounted( () => {

	watchEffect( async () => {

		if ( map?.value instanceof Map && !map.value.getLayer( name.value ) ) {

			if ( props.iconImage ) {

				await loadAndRegisterImage( props.iconImage );

			}

			if ( map.value.getLayer( name.value ) ) return;

			map.value.addLayer( {

				id: name.value,
				type: 'symbol',
				source: source.value as any,

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

			layerName.value = name.value;

			map.value.on( 'click', name.value, onClick );

			isLoading.value = false;

		}

	} );

} );

onBeforeUnmount( () => {

	try {

		if ( map?.value instanceof Map ) {

			map.value.off( 'click', name.value, onClick );
			if ( map.value.getLayer( name.value ) ) map.value.removeLayer( name.value );
			if ( map.value.hasImage( imageName ) ) map.value.removeImage( imageName );

		}

	} catch ( e ) {

		console.error( e );

	}

} );

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

// Shared layout
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
watch( () => props.iconOpacity,   ( val ) => setIconPaint( 'opacity', val ) );
watch( () => props.iconColor,     ( val ) => setIconPaint( 'color', val ) );
watch( () => props.iconHaloColor, ( val ) => setIconPaint( 'halo-color', val ) );
watch( () => props.iconHaloWidth, ( val ) => setIconPaint( 'halo-width', val ) );
watch( () => props.iconHaloBlur,  ( val ) => setIconPaint( 'halo-blur', val ) );

// Text paint
watch( () => props.textColor,      ( val ) => setTextPaint( 'color', val ) );
watch( () => props.textOpacity,    ( val ) => setTextPaint( 'opacity', val ) );
watch( () => props.textHaloColor,  ( val ) => setTextPaint( 'halo-color', val ) );
watch( () => props.textHaloWidth,  ( val ) => setTextPaint( 'halo-width', val ) );
watch( () => props.textHaloBlur,   ( val ) => setTextPaint( 'halo-blur', val ) );

provide( 'layerName', layerName );
</script>

<style lang="scss" scoped>
</style>
