<template>

	<div v-bind="mainAttrs">

		<div
		
			ref="map"
			v-bind="mapAttrs"

		>

			<slot v-if="!isLoading"></slot>

		</div>

		<div v-bind="loadAttrs">
				
			<ui-overlay
			
				:blur="15"
				opacity="0.9"
				color="#000000"

				v-bind="overlayAttrs"
				
			>

				<ui-preloader
				
					:size="84"
					color="white"
				
				/>

			</ui-overlay>

		</div>

	</div>

</template>

<script setup>
import {

	useSlots,
	ref,
	useTemplateRef,
	provide,
	computed,
	onMounted,
	watch,

} from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useFormat } from '../composables/useFormat';
import { useBem } from '../composables/useBem';

import UiOverlay from './ui/overlay/index.vue';
import UiPreloader from './ui/preloader/index.vue';

// Импортируйте стили заранее
import defaultStyle from './style/galatasaray/style.json';

const props = defineProps( {

	width: {

		type: [ String, Number ],
		default: '100%',
		validator ( val ) {

			return [ 'string', 'number' ].includes( typeof val );

		}

	},

	height: {

		type: [ String, Number ],
		default: '100%',
		validator ( val ) {

			return [ 'string', 'number' ].includes( typeof val );

		}

	},

	mapStyle: {

		type: String,
		default: 'default'

	},

	options: {

		type: Object,
		default: () => ( {} ),
		validator ( val ) {

			return typeof val === 'object';

		}

	},

} );

const slots = useSlots();

let mapInstance = ref(null);

const isLoading = ref( true );

const mapContainer = useTemplateRef( 'map' );

const { parseValue } = useFormat();

const width = computed( () => {

	return parseValue( props?.width ).toString();

} );

const height = computed( () => {

	return parseValue( props?.height ).toString();

} );

const zoom = computed( () => props?.options?.zoom ?? 2 );
const center = computed( () => props?.options?.center ?? [ 0, 0 ] );
const pitch = computed( () => props?.options?.pitch ?? 0 );
const bearing = computed( () => props?.options?.center ?? 0 );

const defaultOptions = computed( () => {

	return {

		container: mapContainer.value,
		style: `https://tris5572.github.io/map-style/dark/style.json`,
		center: [30.2656504, 59.8029126],
		zoom: 2,
		pitch: 0,
		bearing: 0,
		projection: 'globe',
		antialias: true,

	};

} );

watch ( () => zoom.value, ( val ) => {

	if ( mapInstance.value && mapInstance.value.getZoom() !== val ) {
    
		mapInstance.value.easeTo({ zoom: val, duration: 300 });

	}

	}, 
	{ immediate: true }

);

watch ( () => center.value, ( val ) => {

	if ( mapInstance.value ) {
		mapInstance.value.easeTo({ 
			center: val, 
			duration: 300 
		});
	}

}, { immediate: true } );

watch ( () => bearing.value, ( val ) => {

	if ( mapInstance.value ) {

		mapInstance.value.setBearing( val );

	}

}, { immediate: true } );

watch ( () => pitch.value, ( val ) => {
	
	if ( mapInstance.value ) {
	
		mapInstance.value.setPitch( val );
	
	}

}, { immediate: true } );
 
const options = computed( () => {

	return {

		...( props?.options ?? {} ),
		...defaultOptions.value,

	};

} );

onMounted( () => {

	if ( mapContainer.value instanceof HTMLDivElement ) {

		mapInstance.value = new maplibregl.Map( options.value );

		// mapInstance.value.on('style.load', () => {
		// 	mapInstance.value.setProjection({
		// 		type: 'globe', // Set projection to globe
		// 	});
		// });

		mapInstance.value.on('load', () => {
			// Insert the layer beneath any symbol layer.
			const layers = mapInstance.value.getStyle().layers;

			let labelLayerId;
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
					labelLayerId = layers[i].id;
					break;
				}
			}

			mapInstance.value.addSource('openfreemap', {
				url: `https://tiles.openfreemap.org/planet`,
				type: 'vector',
			});

			mapInstance.value.addLayer(
				{
					'id': '3d-buildings',
					'source': 'openfreemap',
					'source-layer': 'building',
					'type': 'fill-extrusion',
					'minzoom': 15,
					'filter': ['!=', ['get', 'hide_3d'], true],
					'paint': {
						'fill-extrusion-color': [
							'interpolate',
							['linear'],
							['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
						],
						'fill-extrusion-height': [
							'interpolate',
							['linear'],
							['zoom'],
							15,
							0,
							16,
							['get', 'render_height']
						],
						'fill-extrusion-base': ['case',
							['>=', ['get', 'zoom'], 16],
							['get', 'render_min_height'], 0
						]
					}
				},
				labelLayerId
			);

			isLoading.value = false;

		});

	}

} );

const { block, element } = useBem( 'Map' );

const mainClass = computed( () => {

	return block.classify();

} );

const mainAttrs = computed( () => ( {

	'class': mainClass.value,

} ) );

const mapClass = computed( () => {

	return element( 'map' ).classify();

} );

const mapAttrs = computed( () => ( {

	'class': mapClass.value,

} ) );

const loadClass = computed( () => {

	return element( 'load' )
		.m( 'show', isLoading.value )
		.classify();

} );

const loadAttrs = computed( () => ( {

	'class': loadClass.value,

} ) );

const overlayClass = computed( () => {

	return element( 'overlay' ).classify();

} );

const overlayAttrs = computed( () => ( {

	'class': overlayClass.value,

} ) );

provide( 'mapInstance', mapInstance );

</script>

<style lang="scss" scoped>
.map {

	position: relative;

	width: v-bind( width );
	height: v-bind( height );

	box-sizing: border-box;

	&__map {

		width: 100%;
		height: 100%;

	}

	&__load {

		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		z-index: 1;

		pointer-events: none;

		opacity: 0;

		transition: opacity .4s;

		&_show {

			pointer-events: auto;

			opacity: 1;

		}

	}

		&__overlay {

			display: flex;
			justify-content: center;
			align-items: center;

		}

}

</style>