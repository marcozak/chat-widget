import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import path from 'path'
import copy from 'rollup-plugin-copy'


export default defineConfig({
  base: './',
  define: {
    'process.env': {
      VITE_API_BASE_URL: JSON.stringify(process.env.VITE_API_BASE_URL)
    }
  },  
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    copy({
      targets: [
        { src: 'public/images/*', dest: 'dist/images' }
      ],
      // Il plugin esegue la copia al termine del bundle
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
