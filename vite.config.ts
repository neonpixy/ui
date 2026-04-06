import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
	plugins: [solid()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/lib/index.ts'),
			formats: ['es'],
			fileName: () => 'index.js',
		},
		outDir: 'dist',
		rollupOptions: {
			external: ['solid-js', 'solid-js/web', 'solid-js/store', '@omnidea/crystal'],
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src/lib',
			},
		},
	},
});
