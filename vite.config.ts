import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://martina.rrricardo.top",
                changeOrigin: true,
            }
        }
    },
    define: {
        SOCKET_URL: JSON.stringify('ws://martina.rrricardo.top/api/airConditioner/ws/')
    },
})
