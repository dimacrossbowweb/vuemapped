# vuemap

Vue 3 component library for [MapLibre GL JS](https://maplibre.org/). Declarative, reactive map layers with full TypeScript support.

## Installation

```bash
npm install vuemap maplibre-gl vue
```

For 3D objects (optional):
```bash
npm install @deck.gl/core @deck.gl/mapbox @deck.gl/mesh-layers
```

## Setup

### Global plugin

```ts
import { createApp } from 'vue';
import { MapLayersPlugin } from 'vuemap';
import 'vuemap/dist/vuemap.css';

createApp(App).use(MapLayersPlugin).mount('#app');
```

### Individual imports

```ts
import { Map, DrawCircle, LayerLine } from 'vuemap';
import 'vuemap/dist/vuemap.css';
```

---

## Components

### `<Map>`

The root component. Provides the MapLibre map instance to all child components via `inject`.

```vue
<template>
  <Map
    style="width: 100%; height: 500px"
    :center="[30.5, 50.4]"
    :zoom="10"
    map-style="https://demotiles.maplibre.org/style.json"
  />
</template>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mapStyle` | `string \| object` | — | MapLibre style URL or style object |
| `center` | `[number, number]` | `[0, 0]` | Initial center `[lng, lat]` |
| `zoom` | `number` | `0` | Initial zoom level |
| `bearing` | `number` | `0` | Initial bearing (degrees) |
| `pitch` | `number` | `0` | Initial pitch (degrees) |

---

### `<MapCamera>`

Animates the camera. Place inside `<Map>`.

```vue
<Map ...>
  <MapCamera :center="[30.5, 50.4]" :zoom="12" :duration="1000" />
</Map>
```

**Props**

| Prop | Type | Description |
|------|------|-------------|
| `center` | `[number, number]` | Target center `[lng, lat]` |
| `zoom` | `number` | Target zoom |
| `bearing` | `number` | Target bearing |
| `pitch` | `number` | Target pitch |
| `duration` | `number` | Animation duration in ms |

---

### `<MapSource>`

Registers a GeoJSON source. Required by `Layer*` components.

```vue
<Map ...>
  <MapSource id="cities" :data="citiesGeoJSON" />
</Map>
```

**Props**

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Source identifier |
| `data` | `GeoJSON \| string` | GeoJSON object or URL |

---

### `<MapImage>`

Loads and registers a raster image for use in symbol layers.

```vue
<Map ...>
  <MapImage id="pin" src="/icons/pin.png" />
</Map>
```

---

### `<MapSprite>`

Loads a sprite sheet into the map style.

---

### `<MapPopup>`

Renders a MapLibre popup with a Vue slot as content.

```vue
<Map ...>
  <MapPopup :lat="50.4" :lng="30.5" :value="showPopup">
    <div>Hello from Vue!</div>
  </MapPopup>
</Map>
```

**Props**

| Prop | Type | Description |
|------|------|-------------|
| `lat` | `number` | Latitude |
| `lng` | `number` | Longitude |
| `value` | `boolean` | Show/hide the popup |
| `closeButton` | `boolean` | Show close button |
| `closeOnClick` | `boolean` | Close on map click |
| `anchor` | `string` | Popup anchor position |
| `offset` | `number` | Pixel offset |

---

### `<MapGroup>`

Groups multiple components together (useful for toggling visibility).

---

## Draw Components

Draw components manage their own GeoJSON source and MapLibre layer internally. No `<MapSource>` required.

### `<DrawCircle>`

```vue
<Map ...>
  <DrawCircle
    :lat="50.4"
    :lng="30.5"
    :radius="12"
    color="royalblue"
    :opacity="0.8"
    :stroke-width="2"
    stroke-color="white"
    @click="onCircleClick"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  />
</Map>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lat` | `number \| string` | `0` | Latitude |
| `lng` | `number \| string` | `0` | Longitude |
| `radius` | `number \| number[]` | `5` | Circle radius in pixels (or MapLibre expression) |
| `color` | `string` | `'white'` | Fill color |
| `opacity` | `number \| string` | `1` | Fill opacity |
| `strokeWidth` | `number \| string` | `0` | Stroke width |
| `strokeColor` | `string` | `'white'` | Stroke color |
| `strokeOpacity` | `number \| string` | `1` | Stroke opacity |
| `blur` | `number \| string` | `0` | Blur amount |
| `translate` | `[x, y]` | `[0, 0]` | Pixel offset |
| `translateAnchor` | `'map' \| 'viewport'` | `'map'` | Translate reference frame |
| `pitchScale` | `'map' \| 'viewport'` | `'map'` | Scale with pitch |
| `pitchAlignment` | `'map' \| 'viewport'` | `'map'` | Align with pitch |

**Events:** `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`, `contextmenu`

---

### `<DrawLine>`

```vue
<Map ...>
  <DrawLine
    :geometry="[[30.5, 50.4], [30.6, 50.5], [30.7, 50.4]]"
    color="red"
    :width="3"
    :opacity="0.9"
    cap="round"
    join="round"
    @click="onLineClick"
  />
</Map>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `geometry` | `[number, number][]` | `[]` | Array of `[lng, lat]` coordinates |
| `color` | `string` | `'white'` | Line color |
| `opacity` | `number \| string` | `1` | Opacity |
| `width` | `number \| string` | `1` | Line width in pixels |
| `gapWidth` | `number \| string` | `0` | Gap between line casings |
| `offset` | `number \| string` | `0` | Line offset |
| `blur` | `number \| string` | `0` | Blur |
| `translate` | `[x, y]` | `[0, 0]` | Pixel offset |
| `translateAnchor` | `'map' \| 'viewport'` | `'map'` | Translate reference frame |
| `cap` | `'butt' \| 'round' \| 'square'` | `'butt'` | Line cap style |
| `join` | `'bevel' \| 'round' \| 'miter'` | `'miter'` | Line join style |

**Events:** `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`, `contextmenu`

---

### `<DrawPolygon>`

```vue
<Map ...>
  <DrawPolygon
    :geometry="[[[30.5, 50.4], [30.6, 50.4], [30.6, 50.5], [30.5, 50.5], [30.5, 50.4]]]"
    color="rgba(0, 128, 255, 0.4)"
    outline-color="blue"
    @click="onPolygonClick"
  />
</Map>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `geometry` | `[number, number][][]` | `[]` | Polygon rings (GeoJSON format) |
| `color` | `string` | `'white'` | Fill color |
| `opacity` | `number \| string` | `1` | Fill opacity |
| `outlineColor` | `string` | `'white'` | Outline color |
| `antialias` | `boolean` | `true` | Enable antialiasing |
| `translate` | `[x, y]` | `[0, 0]` | Pixel offset |
| `translateAnchor` | `'map' \| 'viewport'` | `'map'` | Translate reference frame |

**Events:** `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`, `contextmenu`

---

### `<DrawSprite>`

Renders an icon/symbol at a point. Supports image icons and text labels.

```vue
<Map ...>
  <DrawSprite
    :latitude="50.4"
    :longitude="30.5"
    icon-image="/icons/pin.png"
    :icon-size="1.2"
    text-field="My Place"
    :text-size="14"
    text-color="#333"
    @click="onSpriteClick"
  />
</Map>
```

**Props — Icon**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `latitude` | `number` | — | Latitude |
| `longitude` | `number` | — | Longitude |
| `iconImage` | `string` | — | Image URL |
| `iconSize` | `number` | `1` | Scale factor |
| `iconOpacity` | `number` | `1` | Opacity |
| `iconRotate` | `number` | `0` | Rotation in degrees |
| `iconAnchor` | `string` | `'center'` | Anchor position |
| `iconOffset` | `[number, number]` | `[0, 0]` | Pixel offset |
| `iconHaloColor` | `string` | `'#ffffff'` | Halo color |
| `iconHaloWidth` | `number` | `0` | Halo width |
| `iconHaloBlur` | `number` | `0` | Halo blur |
| `iconPitchAlignment` | `'map' \| 'viewport' \| 'auto'` | `'auto'` | Pitch alignment |
| `iconRotationAlignment` | `'map' \| 'viewport' \| 'auto'` | `'auto'` | Rotation alignment |

**Props — Text**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `textField` | `string` | `''` | Label text |
| `textSize` | `number` | `12` | Font size |
| `textColor` | `string` | `'#000000'` | Text color |
| `textOpacity` | `number` | `1` | Text opacity |
| `textFont` | `string[]` | `['Open Sans Regular']` | Font stack |
| `textAnchor` | `string` | `'top'` | Anchor position |
| `textOffset` | `[number, number]` | `[0, 1.5]` | Offset in ems |
| `textRotate` | `number` | `0` | Rotation in degrees |
| `textTransform` | `'none' \| 'uppercase' \| 'lowercase'` | `'none'` | Text transform |
| `textHaloColor` | `string` | `'#ffffff'` | Halo color |
| `textHaloWidth` | `number` | `1` | Halo width |
| `textHaloBlur` | `number` | `0` | Halo blur |

**Props — Placement**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allowOverlap` | `boolean` | `false` | Allow icon/text overlap |
| `ignorePlacement` | `boolean` | `false` | Ignore other symbols when placing |
| `optional` | `boolean` | `false` | Hide if collides |

**Events:** `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`, `contextmenu`

---

### `<DrawMarker>`

Renders a custom HTML element as a MapLibre marker. Content is provided via the default slot.

```vue
<Map ...>
  <DrawMarker :lat="50.4" :lng="30.5" @click="onMarkerClick">
    <div class="custom-marker">📍</div>
  </DrawMarker>
</Map>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lat` | `number \| string` | `0` | Latitude |
| `lng` | `number \| string` | `0` | Longitude |
| `width` | `number \| string` | `'auto'` | Element width |
| `height` | `number \| string` | `'auto'` | Element height |
| `disabled` | `boolean` | `false` | Disable pointer events |

**Events:** `click`

---

### `<DrawObject3D>`

Renders a glTF/GLB 3D model using deck.gl `ScenegraphLayer`. Requires `@deck.gl/core`, `@deck.gl/mapbox`, and `@deck.gl/mesh-layers`.

```vue
<Map ...>
  <DrawObject3D
    :lat="50.4"
    :lng="30.5"
    src="/models/building.glb"
    :size="50"
    color="#ff6600"
    :rotation="[0, 0, 45]"
    @click="onObjectClick"
  />
</Map>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lat` | `number \| string` | `0` | Latitude |
| `lng` | `number \| string` | `0` | Longitude |
| `altitude` | `number \| string` | `0` | Altitude in meters |
| `src` | `string` | — | URL to `.glb` / `.gltf` model |
| `size` | `number \| string` | `10000` | Scale factor |
| `color` | `string` | `'#ffffff'` | Model tint color |
| `rotation` | `[number, number, number]` | `[0, 0, 0]` | Rotation `[x, y, z]` in degrees |
| `opacity` | `number \| string` | `1` | Opacity |

**Events:** `click`, `mouseenter`, `mouseleave`, `mousemove`

---

## Layer Components

Layer components attach to an existing `<MapSource>` by its `id`. Use them when you have a data source with multiple features.

### `<LayerCircle>`

```vue
<Map ...>
  <MapSource id="points" :data="pointsGeoJSON" />
  <LayerCircle
    source="points"
    :radius="8"
    color="tomato"
    :opacity="0.9"
    @click="onFeatureClick"
  />
</Map>
```

**Props** — same paint props as `<DrawCircle>`, plus:

| Prop | Type | Description |
|------|------|-------------|
| `source` | `string` | Source ID from `<MapSource>` |
| `name` | `string` | Optional layer ID (auto-generated if omitted) |

**Events:** `click`

---

### `<LayerLine>`

```vue
<Map ...>
  <MapSource id="routes" :data="routesGeoJSON" />
  <LayerLine source="routes" color="blue" :width="2" @click="onRouteClick" />
</Map>
```

**Props** — same paint/layout props as `<DrawLine>`, plus `source` and `name`.

**Events:** `click`

---

### `<LayerPolygon>`

```vue
<Map ...>
  <MapSource id="zones" :data="zonesGeoJSON" />
  <LayerPolygon source="zones" color="rgba(0,200,100,0.3)" outline-color="green" @click="onZoneClick" />
</Map>
```

**Props** — same paint props as `<DrawPolygon>`, plus `source` and `name`.

**Events:** `click`

---

### `<LayerSprite>`

```vue
<Map ...>
  <MapSource id="pois" :data="poisGeoJSON" />
  <LayerSprite
    source="pois"
    icon-image="/icons/star.png"
    :icon-size="1"
    text-field="{name}"
    @click="onPoiClick"
  />
</Map>
```

**Props** — same icon/text props as `<DrawSprite>`, plus `source` and `name`. No `latitude`/`longitude` (geometry comes from the source).

**Events:** `click`

---

### `<LayerObject3D>`

```vue
<Map ...>
  <LayerObject3D
    :lat="50.4"
    :lng="30.5"
    src="/models/tower.glb"
    :size="100"
    @click="onObjectClick"
  />
</Map>
```

Same props and events as `<DrawObject3D>`.

---

## Full Example

```vue
<template>
  <Map
    style="width: 100%; height: 600px"
    map-style="https://demotiles.maplibre.org/style.json"
    :center="[30.5, 50.4]"
    :zoom="11"
  >
    <!-- Camera animation -->
    <MapCamera :center="camera.center" :zoom="camera.zoom" :duration="800" />

    <!-- HTML popup -->
    <MapPopup :lat="50.4" :lng="30.5" :value="showPopup">
      <strong>Kyiv</strong>
    </MapPopup>

    <!-- Standalone draw components -->
    <DrawCircle
      :lat="50.4"
      :lng="30.5"
      :radius="14"
      color="#3b82f6"
      :stroke-width="2"
      stroke-color="white"
      @click="showPopup = !showPopup"
    />

    <DrawLine
      :geometry="routeCoords"
      color="#ef4444"
      :width="4"
      cap="round"
      join="round"
    />

    <DrawPolygon
      :geometry="zoneCoords"
      color="rgba(16, 185, 129, 0.3)"
      outline-color="#10b981"
    />

    <DrawSprite
      :latitude="50.45"
      :longitude="30.52"
      icon-image="/icons/pin.png"
      text-field="Point of Interest"
      :text-size="13"
    />

    <!-- Layer components from a shared source -->
    <MapSource id="stations" :data="stationsGeoJSON" />
    <LayerCircle source="stations" :radius="6" color="orange" @click="onStation" />

  </Map>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Map, MapCamera, MapPopup, DrawCircle, DrawLine, DrawPolygon, DrawSprite, MapSource, LayerCircle } from 'vuemap';

const showPopup = ref(false);

const camera = ref({ center: [30.5, 50.4] as [number, number], zoom: 11 });

const routeCoords: [number, number][] = [
  [30.48, 50.38], [30.52, 50.40], [30.55, 50.42],
];

const zoneCoords: [number, number][][] = [[
  [30.45, 50.38], [30.58, 50.38], [30.58, 50.46], [30.45, 50.46], [30.45, 50.38],
]];

const stationsGeoJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [30.50, 50.41] }, properties: { name: 'Station A' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [30.53, 50.43] }, properties: { name: 'Station B' } },
  ],
};

function onStation(e: any) {
  console.log('Station clicked', e);
}
</script>
```

---

## Peer Dependencies

| Package | Version | Required |
|---------|---------|----------|
| `vue` | `^3.5` | Yes |
| `maplibre-gl` | `^5.0` | Yes |
| `@deck.gl/core` | `^9.0` | Only for `DrawObject3D` / `LayerObject3D` |
| `@deck.gl/mapbox` | `^9.0` | Only for `DrawObject3D` / `LayerObject3D` |
| `@deck.gl/mesh-layers` | `^9.0` | Only for `DrawObject3D` / `LayerObject3D` |

## License

MIT
