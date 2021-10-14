import multiInput from 'rollup-plugin-multi-input'
	
export default {
	input: ['src/**/*.mjs'],
	output: {
		dir: 'dist',
		format: 'cjs',
		chunkFileNames: '[name]-[hash].cjs',
		entryFileNames: '[name].cjs'
	},
	plugins:[multiInput()]
}