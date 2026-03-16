import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // This tells React: "If it starts with /api, go to the C# server at port 5010"
            '/api': {
                target: 'http://localhost:5010',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})