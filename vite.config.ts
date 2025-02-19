import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
    // build: {
    //   chunkSizeWarningLimit: 100,
    //   rollupOptions: {
    //     onwarn(warning, warn) {
    //       if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
    //         return;
    //       }
    //       warn(warning);
    //     },
    //   },
    // },
})
