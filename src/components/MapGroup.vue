<template>

	<div
	
		v-if="display"
		v-bind="mainAttrs"
		
	>

		<slot></slot>

	</div>

</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useBem } from '../composables/useBem';

interface IProps {

	display: boolean;
	disabled: boolean;

};

const props = withDefaults( defineProps<Partial<IProps>>(), {

	display: true,
	disabled: false,

} );

const display = computed( () => !!props?.display );
const disabled = computed( () => !!props?.disabled );

const { block } = useBem( 'MapGroup' );

const mainClass = computed( () => {

	return block
			.m( 'disabled', disabled.value )
			.classify();

} );

const mainAttrs = computed( () => ( {

	'class': mainClass.value,

} ) );

</script>

<style lang="scss">
.map-group {

	// display: contents;

	&_disabled > * {

		pointer-events: none;

		border: 2px solid red!important;

	}

}

.map-group > .map-marker {

	border: 2px solid red!important;

}

</style>
