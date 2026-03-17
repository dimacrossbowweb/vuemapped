<template>
	
	<svg v-bind="mainAttrs">

		<defs>

			<clipPath :id="`${ id }-cut-off`">

				<rect
					x="0"
					y="0"
					:width="size"
					:height="size" />

			</clipPath>

			<linearGradient :id="`${ id }-gradient`">

				<stop
					offset="0"
					:stop-color="color"></stop>

				<stop
					offset="75%"
					:stop-color="color"
					stop-opacity="0"
				></stop>

			</linearGradient>

		</defs>

		<circle

			:cx="centerX"
			:cy="centerY"
			:r="radius"
			:stroke="`url(#${ id }-gradient )`"
			:stroke-width="strokeWidth"
			fill="none"
			clip-path="url(#${ id }-cut-off )`"

		>

			<animateTransform

				attributeName="transform"
				attributeType="XML"
				type="rotate"
				:from="`0 ${ centerX } ${ centerY }`"
				:to="`360 ${ centerX } ${ centerY }`"
				dur="1s"
				repeatCount="indefinite" />

		</circle>

	</svg>

</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import { computed } from 'vue';
import { useFormat } from '../../../composables/useFormat';
import { useBem } from '../../../composables/useBem';
import { useCSSVar } from '../../../composables/useCSSVar';

const sizes: Record<string, any> = {

	'small': 24,
	'normal': 36,
	'large': 48

};

interface IProps {

	namespace: string;
	size: string | number;
	strokeWidth: string | number;
	color: string;

};

defineOptions( {

	name: 'UiPreloader',

} );

const props = withDefaults ( defineProps<Partial<IProps>> (), {

	namespace: '',
	size: 28,
	strokeWidth: 2,
	color: 'primary'

} );

const { parseColor } = useFormat();

const namespace = computed( () => props?.namespace ? props.namespace : '' );

const id = computed( () => uuidv4() );

const colorVar = computed( () => useCSSVar( props.color ) );
const color = computed( () => parseColor( colorVar?.value ? colorVar.value : props.color ) );
const size = computed( () => {

	if ( typeof props.size === 'string' && props.size in sizes ) {

		return sizes[ props.size ];

	}
	
	return +props.size;

} );

const strokeWidth = computed( () => +props.strokeWidth );

const radius = computed( () => size.value / 2 );

const centerX = computed( (): number => ( size.value + strokeWidth.value ) / 2 );

const centerY = computed( (): number => ( size.value + strokeWidth.value ) / 2 );

const viewBox = computed( (): string => `0 0 ${ size.value + strokeWidth.value } ${ size.value + strokeWidth.value }` );

const { block } = useBem( 'UiPreloader' );

const mainClass = computed( () => {

	return block
			.mix( namespace.value )
			.classify();

} );

const mainAttrs = computed( () => ( {

	'class': mainClass.value,

	'viewBox': viewBox.value,
	'width': size.value,
	'height': size.value,

} ) );

</script>
