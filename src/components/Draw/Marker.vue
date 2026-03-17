<template>

	<div
	
		ref="marker"
		v-bind="mainAttrs"
		
	>

		<slot></slot>

	</div>

</template>

<script lang="ts" setup>
import {
	
	type Ref,

	watch,

	useAttrs,
	useSlots,
	ref,
	useTemplateRef,
	computed,
	inject,
	onMounted,
	watchEffect,
	onBeforeUnmount,

} from 'vue';
import maplibregl from 'maplibre-gl';
import { Map, Marker, } from 'maplibre-gl';
import { useBem } from '../../composables/useBem';
import { useFormat } from '../../composables/useFormat';

interface IProps {

	namespace: string;
	lat: string | number;	
	lng: string | number;
	width: string | number;
	height: string | number;
	disabled: boolean;

};

const props = withDefaults( defineProps<Partial<IProps>>(), {

	namespace: '',
	lat: 0,
	lng: 0,
	width: 'auto',
	height: 'auto',
	disabled: false,

} );

const attrs = useAttrs();
const slots = useSlots();

const emit = defineEmits( [

	'click',

] );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const marker = useTemplateRef( 'marker' );

const markerHandle = ref<Marker>();

const hasSlotContent = computed( () => {

	if ( slots.default ) {

		const slotContent = slots.default?.({});
		return slotContent && slotContent.length > 0;

	}
	
	return false;

} );

const hasMapInstance = computed( () => {

	return map?.value instanceof Map;

} );

const { block } = useBem( 'DrawMarker' );

const namespace = computed( () => props?.namespace ?? '' );
const lat = computed( () => +props?.lat );
const lng = computed( () => +props?.lng );

const { parseValue } = useFormat();

const width = computed( () => parseValue( props?.width ) );
const height = computed( () => parseValue( props?.height ) );

const disabled = computed( () => !!props.disabled );

const mainClass = computed( () => {

	return block
			.mix( namespace.value )
			.m( 'disabled', disabled.value )
			.classify();

} );

const on = computed( () => ( {

	'onClick': () => { emit( 'click' ); },

} ) );

const mainAttrs = computed( () => ( {

	'class': mainClass.value,

	...on.value,

	...attrs,

} ) );

onMounted( () => {

	watchEffect( () => {

		if (
			
			marker?.value instanceof HTMLDivElement &&
			hasSlotContent.value &&
			!markerHandle.value
		
		) {

			if ( map?.value instanceof Map ) {

				markerHandle.value = new maplibregl.Marker( { element: marker.value } )
										.setLngLat( [ lng.value, lat.value ] )
										.addTo( map.value );

			}

		}

	} );

} );

watch( [ lat, lng ], () => {

	if ( markerHandle.value && map?.value instanceof Map ) {

		markerHandle.value.setLngLat( [ lng.value, lat.value ] );

	}

} );

onBeforeUnmount( () => {

	if ( markerHandle.value instanceof Marker ) {

		markerHandle.value.remove();

	}

} );

function onClick ( e: unknown ) {

	emit( 'click', e );

}


// function addEvents() {

// 	if ( markerHandle.value instanceof Marker ) {

// 		markerHandle.value.addEventListener( 'click', onClick );

// 	}

// }

// function removeEvents() {

// 	if ( map?.value instanceof Map ) {

// 		map.value.off( 'click', name.value, onClick );

// 	}

// }

</script>

<style lang="scss" scoped>
.draw-marker {

	width: v-bind( width );
	height: v-bind( height );

	&_disabled {

		pointer-events: none;

	}

}

</style>
