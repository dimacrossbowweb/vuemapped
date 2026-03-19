<template></template>

<script lang="ts" setup>
import {
	type Ref,

	inject,
	computed,
	onMounted,
	watchEffect,
	onBeforeUnmount,
	watch,
} from 'vue';
import { Map, Source, SourceSpecification } from 'maplibre-gl';
import { type IMapSource, MapSource } from '../global/lib/map-source';

interface IProps {

	name: string;
	options: Partial<SourceSpecification>;

};

const props = withDefaults( defineProps<Partial<IProps>>(), {

	name: '',
	options: () => ( {} ),

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const name = computed( () => props?.name ?? '' );
const options = computed( () => props?.options ?? {} );

let source: IMapSource | null;

onMounted( () => {

	watchEffect( () => {

		if ( map?.value instanceof Map ) {

			if ( !map.value.getSource( name.value ) ) {

				source = MapSource.create( name.value, options.value );

				map.value.addSource( name.value, source.options as SourceSpecification );

			}

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

function updateSourceData ( options: Partial<SourceSpecification> ) {

	if ( map?.value instanceof Map && options?.data ) {

		const source = map.value.getSource( name.value ) as Source;

		if ( source ) {

			source.setData( options.data );

		}

	}

}

watch(
	
	() => options.value,
	( value: Partial<SourceSpecification> ) => {

      updateSourceData( value );

	},
	{ 
		deep: true,
		immediate: false
	}
);

</script>
