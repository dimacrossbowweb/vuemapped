<template>
	<div class="map-layer">
		<slot v-if="!isLoading"></slot>
	</div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid';
import {
	type Ref,
	inject,
	provide,
	ref,
	computed,
	onMounted,
	watchEffect,
	onBeforeUnmount,
} from 'vue';
import { Map, SourceSpecification } from 'maplibre-gl';

interface IOptions extends Record<string, any> {
	onInit: ( map: Map ) => any;
	onDeinit: ( map: Map ) => any;
};

interface IProps {
	name: string;
	source: string | SourceSpecification;
	type: string;
	options: Partial<IOptions>;
};

const emit = defineEmits( ['click'] );

const props = withDefaults( defineProps<Partial<IProps>>(), {
	type: 'circle',
	options: () => ({}),
} );

const map = inject<Ref<Map | null>>( 'mapInstance' );
const isLoading = ref( true );
const name = computed( () => props?.name ?? uuidv4() );
const source = computed( () => props?.source ?? '' );
const type = computed( () => props?.type ?? 'circle' );
const options = computed( () => props?.options ?? {} );
const layerName = ref<string>( '' );

// --- Гарантированное добавление слоя только если map.value — экземпляр Map ---
function addLayerIfMapReady() {
	if (!map?.value || !(map.value instanceof Map)) {
		return false;
	}
	if (map.value.getLayer(name.value)) {
		return false;
	}
	try {
		map.value.addLayer({
			'id': name.value,
			'type': type.value,
			'source': source.value as string,
		});
		layerName.value = name.value;
		addEvents();
		isLoading.value = false;
		return true;
	} catch (e) {
		console.error('Failed to add layer:', e);
		return false;
	}
}

onMounted( () => {
	watchEffect( () => {
		if (map?.value instanceof Map) {
			addLayerIfMapReady();
		}
	} );
} );

onBeforeUnmount( () => {
	try {
		if (map?.value instanceof Map && map.value.getLayer(name.value)) {
			map.value.removeLayer(name.value);
			map.value.off('click', name.value, onClick);
		}
	} catch (e) {
		console.error('Failed to remove layer:', e);
	}
} );

function onClick( e: unknown ) {
	emit( 'click', e );
}

function addEvents() {
	if (map?.value instanceof Map) {
		map.value.on('click', name.value, onClick);
	}
}

function removeEvents() {
	if (map?.value instanceof Map) {
		map.value.off('click', name.value, onClick);
	}
}

provide( 'layerName', layerName );
</script>

<style lang="scss" scoped>
</style>
