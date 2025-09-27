import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: 'public',
    server: {
        allowedHosts: true,
        proxy: {
            '/v1': {
                target: 'https://jenilb.botsetgo.com',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq, req) => {
                        proxyReq.setHeader('X-Original-Host', req.headers['host'])
                    })
                }
            },

            '/thumbnail': {
                target: 'https://kashish.botsetgo.com',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq, req) => {
                        proxyReq.setHeader('X-Original-Host', req.headers['host'])
                    })
                }
            }
        }
    }
})
