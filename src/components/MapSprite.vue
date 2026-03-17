<template>
	
	<div
	
		ref="sprite"
		v-bind="mainAttrs"
		
	>

		<slot></slot>

	</div>

</template>

<script lang="ts" setup>
import {
	type Ref,

	inject,
	useTemplateRef,
	useSlots,
	computed,
	onMounted,
	watchEffect,
	onBeforeUnmount,
	watch,

} from 'vue';
import { Map } from 'maplibre-gl';
import { useBem } from '../composables/useBem';

interface IProps {

	name: string;
	src: string;

};

const props = withDefaults( defineProps<Partial<IProps>>(), {

	name: '',
	src: '',

} );

const slots = useSlots();

const sprite = useTemplateRef( 'sprite' );

// const markerHandle = ref<Marker>();

const map = inject<Ref<Map | null>>( 'mapInstance' );

const name = computed( () => props?.name ?? '' );
const src = computed( () => props?.src ?? '' );

const hasSlotContent = computed( () => {

	if ( slots.default ) {

		const slotContent = slots.default?.({});
		return slotContent && slotContent.length > 0;

	}
	
	return false;

} );

async function update () {

	if (
		
		sprite?.value instanceof HTMLDivElement &&
		hasSlotContent.value
	
	) {

		if ( map?.value instanceof Map ) {

			map.value.hasImage( name.value ) && map.value.removeImage( name.value );

		}

	} else if ( !!src.value ) {

		console.log( 'SRC = ', src.value );

		if ( map?.value instanceof Map ) {

			map.value.hasImage( name.value ) && map.value.removeImage( name.value );

			const image = await map.value.loadImage( src.value );

			console.log( 'image = ', image );
  
			map.value.addImage(name.value, image.data);

		}

	}

}

onMounted( () => {

	update();

	watchEffect( () => {

		try {

			if ( !name.value && typeof name.value !== 'string' ) {

				throw new Error( '[ MapSprite ] name is required and must be a string' );

			}

			// update();

		} catch ( e: unknown ) {

			console.error( e );

		} 

	} );

} );

onBeforeUnmount( () => {

	try {

		map?.value instanceof Map && map.value.removeSource( name.value );

	} catch ( e ) {

		console.error( e );

	}

} );

watch( () => src.value, () => update() );

const { block } = useBem( 'MapSprite' );

const mainClass = computed( () => {

	return block.classify();

} );

const mainAttrs = computed( () => ( {

	'class': mainClass.value,

} ) );

</script>

<style lang="scss" scoped>
.map-sprite {



}

</style>
