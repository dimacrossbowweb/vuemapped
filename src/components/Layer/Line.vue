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

const emit = defineEmits( ['click'] );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	color: 'white',
	cap: 'butt',
	join: 'miter',

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const { parseColor } = useFormat();

const _name = uuidv4();
const name   = computed( () => props?.name   ?? _name );
const source = computed( () => props?.source ?? '' );

const color         = computed( () => parseColor( props?.color )?.toString() ?? '#ffffff' );
const opacity       = computed( () => props?.opacity  ? +props.opacity  : 1 );
const width         = computed( () => props?.width    ? +props.width    : 1 );
const gapWidth      = computed( () => props?.gapWidth ? +props.gapWidth : 0 );
const offset        = computed( () => props?.offset   ? +props.offset   : 0 );
const blur          = computed( () => props?.blur     ? +props.blur     : 0 );
const translate     = computed<[number, number]>( () => { const t = props?.translate ?? [0, 0]; return [ +t[0], +t[1] ]; } );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );
const cap           = computed( () => props?.cap  ?? 'butt' );
const join          = computed( () => props?.join ?? 'miter' );

const isLoading = ref( true );
const layerName = ref<string>( '' );

function draw( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		map.value.setPaintProperty( name.value, `line-${ property }`, value );

	}

}

function layout( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		map.value.setLayoutProperty( name.value, `line-${ property }`, value );

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
				'type': 'line',
				'source': source.value as any,

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

watch( () => color.value,           ( val: string )             => draw( 'color', val ) );
watch( () => opacity.value,         ( val: number )             => draw( 'opacity', val ) );
watch( () => width.value,           ( val: number )             => draw( 'width', val ) );
watch( () => gapWidth.value,        ( val: number )             => draw( 'gap-width', val ) );
watch( () => offset.value,          ( val: number )             => draw( 'offset', val ) );
watch( () => blur.value,            ( val: number )             => draw( 'blur', val ) );
watch( () => translate.value,       ( val )                     => draw( 'translate', val ) );
watch( () => translateAnchor.value, ( val: 'map' | 'viewport' ) => draw( 'translate-anchor', val ) );

watch( () => cap.value,  ( val: 'butt' | 'round' | 'square' ) => layout( 'cap', val ) );
watch( () => join.value, ( val: 'bevel' | 'round' | 'miter' ) => layout( 'join', val ) );

provide( 'layerName', layerName );
</script>

<style lang="scss" scoped>
</style>
