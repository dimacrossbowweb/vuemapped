import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig( {

	plugins: [

		vue(),

		dts( {
			include: [ 'src/index.ts', 'src/components/**/*.vue', 'src/composables/**/*.ts' ],
			outDir: 'dist',
			insertTypesEntry: true,
		} ),

	],

	build: {

		lib: {

			entry: resolve( __dirname, 'src/index.ts' ),
			name: 'VueMap',
			formats: [ 'es', 'cjs' ],
			fileName: ( format ) => `vuemap.${ format }.js`,

		},

		rollupOptions: {

			external: [
				'vue',
				'maplibre-gl',
				'@deck.gl/core',
				'@deck.gl/layers',
				'@deck.gl/mapbox',
				'@deck.gl/mesh-layers',
				'deck.gl',
				'gsap',
				'three',
				'uuid',
			],

			output: {

				globals: {
					'vue':          'Vue',
					'maplibre-gl':  'maplibregl',
				},

				assetFileNames: ( assetInfo ) => {
					if ( assetInfo.name === 'style.css' ) return 'vuemap.css';
					return assetInfo.name ?? 'asset';
				},

			},

		},

		cssCodeSplit: false,
		sourcemap: true,

	},

} );
