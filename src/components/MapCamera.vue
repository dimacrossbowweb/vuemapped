<script lang="ts" setup>
import {

	type Ref,

	inject,
	computed,
	onMounted,
	watchEffect,
	watch,

} from 'vue';
import { Map } from 'maplibre-gl';

interface IProps {

	lat: string | number;	
	lng: string | number;
	bearing: string | number;
	pitch: string | number;
	zoom: string | number;
	duration: string | number;

};

const props = withDefaults( defineProps<Partial<IProps>>(), {

	lat: 0,
	lng: 0,
	bearing: 0,
	pitch: 0,
	zoom: 0,

} );

const map = inject<Ref<Map | null>>( 'mapInstance' );

const lat = computed( () => +props?.lat );
const lng = computed( () => +props?.lng );
const bearing = computed( () => +props?.bearing );
const pitch = computed( () => +props?.pitch );
const zoom = computed( () => +props?.zoom );

onMounted( () => {

	watchEffect( () => {

		if ( map?.value instanceof Map ) {

			map.value.setZoom( zoom.value );
			map.value.setCenter( [ lat.value, lng.value ] );
			map.value.setBearing( bearing.value );
			map.value.setPitch( pitch.value );

		}

	} );

} );

watch ( () => zoom.value, ( val ) => {

	if ( map?.value instanceof Map ) {
    
		map.value.easeTo({ zoom: val, duration: 300 });

	}

	}, 
	{ immediate: true }

);

watch( [ lat, lng ], () => {

	if ( map?.value instanceof Map ) {

		map.value.easeTo({ 
			center: [ lat.value, lng.value ], 
			duration: 300 
		});
	}

}, { immediate: true } );

watch ( () => bearing.value, ( val ) => {

	if ( map?.value instanceof Map ) {

		map.value.setBearing( val );

	}

}, { immediate: true } );

watch ( () => pitch.value, ( val ) => {
	
	if ( map?.value instanceof Map ) { 
	
		map.value.setPitch( val );
	
	}

}, { immediate: true } );

</script>
