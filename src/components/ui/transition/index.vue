<template>

	<div v-bind="mainAttrs">

		<template v-if="show">

			<div
			
				ref="container"
				v-bind="containerAttrs"
			
			>
			
				<slot></slot>

			</div>

		</template>

	</div>

</template>

<script lang="ts" setup>
import {
	
	useTemplateRef,
	ref,
	computed,
	watch,
	onMounted,
	nextTick,

} from 'vue';
import { useBem } from '../../../composables/useBem';

interface IProps {

	namespace: string;
	
	duration: string | number;

	onEnter: ( el: HTMLElement, duration: number ) => any;
	onLeave: ( el: HTMLElement, duration: number ) => any;

};

const emit = defineEmits( [ 
	
	'on-before-enter',
	'on-after-leave',

] );

defineOptions( {

	name: 'UiTransition',

} );

const props = withDefaults( defineProps<Partial<IProps>>(), {

	namespace: '',
	duration: 300,

} );

const value = defineModel( { default: false } );

const { block, element } = useBem( 'UiTransition' );

const container = useTemplateRef<any>( 'container' );
const show = ref<boolean>( false );
const animCtx = ref<any>( null );

const namespace = computed( () => props?.namespace ? props.namespace : '' );
const duration = computed( () => props.duration || 300 );

const mainClass = computed( () => {

	return block
			.mix( namespace.value )
			.classify();

} );

const mainAttrs = computed( () => ( {

	class: mainClass.value,

} ) );

const containerClass = computed( () => {

	return element( 'container' )
			.mix( namespace.value )
			.classify();

} );

const containerAttrs = computed( () => ( {

	class: containerClass.value,

} ) );

watch( value, () => {

	if ( value.value ) {

		manipulate( true );

	}

	else {

		manipulate( false );

	}

} );

onMounted((): void => {

	nextTick((): void => {

		manipulate( value.value );

	});

});

async function manipulate ( value: boolean ): Promise<any> {

	if ( value ) {

		show.value = true;

		await nextTick();

		emit( 'on-before-enter' );

		container.value && Array.from(container.value.children).forEach( ( item: any ) => {
			
			typeof props?.onEnter === 'function' && props.onEnter( item, +duration.value );
			
		} );

		clearTimeout(animCtx.value);

		await nextTick();

	} else {

		container.value && Array.from(container.value.children).forEach( ( item: any ) => {
			
			typeof props?.onLeave === 'function' && props.onLeave( item, +duration.value );
			
		} );

		clearTimeout(animCtx.value);

		animCtx.value = setTimeout((): void => {
			
			show.value = false;

			emit( 'on-after-leave' );
		
		}, +duration.value);

	}

}

</script>

<style lang="scss" scoped>
.ui-transition {

	display: contents;

	&__container {

		display: contents;

	}

}

</style>
