import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['masumb.botsetgo.com'],
        port: 5153,
        open: true,
        proxy: {
            '/v1': {
                target: 'https://kashish.botsetgo.com',
                changeOrigin: true, // Ensures the origin is updated to the target's domain
                configure: (proxy) => {
                    // Customize the proxy configuration to add the original host
                    proxy.on('proxyReq', (proxyReq, req) => {
                        proxyReq.setHeader('X-Original-Host', req.headers['host'])
                    })
                }
            },
            '/shabad': {
                target: 'https://kashish.botsetgo.com',
                changeOrigin: true, // Ensures the origin is updated to the target's domain
                configure: (proxy) => {
                    // Customize the proxy configuration to add the original host
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
