import multiInput from 'rollup-plugin-multi-input';
	
export default {
	input: ['src/**/*.js'],
	output: {
		dir: 'dist',
		format: 'cjs'
	},
	plugins: [ multiInput() ]
}