<template></template>

<script lang="ts" setup>
import { type Ref, inject, onMounted, watchEffect, onBeforeUnmount, watch, computed } from 'vue';
import { Map, GeoJSONSource } from 'maplibre-gl';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  // Координаты
  latitude: number;
  longitude: number;
  
  // Иконка
  iconImage?: string;           // ID иконки из спрайта
  iconSize?: number;            // Размер иконки
  iconColor?: string;           // Цвет иконки (для SDF)
  iconOpacity?: number;         // Прозрачность иконки
  iconRotate?: number;          // Поворот иконки в градусах
  iconHaloColor?: string;       // Цвет ореола иконки
  iconHaloWidth?: number;       // Ширина ореола иконки
  iconHaloBlur?: number;        // Размытие ореола иконки
  iconOffset?: [number, number]; // Смещение иконки [x, y]
  iconAnchor?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  // Текст
  textField?: string;           // Текст для отображения
  textSize?: number;            // Размер текста
  textColor?: string;           // Цвет текста
  textOpacity?: number;         // Прозрачность текста
  textHaloColor?: string;       // Цвет ореола текста
  textHaloWidth?: number;       // Ширина ореола текста
  textHaloBlur?: number;        // Размытие ореола текста
  textFont?: string[];          // Шрифт текста
  textOffset?: [number, number]; // Смещение текста [x, y]
  textAnchor?: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  textRotate?: number;          // Поворот текста
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  
  // Общие параметры
  zOffset?: number;             // Подъем над землей (в метрах)
  priority?: number;            // Приоритет отрисовки (чем выше, тем важнее)
  allowOverlap?: boolean;       // Разрешить перекрытие
  ignorePlacement?: boolean;    // Игнорировать размещение других символов
  optional?: boolean;           // Опциональный символ (может быть пропущен)
}

const props = withDefaults(defineProps<Props>(), {
  // Иконка
  iconImage: 'marker-15',
  iconSize: 1,
  iconColor: undefined,
  iconOpacity: 1,
  iconRotate: 0,
  iconHaloColor: '#ffffff',
  iconHaloWidth: 0,
  iconHaloBlur: 0,
  iconOffset: () => [0, 0],
  iconAnchor: 'center',
  
  // Текст
  textField: '',
  textSize: 12,
  textColor: '#000000',
  textOpacity: 1,
  textHaloColor: '#ffffff',
  textHaloWidth: 1,
  textHaloBlur: 0,
  textFont: () => ['Open Sans Regular'],
  textOffset: () => [0, 1.5],
  textAnchor: 'top',
  textRotate: 0,
  textTransform: 'none',
  
  // Общие
  zOffset: 0,
  priority: 1,
  allowOverlap: false,
  ignorePlacement: false,
  optional: false
});

const map = inject<Ref<Map | null>>('mapInstance');
const layerId = `symbol-${uuidv4()}`;
const sourceId = `source-${uuidv4()}`;

async function update () {

	/*if (
		
		sprite?.value instanceof HTMLDivElement &&
		hasSlotContent.value
	
	) {

		if ( map?.value instanceof Map ) {

			map.value.hasImage( name.value ) && map.value.removeImage( name.value );

		}

	} else */

	console.log( 'UPDATE' );
	 
	if ( !!props.iconImage ) {

		if ( map?.value instanceof Map ) {

			console.log( 'props.iconImage = ', props.iconImage );

			map.value.hasImage( 'custom-image' ) && map.value.removeImage( 'custom-image' );

			const image = await map.value.loadImage( props.iconImage );

			console.log( 'image222 = ', image );
  
			map.value.addImage( 'custom-image', image.data );

		}

	}

}

// Функция создания или обновления слоя
const updateSymbolLayer = async () => {
  if (!map?.value) return;

  const mapInstance = map.value;

  // 1. GeoJSON источник с точкой
  const geojsonData = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [props.longitude, props.latitude]
        },
        properties: {
          // Можно добавить любые свойства для выражений
          priority: props.priority,
          description: props.textField,
          iconId: props.iconImage
        }
      }
    ]
  };

  // Обновляем или создаем источник
  if (!mapInstance.getSource(sourceId)) {
    mapInstance.addSource(sourceId, {
      type: 'geojson',
      data: geojsonData
    });
  } else {
    (mapInstance.getSource(sourceId) as GeoJSONSource).setData(geojsonData);
  }

  // 2. Параметры layout
  const layout: any = {
    // Иконка
    // 'icon-image': props.iconImage,
    'icon-image': 'custom-image',
    'icon-size': props.iconSize,
    'icon-rotate': props.iconRotate,
    'icon-anchor': props.iconAnchor,
    'icon-offset': props.iconOffset,
    'icon-allow-overlap': props.allowOverlap,
    'icon-ignore-placement': props.ignorePlacement,
    'icon-optional': props.optional,

	'icon-pitch-alignment': 'map',
	'icon-rotation-alignment': 'map',
    
    // Текст (если есть)
    'text-field': props.textField || '',
    'text-size': props.textSize,
    'text-font': props.textFont,
    'text-anchor': props.textAnchor,
    'text-offset': props.textOffset,
    'text-rotate': props.textRotate,
    'text-transform': props.textTransform,
    'text-allow-overlap': props.allowOverlap,
    'text-ignore-placement': props.ignorePlacement,
    'text-optional': props.optional
  };

  // 3. Параметры paint
  const paint: any = {
    // Иконка
    'icon-opacity': props.iconOpacity,
    'icon-halo-color': props.iconHaloColor,
    'icon-halo-width': props.iconHaloWidth,
    'icon-halo-blur': props.iconHaloBlur,
    
    // Текст
    'text-color': props.textColor,
    'text-opacity': props.textOpacity,
    'text-halo-color': props.textHaloColor,
    'text-halo-width': props.textHaloWidth,
    'text-halo-blur': props.textHaloBlur
  };

  // Цвет иконки (только для SDF иконок)
  if (props.iconColor) {
    paint['icon-color'] = props.iconColor;
  }

  // 3D подъем
  if (props.zOffset) {
    layout['symbol-z-elevate'] = true;
    paint['icon-translate'] = [0, 0, props.zOffset];
    paint['text-translate'] = [0, 0, props.zOffset];
  }

  // Удаляем старый слой если есть и создаем новый
  if (mapInstance.getLayer(layerId)) {
    mapInstance.removeLayer(layerId);
  }

  mapInstance.addLayer({
    id: layerId,
    type: 'symbol',
    source: sourceId,
    layout: layout,
    paint: paint
  });
};

// Жизненный цикл
onMounted(() => {

	watchEffect( () => {

		if (map?.value instanceof Map ) {

			update();

		}

		if (map?.value instanceof Map && !map.value.getSource(sourceId) && map.value.getImage( 'custom-image' )) {
		
			if (map.value.loaded()) {
			
				updateSymbolLayer();

			} else {
		
				map.value.once('load', updateSymbolLayer);
		
			}
	
		}

	} );

});

onBeforeUnmount(() => {
  if (map?.value) {
    if (map.value.getLayer(layerId)) {
      map.value.removeLayer(layerId);
    }
    if (map.value.getSource(sourceId)) {
      map.value.removeSource(sourceId);
    }
  }
});

// Следим за изменениями всех пропсов
watch([
  () => props.latitude,
  () => props.longitude,
  () => props.iconImage,
  () => props.iconSize,
  () => props.iconColor,
  () => props.iconOpacity,
  () => props.iconRotate,
  () => props.iconHaloColor,
  () => props.iconHaloWidth,
  () => props.iconHaloBlur,
  () => props.iconOffset,
  () => props.iconAnchor,
  () => props.textField,
  () => props.textSize,
  () => props.textColor,
  () => props.textOpacity,
  () => props.textHaloColor,
  () => props.textHaloWidth,
  () => props.textHaloBlur,
  () => props.textFont,
  () => props.textOffset,
  () => props.textAnchor,
  () => props.textRotate,
  () => props.textTransform,
  () => props.zOffset,
  () => props.allowOverlap,
  () => props.ignorePlacement,
  () => props.optional
], () => {
  updateSymbolLayer();
}, { deep: true });
</script>