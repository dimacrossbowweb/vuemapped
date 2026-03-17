import type { App } from 'vue';

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
export { default as DrawObject3D } from './components/Draw/Object3D.vue';
export { default as DrawPolygon  } from './components/Draw/Polygon.vue';
export { default as DrawSprite   } from './components/Draw/Sprite.vue';

// ── Layer ─────────────────────────────────────────────────────────────────────
export { default as LayerCircle   } from './components/Layer/Circle.vue';
export { default as LayerLine     } from './components/Layer/Line.vue';
export { default as LayerObject3D } from './components/Layer/Object3D.vue';
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
import DrawObject3D from './components/Draw/Object3D.vue';
import DrawPolygon  from './components/Draw/Polygon.vue';
import DrawSprite   from './components/Draw/Sprite.vue';

import LayerCircle   from './components/Layer/Circle.vue';
import LayerLine     from './components/Layer/Line.vue';
import LayerObject3D from './components/Layer/Object3D.vue';
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
		app.component( 'DrawObject3D', DrawObject3D );
		app.component( 'DrawPolygon',  DrawPolygon  );
		app.component( 'DrawSprite',   DrawSprite   );

		app.component( 'LayerCircle',   LayerCircle   );
		app.component( 'LayerLine',     LayerLine     );
		app.component( 'LayerObject3D', LayerObject3D );
		app.component( 'LayerPolygon',  LayerPolygon  );
		app.component( 'LayerSprite',   LayerSprite   );

	},

};

export default MapLayersPlugin;
