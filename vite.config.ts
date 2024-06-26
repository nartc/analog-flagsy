/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	publicDir: 'src/assets',
	build: {
		target: ['es2020'],
	},
	resolve: {
		mainFields: ['module'],
	},
	plugins: [
		analog({
			ssr: false,
			nitro: {
				plugins: ['./plugins/graceful-shutdown.plugin.ts'],
			},
			vite: {
				experimental: { supportAnalogFormat: true },
			},
		}),
	],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['src/test.ts'],
		include: ['**/*.spec.ts'],
		reporters: ['default'],
	},
	define: {
		'import.meta.vitest': mode !== 'production',
	},
}));
