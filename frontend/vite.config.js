import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Use import, not require

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this as a plugin
  ],
});