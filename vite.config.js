import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: ["phaser"],
  },
  resolve: {
    alias: {
      phaser: "phaser/dist/phaser.js",
    },
  },
});
