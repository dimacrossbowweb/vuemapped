import { type App, defineAsyncComponent } from 'vue';

// ── Core ─────────────────────────────────────────────────────────────────────
export { default as Map          } from './components/Map.vue';
export { default as MapCamera    } from './components/MapCamera.vue';
export { default as MapGroup     } from './components/MapGroup.vue';
export { default as MapImage     } from './components/MapImage.vue';
export { default as MapPopup     } from './components/MapPopup.vue';
export { default as MapSource    } from './components/MapSource.vue';
export { default as MapSprite    } from './components/MapSprite.vue';

// ── Draw ─────────────────────────────────────────────────────────────────────
export { default as DrawCircle   } from './components/Draw/Circle.vue';
export { default as DrawLine     } from './components/Draw/Line.vue';
export { default as DrawMarker   } from './components/Draw/Marker.vue';
export { default as DrawPolygon  } from './components/Draw/Polygon.vue';
export { default as DrawSprite   } from './components/Draw/Sprite.vue';

// Object3D components use @deck.gl/* (optional peer deps) — lazy-load to avoid
// hard failure when deck.gl is not installed.
export const DrawObject3D  = defineAsyncComponent( () => import( './components/Draw/Object3D.vue' ) );
export const LayerObject3D = defineAsyncComponent( () => import( './components/Layer/Object3D.vue' ) );

// ── Layer ─────────────────────────────────────────────────────────────────────
export { default as LayerCircle   } from './components/Layer/Circle.vue';
export { default as LayerLine     } from './components/Layer/Line.vue';
export { default as LayerPolygon  } from './components/Layer/Polygon.vue';
export { default as LayerSprite   } from './components/Layer/Sprite.vue';

// ── Composables ───────────────────────────────────────────────────────────────
export { useFormat } from './composables/useFormat';
export { useBem    } from './composables/useBem';

// ── Plugin ────────────────────────────────────────────────────────────────────
import Map          from './components/Map.vue';
import MapCamera    from './components/MapCamera.vue';
import MapGroup     from './components/MapGroup.vue';
import MapImage     from './components/MapImage.vue';
import MapPopup     from './components/MapPopup.vue';
import MapSource    from './components/MapSource.vue';
import MapSprite    from './components/MapSprite.vue';

import DrawCircle   from './components/Draw/Circle.vue';
import DrawLine     from './components/Draw/Line.vue';
import DrawMarker   from './components/Draw/Marker.vue';
import DrawPolygon  from './components/Draw/Polygon.vue';
import DrawSprite   from './components/Draw/Sprite.vue';

import LayerCircle   from './components/Layer/Circle.vue';
import LayerLine     from './components/Layer/Line.vue';
import LayerPolygon  from './components/Layer/Polygon.vue';
import LayerSprite   from './components/Layer/Sprite.vue';

export const MapLayersPlugin = {

	install( app: App ) {

		app.component( 'Map',          Map          );
		app.component( 'MapCamera',    MapCamera    );
		app.component( 'MapGroup',     MapGroup     );
		app.component( 'MapImage',     MapImage     );
		app.component( 'MapPopup',     MapPopup     );
		app.component( 'MapSource',    MapSource    );
		app.component( 'MapSprite',    MapSprite    );

		app.component( 'DrawCircle',   DrawCircle   );
		app.component( 'DrawLine',     DrawLine     );
		app.component( 'DrawMarker',   DrawMarker   );
		app.component( 'DrawPolygon',  DrawPolygon  );
		app.component( 'DrawSprite',   DrawSprite   );

		// Lazy-loaded: deck.gl is an optional peer dependency
		app.component( 'DrawObject3D',  defineAsyncComponent( () => import( './components/Draw/Object3D.vue' ) ) );
		app.component( 'LayerObject3D', defineAsyncComponent( () => import( './components/Layer/Object3D.vue' ) ) );

		app.component( 'LayerCircle',   LayerCircle   );
		app.component( 'LayerLine',     LayerLine     );
		app.component( 'LayerPolygon',  LayerPolygon  );
		app.component( 'LayerSprite',   LayerSprite   );

	},

};

export default MapLayersPlugin;
