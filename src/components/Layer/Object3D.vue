<template>
	<div class="map-layer">
		<slot v-if="!isLoading"></slot>
	</div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { Map } from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { ColorRgb, useFormat } from '../../composables/useFormat';
import { Color } from '../../composables/useFormat/entities/color/color';
import {

	type Ref,

	shallowRef,
	markRaw,
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

	lat: string | number;
	lng: string | number;
	altitude: string | number;

	src: string;

	size: string | number;
	color: string;
	rotation: [number, number, number];
	opacity: string | number;

};

const emit = defineEmits( ['click'] );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	lat: 0,
	lng: 0,
	altitude: 0,

	src: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Box/glTF-Binary/Box.glb',

	size: 10000,
	color: '#ffffff',
	rotation: () => [0, 0, 0] as [number, number, number],
	opacity: 1,

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const { parseColor } = useFormat();

const _name = uuidv4();
const name = computed( () => props?.name ?? _name );

const overlay = shallowRef<MapboxOverlay | null>( null );

const lat      = computed( () => +props.lat );
const lng      = computed( () => +props.lng );
const altitude = computed( () => props.altitude ? +props.altitude : 0 );
const size     = computed( () => props.size     ? +props.size     : 10000 );

const color = computed( () => {

	const c = ( Color.convert( parseColor( props?.color ), 'rgb' ) ?? new ColorRgb( 255, 255, 255, 1 ) ) as ColorRgb;

	return [ c.r, c.g, c.b, Math.round( 255 * c.a ) ];

} );

const rotation = computed( () => props.rotation ?? [0, 0, 0] as [number, number, number] );
const opacity  = computed( () => props.opacity  ? +props.opacity : 1 );

const isLoading = ref( true );
const layerName = ref<string>( '' );

function createLayer() {

	return markRaw( new ScenegraphLayer( {

		id: name.value,

		data: [ {
			position: [ lng.value, lat.value, altitude.value ],
			color: color.value,
			rotation: rotation.value,
		} ],

		scenegraph: props.src,

		getPosition:    ( d: any ) => d.position,
		getColor:       ( d: any ) => d.color,
		getOrientation: ( d: any ) => d.rotation,

		sizeScale: size.value,
		opacity: opacity.value,

		_lighting: 'flat',
		pickable: true,

		parameters: {
			depthTest: true,
			depthWrite: true,
		},

		onClick: ( info: any ) => emit( 'click', info ),

	} ) );

}

function update() {

	if ( overlay.value ) {

		overlay.value.setProps( { layers: [ createLayer() ] } );

	}

}

onMounted( () => {

	watchEffect( () => {

		if ( map?.value instanceof Map && !overlay.value ) {

			overlay.value = markRaw( new MapboxOverlay( {
				interleaved: true,
				layers: [ createLayer() ],
			} ) );

			map.value.addControl( overlay.value );

			layerName.value = name.value;

			isLoading.value = false;

		}

	} );

} );

onBeforeUnmount( () => {

	try {

		if ( map?.value instanceof Map && overlay.value ) {

			map.value.removeControl( overlay.value );

		}

	} catch ( e ) {

		console.error( e );

	}

} );

watch( [lat, lng],           () => update() );
watch( () => altitude.value, () => update() );
watch( () => size.value,     () => update() );
watch( () => color.value,    () => update(), { deep: true } );
watch( () => rotation.value, () => update(), { deep: true } );
watch( () => opacity.value,  () => update() );
watch( () => props.src,      () => update() );

provide( 'layerName', layerName );
</script>

<style lang="scss" scoped>
</style>
