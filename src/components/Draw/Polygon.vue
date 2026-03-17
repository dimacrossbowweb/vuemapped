<script lang="ts" setup>
import { Map } from 'maplibre-gl';
import {

	type Ref,

	inject,
	ref,
	computed,
	onMounted,
	watchEffect,
	watch,

} from 'vue';
import { useFormat } from '../../composables/useFormat';

interface IProps {

	antialias: boolean;
	color: string;
	outlineColor: string;
	opacity: string | number;

	blur: string | number;
	translate: [x: string | number, y: string | number];
	translateAnchor: 'map' | 'viewport';

};

const mounted = ref<boolean>( false );

const map = inject<Ref<Map | null>>( 'mapInstance' );
const layerName = inject<Ref<string>>( 'layerName' );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	color: 'white',
	outlineColor: 'white',

} );

const { parseColor } = useFormat();

const antialias = computed( () => !!props?.antialias );
const color = computed( () => parseColor( props?.color )?.toString() );
const outlineColor = computed( () => parseColor( props?.outlineColor )?.toString() );
const opacity = computed( () => props?.opacity ? +props.opacity : 1 );

const blur = computed( () => props?.blur ? +props.blur : 0 );
const translate = computed( () => props?.translate ?? [0, 0] );
const translateAnchor = computed( () => props?.translateAnchor ?? 'map' );

const isReady = computed( () => {

	return mounted.value &&
		   map?.value instanceof Map &&
		   typeof layerName?.value === 'string' &&
		  !!map.value.getLayer( layerName?.value );

} );

function draw ( property: string, value: any ) {

	if ( isReady.value ) {

		const propertyName: string = `fill-${ property }`;

		console.log(isReady.value);

		console.log( 'layerName?.value = ', layerName?.value );
		console.log( 'propertyName = ', propertyName );
		console.log( 'value = ', value );

		map?.value?.setPaintProperty( layerName?.value, propertyName, value );

	}

}

onMounted( () => {

	mounted.value = true;

} );

watch ( () => isReady.value, ( val ) => {

	if ( val ) {

		draw( 'antialias', antialias.value );
		draw( 'color', color.value );
		draw( 'outline-color', outlineColor.value );
		draw( 'opacity', opacity.value );
		
		draw( 'blur', blur.value );
		draw( 'translate', translate.value );
		draw( 'translate-anchor', translateAnchor.value );

	}

	},

);


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
