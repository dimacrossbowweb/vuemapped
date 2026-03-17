<template></template>

<script lang="ts" setup>
import { Map } from 'maplibre-gl';
import {

	type Ref,

	inject,
	computed,
	onMounted,
	watchEffect,
	watch,

} from 'vue';
import { useFormat } from '../../composables/useFormat';

interface IProps {

	color: string;
	opacity: string | number;
	width: string | number;
	gapWidth: string;
	offset: string | number;

	blur: string | number;
	translate: [x: string | number, y: string | number];
	translateAnchor: 'map' | 'viewport';

};

const map = inject<Ref<Map | null>>( 'mapInstance' );
const layerName = inject<Ref<string>>( 'layerName' );
const layerType = inject<Ref<string>>( 'layerType' );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	color: 'white',
	strokeColor: 'white',

} );

const { parseColor } = useFormat();

const color = computed( () => parseColor( props?.color )?.toString() );
const opacity = computed( () => props?.opacity ? +props.opacity : 1 );
const width = computed( () => props?.width ? +props.width : 20 );
const gapWidth = computed( () => props?.gapWidth ? +props.gapWidth : 0 );
const offset = computed( () => props?.offset ? +props.offset : 0 );

const blur = computed( () => props?.blur ? +props.blur : 0 );
const translate = computed( () => props?.translate ?? [0, 0] );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );

const isReady = computed( () => {

	return map?.value instanceof Map &&
		   typeof layerName?.value === 'string' &&
		  !!map.value.getLayer( layerName?.value );

} );

function draw ( property: string, value: any ) {

	if ( isReady.value ) {

		const propertyName: string = `line-${ property }`;

		map?.value?.setPaintProperty( layerName.value, propertyName, value );

	}

}

onMounted( () => {

	watchEffect( () => {

		// if ( layerType ) {

		// 	layerType.value = 'line';

		// }

		if ( isReady.value ) {

			draw( 'color', color.value );
			draw( 'opacity', opacity.value );
			draw( 'width', width.value );
			draw( 'gap-width', gapWidth.value );
			draw( 'offset', offset.value );
			
			draw( 'blur', blur.value );
			draw( 'translate', translate.value );
			draw( 'translate-anchor', translateAnchor.value );

		}

	} );

} );

// onBeforeUnmount( () => {

// 	try {

// 		map?.value instanceof Map && map.value.removeSource( name.value );

// 	} catch ( e ) {

// 		console.error( e );

// 	}

// } );

</script>

<style lang="scss" scoped>

</style>
