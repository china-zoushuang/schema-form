import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = loadEnv(mode, "./");
  return {
    base: config.VITE_BASIC || "./",
    build: {
      outDir: "docs",
    },
    plugins: [
      vue(),
      new copy({
        targets: [
          {
            src: "src/workers/*",
            dest: "public/workers",
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/schemas": {
          target: "http://localhost:8001/",
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        `monaco-editor/esm/vs/language/json/json.worker`,
        `monaco-editor/esm/vs/editor/editor.worker`,
      ],
    },
  };
});
