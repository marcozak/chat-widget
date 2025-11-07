import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  base: './',
  define: {
    'process.env': {}
  },  
  plugins: [
    vue(),
    // Rimuovo cssInjectedByJsPlugin perché ora gestiamo il CSS nel Shadow DOM
    copy({
      targets: [
        { src: 'public/images/*', dest: 'dist/images' },
        { src: 'src/assets/fonts/*', dest: 'dist/fonts' } // Aggiungo i font
      ],
      hook: 'writeBundle'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'ChatWidget',
      fileName: () => `chat-widget.js`,
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
