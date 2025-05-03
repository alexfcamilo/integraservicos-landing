/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Escaneia todos os arquivos .js, .jsx, .ts, .tsx na pasta src
  ],
  theme: {
    extend: {
      colors: {
        'blue-900': '#1F3A95', // Azul escuro do app
        'teal-500': '#14B8A6', // Teal do app
      },
    },
  },
  plugins: [],
}