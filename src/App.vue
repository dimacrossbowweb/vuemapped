<template>

	<div class="doc">

		<Map

			:options="options"
			width="100vw"
			height="100vh"

		>

			<DrawCircle
				@mouseenter="color = '#00ffff'"
				@mouseleave="color = '#ffffff'"
				:lat="70"
				:lng="80"
				:radius="30"
				:color="color"
			/>

			<!-- <LayerObject3D
				@click="color = '#00ffff'"
				@mouseenter="color = '#00ffff'"
				@mouseleave="color = '#ffffff'"
				:lat="70"
				:lng="80"
				src="https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf"
				:size="size"
				:rotation="[ 0, rotate, 90 ]"
				:color="color"
			/> -->

			<MapSource name="src-point" :options="{
				type: 'geojson',
				data: {
					type: 'Feature',
					geometry: { type: 'Point', coordinates: [ lng, lat ] },
					properties: {}
				}
			}" />

			<MapSource name="src-line" :options="{
				type: 'geojson',
				data: {
					type: 'Feature',
					geometry: { type: 'LineString', coordinates: [[ 0, 10 ],[ 20, 10 ],[ 15, 20 ]] },
					properties: {}
				}
			}" />

			<MapSource name="src-polygon" :options="{
				type: 'geojson',
				data: {
					type: 'Feature',
					geometry: { type: 'Polygon', coordinates: [[[ 0, 0 ],[ 20, 0 ],[ 20, 20 ],[ 0, 20 ],[ 0, 0 ]]] },
					properties: {}
				}
			}" />

			<MapCamera

				:zoom="zoom"
				:bearing="bearing"
				:pitch="pitch"

			/>

			<LayerCircle
				v-if="activeLayer === 'circle'"
				source="src-point"
				:color="color"
				:radius="20"
				:strokeWidth="2"
				strokeColor="#000000"
			/>

			<LayerLine
				v-if="activeLayer === 'line'"
				source="src-line"
				:color="color"
				:width="4"
				cap="round"
				join="round"
			/>

			<LayerPolygon
				v-if="activeLayer === 'polygon'"
				source="src-polygon"
				:color="color"
				:opacity="0.5"
				outlineColor="#ff0000"
			/>

			<LayerSprite
				v-if="activeLayer === 'sprite'"
				source="src-point"
				iconImage="/arrow.png"
				:iconSize="1.5"
				:iconOpacity="1"
				textField="Label"
				:textSize="14"
				textColor="#ffffff"
				:allowOverlap="true"
			/>

			<LayerObject3D
				v-if="activeLayer === 'object3d'"
				:lat="lat"
				:lng="lng"
				src="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Box/glTF-Binary/Box.glb"
				:size="size"
				:rotation="[ 45, rotate, 0 ]"
				:color="color"
			/>

		</Map>

		<div style="position: fixed; top: 15px; left: 15px; color: white; display: flex; flex-direction: column; gap: 8px;">

			<select v-model="activeLayer" style="padding: 4px 8px; font-size: 14px;">
				<option value="circle">Circle</option>
				<option value="line">Line</option>
				<option value="polygon">Polygon</option>
				<option value="sprite">Sprite</option>
				<option value="object3d">Object3D</option>
			</select>

			<label>lat: {{ lat }}</label>
			<input v-model="lat" type="range" :min="-90" :max="90" />

			<label>lng: {{ lng }}</label>
			<input v-model="lng" type="range" :min="-180" :max="180" />

			<label>color</label>
			<input v-model="color" type="color" />

			<label>rotate: {{ rotate }}</label>
			<input v-model="rotate" type="range" :min="0" :max="360" />

			<label>size: {{ size }}</label>
			<input v-model="size" type="range" :min="100" :max="50000" />

		</div>

	</div>

</template>

<script setup>
import { ref } from 'vue';
import Map from './components/Map.vue';
import MapSource from './components/MapSource.vue';
import MapCamera from './components/MapCamera.vue';
import DrawCircle from './components/Draw/Circle.vue';
import LayerCircle from './components/Layer/Circle.vue';
import LayerLine from './components/Layer/Line.vue';
import LayerPolygon from './components/Layer/Polygon.vue';
import LayerSprite from './components/Layer/Sprite.vue';
import LayerObject3D from './components/Layer/Object3D.vue';

const options = ref( {

	zoom: 2,
	center: [ 10, 10 ],
	pitch: 0,
	bearing: 0,

} );

const zoom    = ref( 2 );
const bearing = ref( 0 );
const pitch   = ref( 0 );

const lat   = ref( 10 );
const lng   = ref( 10 );
const color = ref( '#ffffff' );
const rotate = ref( 0 );
const size   = ref( 5000 );

const activeLayer = ref( 'circle' );

function onCircleClick () {

	alert( 'Нажали на кружочек' );

}

</script>

<style lang="scss" scoped>
.doc {

	width: 100dvw;
	height: 100dvh;

}
</style>
