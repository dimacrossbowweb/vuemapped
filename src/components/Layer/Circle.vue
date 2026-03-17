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
import { useFormat } from '../../composables/useFormat';

interface IProps {

	name: string;
	source: string;

	radius: number | number[];
	color: string;
	opacity: string | number;
	strokeWidth: string | number;
	strokeColor: string;
	strokeOpacity: string | number;

	blur: string | number;
	translate: [x: string | number, y: string | number];
	translateAnchor: 'map' | 'viewport';

	pitchScale: 'map' | 'viewport';
	pitchAlignment: 'map' | 'viewport';

};

const emit = defineEmits( ['click'] );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	color: 'white',
	strokeColor: 'white',

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const { parseColor } = useFormat();

const _name = uuidv4();
const name = computed( () => props?.name ?? _name );
const source = computed( () => props?.source ?? '' );

const radius = computed( () => {

	if ( !props.radius ) return 5;

	if ( typeof props.radius === 'string' ) {

		const num = parseFloat( props.radius );
		return isNaN( num ) ? 5 : num;

	}

	if ( Array.isArray( props.radius ) ) return props.radius;

	return props.radius;

} );

const color        = computed( () => parseColor( props?.color )?.toString() ?? '#ffffff' );
const opacity      = computed( () => props?.opacity ? +props.opacity : 1 );
const strokeWidth  = computed( () => props?.strokeWidth ? +props.strokeWidth : 0 );
const strokeColor  = computed( () => parseColor( props?.strokeColor )?.toString() ?? '#ffffff' );
const strokeOpacity = computed( () => props?.strokeOpacity ? +props.strokeOpacity : 1 );

const blur            = computed( () => props?.blur ? +props.blur : 0 );
const translate       = computed<[number, number]>( () => { const t = props?.translate ?? [0, 0]; return [ +t[0], +t[1] ]; } );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );
const pitchScale      = computed( () => props?.pitchScale ?? 'map' );
const pitchAlignment  = computed( () => props?.pitchAlignment ?? 'map' );

const isLoading = ref( true );
const layerName = ref<string>( '' );

function draw( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		map.value.setPaintProperty( name.value, `circle-${ property }`, value );

	}

}

function onClick( e: unknown ) {
	emit( 'click', e );
}

onMounted( () => {

	watchEffect( () => {

		if ( map?.value instanceof Map && !map.value.getLayer( name.value ) ) {

			map.value.addLayer( {

				'id': name.value,
				'type': 'circle',
				'source': source.value as any,
				'paint': {

					'circle-radius': radius.value as any,
					'circle-color': color.value,
					'circle-opacity': opacity.value,

					'circle-stroke-width': strokeWidth.value,
					'circle-stroke-color': strokeColor.value,
					'circle-stroke-opacity': strokeOpacity.value,

					'circle-blur': blur.value,
					'circle-translate': translate.value,
					'circle-translate-anchor': translateAnchor.value,
					'circle-pitch-scale': pitchScale.value,
					'circle-pitch-alignment': pitchAlignment.value,

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
			map.value.removeLayer( name.value );

		}

	} catch ( e ) {

		console.error( e );

	}

} );

watch( () => radius.value,        ( val: number | number[] ) => draw( 'radius', val ) );
watch( () => color.value,         ( val: string ) => draw( 'color', val ) );
watch( () => opacity.value,       ( val: number ) => draw( 'opacity', val ) );
watch( () => strokeWidth.value,   ( val: number ) => draw( 'stroke-width', val ) );
watch( () => strokeColor.value,   ( val: string ) => draw( 'stroke-color', val ) );
watch( () => strokeOpacity.value, ( val: number ) => draw( 'stroke-opacity', val ) );
watch( () => blur.value,          ( val: number ) => draw( 'blur', val ) );
watch( () => translate.value,     ( val: [number, number] ) => draw( 'translate', val ) );
watch( () => translateAnchor.value, ( val: 'map' | 'viewport' ) => draw( 'translate-anchor', val ) );
watch( () => pitchScale.value,    ( val: 'map' | 'viewport' ) => draw( 'pitch-scale', val ) );
watch( () => pitchAlignment.value, ( val: 'map' | 'viewport' ) => draw( 'pitch-alignment', val ) );

provide( 'layerName', layerName );
</script>

<style lang="scss" scoped>
</style>
