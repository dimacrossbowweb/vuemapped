<template>

	<div
	
		v-if="value"
		ref="popup"
		v-bind="wrapperAttrs"
		
	>

		<slot></slot>

	</div>

</template>

<script lang="ts" setup>
import {
	
	type Ref,

	watch,

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
import { Map, Popup, } from 'maplibre-gl';
import { useBem } from '../composables/useBem';
import { useFormat } from '../composables/useFormat';

interface IProps {

	namespace: string;
	lat: string | number;	
	lng: string | number;
	width: string | number;
	height: string | number;
	disabled: boolean;
	options: Record<string, any>;

};

const props = withDefaults( defineProps<Partial<IProps>>(), {

	namespace: '',
	lat: 0,
	lng: 0,
	width: 'auto',
	height: 'auto',
	disabled: false,
	options: () => ( {} ),

} );

const value = defineModel( { default: false } );

const slots = useSlots();

const emit = defineEmits( [

	'click',

] );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const popup = useTemplateRef( 'popup' );

const popupHandle = ref<Popup>();

const hasSlotContent = computed( () => {

	if ( slots.default ) {

		const slotContent = slots.default();
		return slotContent && slotContent.length > 0;

	}
	
	return false;

} );

const { block } = useBem( 'MapPopup' );

const namespace = computed( () => props?.namespace ?? '' );
const lat = computed( () => +props?.lat );
const lng = computed( () => +props?.lng );

const { parseValue } = useFormat();

const width = computed( () => parseValue( props?.width ) );
const height = computed( () => parseValue( props?.height ) );

const disabled = computed( () => !!props.disabled );

const wrapperClass = computed( () => {

	return block
			.mix( namespace.value )
			.m( 'disabled', disabled.value )
			.classify();

} );

const wrapperAttrs = computed( () => ( {

	'class': wrapperClass.value,

} ) );

const mainClass = computed( () => {

	return block
			.mix( namespace.value )
			.m( 'disabled', disabled.value )
			.toString();

} );

const options = computed( () => {
	
	const options = props?.options ?? {};

	return {

		...options,

		'className': mainClass.value,

	};

} );

onMounted( () => {

	watchEffect( () => {

		if (
			
			popup?.value instanceof HTMLDivElement &&
			hasSlotContent.value &&
			!popupHandle.value
		
		) {

			if ( map?.value instanceof Map ) {

				if ( value.value ) {

					popupHandle.value = new maplibregl.Popup( options.value )
											.setLngLat( [ lng.value, lat.value ] )
											.setDOMContent( popup.value )
											.addTo( map.value );

				} else {

					if ( popupHandle.value instanceof Popup ) {

						popupHandle.value.remove();

					}

				}

			}

		}

	} );
 
} );

watch( [ lat, lng ], () => {

	if ( popupHandle.value && map?.value instanceof Map ) {

		popupHandle.value.setLngLat( [ lng.value, lat.value ] );

	}

} );

onBeforeUnmount( () => {

	if ( popupHandle.value instanceof Popup ) {

		popupHandle.value.remove();

	}

} );

</script>

<style lang="scss">
.map-popup-wrapper {

	display: contents;

}

.map-popup {

	width: v-bind( width );
	height: v-bind( height );

	.maplibregl-popup-content {
		padding: 0;

		width: v-bind( width );
		height: v-bind( height );

		background: none;
	}

	.maplibregl-popup-tip {

		display: none;

	}
	
	.alert-content {
		display: flex;
		align-items: center;
		padding: 12px 16px;
	}
	
	.alert-icon {
		margin-right: 12px;
		font-size: 20px;
	}

	&_disabled {

		pointer-events: none;

	}

}

</style>
