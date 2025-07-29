/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ativar modo escuro via classe 'dark'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f9fafb', // claro, podes manter
        foreground: '#1e293b', // azul escuro/cinzento escuro

        darkBackground: '#121212', // preto quase puro para fundo escuro
        darkForeground: '#d1d5db', // cinzento claro para texto
        darkMuted: '#6b7280',      // cinzento médio
        accent: '#0ea5e9',         // azul da marca
      }
    }
  },
  plugins: [],
}
