<template></template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { Map, GeoJSONSource, } from 'maplibre-gl';
import {

	type Ref,

	inject,
	computed,
	onMounted,
	watchEffect,
	watch,
	onBeforeUnmount,

} from 'vue';
import { useFormat } from '../../composables/useFormat';

interface IProps {

	lat: string | number;	
	lng: string | number;

	radius: number | number[];
	color: string;
	opacity: string | number;
	strokeWidth: string | number;
	strokeColor: string;
	strokeOpacity: string | number;

	blur: string | number;
	translate: [x: string | number, y: string | number];
	translateAnchor: 'map' | 'viewport';

	pitchScale: 'map' | 'viewport';
	pitchAlignment: 'map' | 'viewport';

};

const map = inject<Ref<Map | null>>( 'mapInstance' );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	lat: 0,
	lng: 0,

	color: 'white',
	strokeColor: 'white',

} );

const { parseColor } = useFormat();

const name = uuidv4();

const lat = computed( () => +props?.lat );
const lng = computed( () => +props?.lng );

const radius = computed(() => {

	if (!props.radius) return 5;

	if (typeof props.radius === 'string') {

		const num = parseFloat(props.radius);
		return isNaN(num) ? 5 : num;

	}
	

	if (Array.isArray(props.radius)) {

		return props.radius;

	}
	
	return props.radius;

});
const color = computed( () => parseColor( props?.color )?.toString() ?? '#ffffff' );
const opacity = computed( () => props?.opacity ? +props.opacity : 1 );
const strokeWidth = computed( () => props?.strokeWidth ? +props.strokeWidth : 20 );
const strokeColor = computed( () => parseColor( props?.strokeColor )?.toString() ?? '#ffffff' );
const strokeOpacity = computed( () => props?.strokeOpacity ? +props.strokeOpacity : 1 );

const blur = computed( () => props?.blur ? +props.blur : 0 );
const translate = computed( () => props?.translate ?? [0, 0] );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );

const pitchScale = computed( () => props?.pitchScale ?? 'map' );
const pitchAlignment = computed( () => props?.pitchAlignment ?? 'map' );

function draw ( property: string, value: any ) {

	if ( map?.value instanceof Map ) {

		const propertyName: string = `circle-${ property }`;

		map?.value?.setPaintProperty( name, propertyName, value );

	}

}

onMounted( () => {

	watchEffect( () => {

		if ( map?.value instanceof Map && !map.value.getSource( name ) ) {

			map.value.addSource( name, {

				'type': 'geojson',

				'data': {

					'type': 'Feature',
					'geometry': {

						'type': 'Point',
						'coordinates': [lat.value, lng.value]
					
					},

					'properties': {}
					
				}

			} );

			map.value.addLayer({

				'id': name,
				'type': 'circle',
				'source': name,
				'paint': {

					'circle-radius': radius.value,
					'circle-color': color.value,
					'circle-opacity': opacity.value,

					'circle-stroke-width': strokeWidth.value,
					'circle-stroke-color': strokeColor.value,
					'circle-stroke-opacity': strokeOpacity.value,

					'circle-blur': blur.value,
					'circle-translate': translate.value,
					'circle-translate-anchor': translateAnchor.value,
					'circle-pitch-scale': pitchScale.value,
					'circle-pitch-alignment': pitchAlignment.value,

				}

			});

		}

	} );
 
} );

onBeforeUnmount( () => {

	try {

		if ( map?.value instanceof Map ) {

			map.value.removeLayer( name );
			map.value.removeSource( name );

		}

	} catch ( e ) {

		console.error( e );

	}

} );

function updatePointCoordinates(lng: number, lat: number) {

	if (map?.value instanceof Map) {
    
		const source = map.value.getSource(name);
    
		if (source) {
      
			(source as GeoJSONSource).setData({

				'type': 'Feature',
				'geometry': {

					'type': 'Point',
					'coordinates': [lng, lat]

				},
				'properties': {}

			});
    
		}
  	
	}

}

watch([lat, lng], ([ newLat, newLng ]) => {

	updatePointCoordinates( newLng, newLat );

}, { immediate: true });

watch ( () => radius.value, ( val: number | number[] ) => draw( 'radius', val ) );
watch ( () => color.value, ( val: string ) => draw( 'color', val ) );
watch ( () => opacity.value, ( val: number ) => draw( 'opacity', val ) );
watch ( () => strokeWidth.value, ( val: number ) => draw( 'stroke-width', val ) );
watch ( () => strokeOpacity.value, ( val: number ) => draw( 'stroke-opacity', val ) );
watch ( () => strokeColor.value, ( val: string ) => draw( 'stroke-color', val ) );
watch ( () => blur.value, ( val: number ) => draw( 'blur', val ) );
watch ( () => translate.value, ( val: [x: string | number, y: string | number] ) => draw( 'translate', val ) );
watch ( () => translateAnchor.value, ( val: 'map' | 'viewport' ) => draw( 'translate-anchor', val ) );
watch ( () => pitchScale.value, ( val: 'map' | 'viewport' ) => draw( 'pitch-scale', val ) );
watch ( () => pitchAlignment.value, ( val: 'map' | 'viewport' ) => draw( 'pitch-alignment', val ) );

</script>
