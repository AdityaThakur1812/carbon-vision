import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  theme: {
    extend: {},
  },
})
