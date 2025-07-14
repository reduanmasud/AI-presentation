import { defineConfig } from 'vite';

export default defineConfig({
  // Root directory for the project
  root: '.',
  
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    // Optimize for modern browsers
    target: 'es2015',
    minify: 'esbuild'
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true, // Allow external connections
    cors: true
  },
  
  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/base/variables";`
      }
    },
    devSourcemap: true
  },
  
  // Asset handling
  assetsInclude: ['**/*.md'],
  
  // Plugin configuration
  plugins: [],
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@styles': '/src/styles',
      '@components': '/src/components',
      '@data': '/src/data',
      '@utils': '/src/utils'
    }
  },
  
  // Optimization
  optimizeDeps: {
    include: []
  },
  
  // Preview server (for production build testing)
  preview: {
    port: 4173,
    open: true
  }
});
