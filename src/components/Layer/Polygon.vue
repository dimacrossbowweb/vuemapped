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
	outlineColor: string;
	antialias: boolean;

	translate: [x: string | number, y: string | number];
	translateAnchor: 'map' | 'viewport';

};

const emit = defineEmits( ['click'] );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	color: 'white',
	outlineColor: 'white',
	antialias: true,

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const { parseColor } = useFormat();

const _name = uuidv4();
const name   = computed( () => props?.name   ?? _name );
const source = computed( () => props?.source ?? '' );

const color        = computed( () => parseColor( props?.color )?.toString() ?? '#ffffff' );
const opacity      = computed( () => props?.opacity ? +props.opacity : 1 );
const outlineColor = computed( () => parseColor( props?.outlineColor )?.toString() ?? '#ffffff' );
const antialias    = computed( () => props?.antialias ?? true );
const translate    = computed<[number, number]>( () => { const t = props?.translate ?? [0, 0]; return [ +t[0], +t[1] ]; } );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );

const isLoading = ref( true );
const layerName = ref<string>( '' );

function draw( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		map.value.setPaintProperty( name.value, `fill-${ property }`, value );

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
				'type': 'fill',
				'source': source.value as any,
				'paint': {

					'fill-color': color.value,
					'fill-opacity': opacity.value,
					'fill-outline-color': outlineColor.value,
					'fill-antialias': antialias.value,

					'fill-translate': translate.value,
					'fill-translate-anchor': translateAnchor.value,

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

watch( () => color.value,           ( val: string )            => draw( 'color', val ) );
watch( () => opacity.value,         ( val: number )            => draw( 'opacity', val ) );
watch( () => outlineColor.value,    ( val: string )            => draw( 'outline-color', val ) );
watch( () => antialias.value,       ( val: boolean )           => draw( 'antialias', val ) );
watch( () => translate.value,       ( val )                    => draw( 'translate', val ) );
watch( () => translateAnchor.value, ( val: 'map' | 'viewport' ) => draw( 'translate-anchor', val ) );

provide( 'layerName', layerName );
</script>

<style lang="scss" scoped>
</style>
