<template>
	
	<div v-bind="mainAttrs">

		<slot></slot>

	</div>

</template>

<script lang="ts" setup>
import { 
	
	computed

} from 'vue';
import { useFormat } from '../../../composables/useFormat';
import { useBem } from '../../../composables/useBem';
import { useCSSVar } from '../../../composables/useCSSVar';

interface IProps {

	namespace: string;
	fixed: boolean;
	intangible: boolean;
	color: string;
	opacity: string | number;
	blur: string | number;

};

const props = withDefaults ( defineProps<Partial<IProps>>(), {

	namespace: '',
	fixed: false,
	intangible: false,
	color: '#000000',
	opacity: 0.5,
	blur: 0,

} );

const { parseColor } = useFormat();

const namespace = computed( () => props?.namespace ?? '' );
const fixed = computed( () => !!props.fixed );
const intangible = computed( () => !!props.intangible );

const colorVar = computed( () => useCSSVar( props.color ) );

const color = computed( () => parseColor( colorVar?.value ? colorVar.value : props.color ) );

const opacity = computed ( (): number => {

	let value: number = 0.5;

	if ( typeof props.opacity === 'string' && !isNaN ( +props.opacity ) ) {

		value = ( +props.opacity ) >= 0 && ( +props.opacity ) <= 1 ? +props.opacity : 0.5;

	}

	if ( typeof props.opacity === 'number' ) {

		value = props.opacity >= 0 && props.opacity <= 1 ? props.opacity : 0.5;

	}

	return value;

} );

const blur = computed( (): string => {

	if ( typeof props.blur === 'string' ) {

		return parseInt( props.blur ).toString() === props.blur ? `${ props.blur }px` : props.blur;

	}

	return `${ props.blur }px`;

} );

const { block } = useBem( 'UiOverlay' );

const mainClass = computed( () => {

	return block
			.mix( namespace.value )
			.m( 'fixed', fixed.value )
			.m( 'intangible', intangible.value )
			.classify();

} );

const mainAttrs = computed( () => ( {

	'class': mainClass.value,

} ) );

</script>

<style lang="scss" scoped>
.ui-overlay {

	position: absolute;
	left: 0;
	top: 0;

	width: 100%;
	height: 100%;

	background-color: v-bind( color );

	backdrop-filter: blur( v-bind( blur ) );

	opacity: v-bind( opacity );

	&_fixed {

		position: fixed;

	}

	&_intangible {

		pointer-events: none;

	}

}
</style>
