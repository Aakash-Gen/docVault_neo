/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
				primaryColor: '#007ACC',
				primaryBackground: 'gray-900',
  			background: 'hsl(var(--background))',
				primaryBlack: '#0D111D',
				primaryGreen: '#27E8A7',
				primaryGray: '#3E3E42',
			}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

