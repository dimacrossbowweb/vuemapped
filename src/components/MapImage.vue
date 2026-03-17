<template>



</template>

<script lang="ts" setup>
import {

	type Ref,

	inject,
	computed,
	onMounted,
	onBeforeUnmount,
	watchEffect,

} from 'vue';
import { Map } from 'maplibre-gl';
import { useFormat } from '../composables/useFormat';

interface IProps {

	src: string;
	lat: string | number;	
	lng: string | number;
	width: string | number;
	height: string | number;

};

const props = withDefaults( defineProps<Partial<IProps>>(), {

	src: '',
	lat: 0,
	lng: 0,
	width: 'auto',
	height: 'auto',

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const { parseValue } = useFormat();

const src = computed( () => props?.src ?? '' );
const lat = computed( () => +props?.lat );
const lng = computed( () => +props?.lng );
const width = computed( () => parseValue( props?.width ) );
const height = computed( () => parseValue( props?.height ) );

onMounted( () => {

	watchEffect( () => {

		if ( map?.value instanceof Map ) {

			map.value.loadImage( src.value ).then( ( image ) => {



			} );

		}

	} );

} );

onBeforeUnmount( () => {

	try {

		// map?.value instanceof Map && map.value.removeSource( name.value );

	} catch ( e ) {

		console.error( e );

	}

} );

</script>
