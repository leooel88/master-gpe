/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./views/**/*.{html,handlebars}',
		'./modules/**/views/**/*.{html,handlebars}',
		'./node_modules/flowbite/**/*.js',
	],
	theme: {
		extend: {},
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
}
