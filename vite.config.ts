import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://10.29.234.132:8080",
                changeOrigin: true,
            }
        }
    },
    define: {
        SOCKET_URL: JSON.stringify('ws://martina.rrricardo.top/api/')
    },
})
