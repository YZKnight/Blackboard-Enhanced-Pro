import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.jsx',
      userscript: {
        name: 'Blackboard 增强 Pro | Blackboard Enhanced Pro',
        version: '1.3.1',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://pibb.scu.edu.cn/*'],
        license: 'MIT',
          description: 'Blackboard 增强插件，For SCUPIANS',
          updateURL: 'http://pibb.mydev.icu/blackboard-enhancing-pro.user.js',
          downloadURL: 'http://pibb.mydev.icu/blackboard-enhancing-pro.user.js'
      },
      build: {
        externalGlobals: {
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
      },
    }),
  ],
});
