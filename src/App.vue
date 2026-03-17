<template>

	<div class="doc">

		<Map
		
			:options="options"
			width="100vw"
			height="100vh"	
			
		>

			<!-- <MapSprite
			
				name="custom-marker"
				src="/arrow.png"

			/> -->

			<MapSource

				name="test"
				:options="{

					type: 'geojson',

					data: {
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[10, 30],
									[10, 20],
									[20, 10],
									[10, 30]
								]
							]
						},
						properties: {}
					}

				}"

			/>

			<MapCamera
			
				:zoom="zoom"
				:bearing="bearing"
				:pitch="pitch"
			
			/>

			<!-- <MapLayer type="line" source="test">

				<DrawCircle

					v-if="!switched"

					:color="color"
					:outline-color="colorStroke"
					:opacity="0.5"

				/>

				<DrawLine

					v-if="switched"

					:color="color"
					:outline-color="colorStroke"
					:opacity="0.5"

				/>

			</MapLayer> -->

			<MapGroup>

				<DrawCircle
				
					:lat="lat"
					:lng="lng"

					:radius="radius"
					:color="color"
				
				/>
				
				<DrawCircle

					v-if="switched"
				
					:lat="lng"
					:lng="lat"

					:radius="radius"
					:color="color"
				
				/>

				<DrawCircle
				
					:lat="lng"
					:lng="lng"

					:radius="radius"
					:color="color"
				
				/>

    			<DrawSprite
				
					:latitude="lat"
					:longitude="lng"
					iconImage="/arrow.png"
					:iconSize="1.5"
					iconColor="#ff0000"
					textField="Центр"
					textColor="#000000"
					:textSize="14"
				
				/>

			</MapGroup>

			<MapGroup disabled>

				<!-- <MapPopup
				
					v-model="popup"

					:lat="lat"
					:lng="lng"

					:options="{

						closeButton: false,
						closeOnClick: false,
						anchor: 'bottom',
						maxWidth: '280px'						

					}"
				
				>

					<div class="panel">

						HELLO WORLD

					</div>

				</MapPopup> -->

			</MapGroup>

		</Map>

		<div style="position: fixed; top: 15px; left: 15px; color: white;">

			{{ switched }}

			<input v-model="switched" type="checkbox" /><br/><br/>

			<input v-model="lat" type="range" :min="-90" :max="90" /><br/><br/>
			<input v-model="lng" type="range" :min="-180" :max="180" /><br/><br/>
			<input v-model="color" type="color" :min="-180" :max="180" /><br/><br/>
			<input v-model="radius" type="range" :min="1" :max="60" /><br/><br/>

		</div>

	</div>

</template>

<script setup>
import { compile, onMounted, ref } from 'vue';
import Map from './components/Map.vue';
import MapLayer from './components/MapLayer.vue';
import MapSource from './components/MapSource.vue';
import MapCamera from './components/MapCamera.vue';
import MapMarker from './components/MapMarker/index.vue';
import MapGroup from './components/MapGroup.vue';
import MapPopup from './components/MapPopup.vue';
import MapSprite from './components/MapSprite.vue';
import DrawCircle from './components/Draw/Circle.vue';
import DrawSprite from './components/Draw/Sprite.vue';
import DrawObject3D from './components/Draw/Object3D.vue';
import DrawLine from './components/Draw/Line.vue';
import DrawPolygon from './components/Draw/Polygon.vue';

const options = ref( {

	zoom: 2,
	center: [ 0, 1 ],
	pitch: 0,
	bearing: 0,

} );

const val = ref( '' );

const zoom = ref( 2 );
const bearing = ref( 2 );
const pitch = ref( 2 );

const lng = ref( 30 );
const lat = ref( 30 );

const angle = ref(0);

const popup = ref( true );

const color = ref('#ffffff');

const colorStroke = ref( '#ffffff' );

const radius = ref( 10 );

const switched = ref(false);

function onMarkerClick() {

	console.log( 'Нажали на маркер' );

}

function onConfirm() {

	alert( 'On Confirm' );

}

// onMounted( () => {

// 	setInterval( () => {

// 		if ( lng.value + 0.01 < 180 ) {

// 			lng.value ++;

// 		} else {

// 			lng.value = -180;

// 		}

// 	}, 10 );

// } );

</script>

<style lang="scss" scoped>
.doc {

	width: 100dvw;
	height: 100dvh;

}

.arrow {

	filter: drop-shadow( 2px 0 15px #000 );
	height: 142px;

	cursor: pointer;

	transform: rotate(90deg);

	transition: all .3s;

	filter: hue-rotate(0.3turn);

	&:hover {

		transform: rotate( 180deg );

	}
	
}

.panel {

	display: flex;
	flex-direction: column;
	gap: 8px;

	width: 300px;
	height: 500px;

	background-image: url( https://i.pinimg.com/736x/b1/aa/f1/b1aaf1195e25b86cb56ee113d084dee2.jpg );
	background-size: cover;
	background-position: center;

	padding: 12px;

	background-color: #ffffff;

	border-radius: 12px;

	box-shadow: 2px 0 15px #000;

}

.row {

	width: 100%;

	border: 1px solid wh

}

.btn {

	display: inline-block;

	text-align: center;

	padding: 12px;
	background-color: lightgreen;
	color: white;

	font-family: Arial, Tahoma, sans-serif;

	cursor: pointer;

	box-sizing: border-box;

}

</style>
