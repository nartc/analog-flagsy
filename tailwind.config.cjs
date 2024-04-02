/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{html,ts,md,analog}'],
	theme: {
		extend: {},
	},
	plugins: [require('./flagsy.config')],
};