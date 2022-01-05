import { defineConfig } from 'vite'
import { resolve } from "path"
import vue from '@vitejs/plugin-vue'

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "/@": pathResolve("src")
    }
  },
  plugins: [vue()],
  server: {
    port: 3902,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/mock-api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      }
    }
  }
})
