import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		proxy: {
			'/api/': {
				target: '',
				changeOrigin: true,
				prependPath: true
			}
		}
	},
	resolve: {
		alias: {
			'system': new URL('./src/lib/core/', import.meta.url).pathname,
		}
	}
});
