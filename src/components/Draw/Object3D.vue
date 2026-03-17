<template>
  <div></div>
</template>

<script lang="ts" setup>
import { type Ref, ref, onMounted, onBeforeUnmount, watch, inject } from 'vue';
import { Map } from 'maplibre-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import type { Color } from '@deck.gl/core';

interface Props {
  latitude: number;
  longitude: number;
  altitude?: number;
  size?: number;
  color?: [number, number, number, number]; // RGBA
  rotation?: [number, number, number];
  src?: string;
  opacity?: number;
}

const props = withDefaults(defineProps<Props>(), {
  altitude: 0,
  size: 10000, // Увеличил размер для лучшей видимости
  color: () => [0, 255, 140, 255] as [number, number, number, number], // Добавил alpha канал
  rotation: () => [0, 0, 0],
  src: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Box/glTF-Binary/Box.glb',
  opacity: 1
});

// Инжектим экземпляр карты из родительского компонента
const map = inject<Ref<Map | null>>('mapInstance');
const deckOverlay = ref<MapboxOverlay | null>(null);
const layerId = `cube-${Date.now()}`;

// Создаем слой с кубом
const createCubeLayer = () => {
  console.log('Creating layer with props:', props);
  
  return new ScenegraphLayer({
    id: layerId,
    data: [{
      position: [props.longitude, props.latitude, props.altitude],
      color: props.color,
      rotation: props.rotation
    }],
    scenegraph: props.src,
    getPosition: (d: any) => d.position,
    getColor: (d: any) => d.color,
    getOrientation: (d: any) => d.rotation,
    sizeScale: props.size,
    _lighting: 'pbr',
    opacity: props.opacity,
    
    // Важные параметры для отображения
    pickable: true,
    parameters: {
      depthTest: true,
      depthWrite: true
    },
    
    // Для отладки
    onError: (error: any) => {
      console.error('ScenegraphLayer error:', error);
    },
    
    onLoad: () => {
      console.log('Model loaded successfully');
      
      // Принудительно обновляем карту после загрузки модели
      if (map?.value) {
        map.value.triggerRepaint();
      }
    }
  });
};

// Инициализация deck.gl overlay
const initDeckOverlay = () => {
  if (!map?.value) {
    console.warn('Map not available');
    return;
  }

  // Убедимся, что карта загружена
  if (!map.value.loaded()) {
    console.log('Map not loaded yet, waiting...');
    map.value.once('load', () => {
      console.log('Map loaded, initializing overlay');
      initDeckOverlay();
    });
    return;
  }

  try {
    // Удаляем существующий overlay если есть
    if (deckOverlay.value) {
      map.value.removeControl(deckOverlay.value);
    }

    console.log('Creating MapboxOverlay');
    deckOverlay.value = new MapboxOverlay({
      layers: [createCubeLayer()],
      interleaved: true, // Важно для правильного наложения
      pickingRadius: 5,
      pickable: true,
      onHover: (info) => {
        if (info.object) {
          console.log('Hover over cube:', info.object);
        }
      },
      onClick: (info) => {
        if (info.object) {
          console.log('Clicked on cube:', info.object);
        }
      }
    });

    console.log('Adding overlay to map');
    map.value.addControl(deckOverlay.value);
    
    // Принудительно обновляем карту
    setTimeout(() => {
      map.value?.triggerRepaint();
    }, 100);
    
  } catch (error) {
    console.error('Error initializing deck overlay:', error);
  }
};

// Обновление слоя при изменении пропсов
const updateLayer = () => {
  if (!deckOverlay.value || !map?.value) return;
  
  console.log('Updating layer with new props:', props);
  deckOverlay.value.setProps({
    layers: [createCubeLayer()]
  });
  
  // Обновляем карту
  map.value.triggerRepaint();
};

// Жизненный цикл
onMounted(() => {
  console.log('Cube component mounted');
  if (map?.value) {
    initDeckOverlay();
  }
});

onBeforeUnmount(() => {
  console.log('Cube component unmounting');
  if (map?.value && deckOverlay.value) {
    try {
      map.value.removeControl(deckOverlay.value);
    } catch (error) {
      console.error('Error removing overlay:', error);
    }
  }
});

// Наблюдаем за изменениями пропсов
watch([
  () => props.latitude,
  () => props.longitude,
  () => props.altitude,
  () => props.size,
  () => props.color,
  () => props.rotation,
  () => props.src,
  () => props.opacity
], () => {
  console.log('Props changed, updating layer');
  updateLayer();
}, { deep: true });

// Следим за появлением карты
watch(map, (newMap) => {
  if (newMap && !deckOverlay.value) {
    console.log('Map became available, initializing overlay');
    initDeckOverlay();
  }
}, { immediate: true });
</script>