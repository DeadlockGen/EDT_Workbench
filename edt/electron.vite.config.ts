import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main.ts')
        }
      },
      outDir: 'out/main'
    },
    resolve: {
      alias: {
        '@shared': resolve('shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload.ts')
        }
      },
      outDir: 'out/preload'
    },
    resolve: {
      alias: {
        '@shared': resolve('shared')
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/index.html')
        }
      },
      outDir: 'out/renderer'
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@shared': resolve('shared')
      }
    },
    plugins: [react()]
  }
})
