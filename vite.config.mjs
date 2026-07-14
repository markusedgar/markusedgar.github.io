import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { projects } from "./src/content.js";

const staticRoutes = [
  "/work",
  "/lab",
  "/about",
  ...projects.map((project) => `/work/${project.slug}`),
];

function staticRouteCopies() {
  return {
    name: "static-route-copies",
    apply: "build",
    async closeBundle() {
      const html = await readFile("dist/index.html", "utf8");
      for (const route of staticRoutes) {
        const directory = `dist${route}`;
        await mkdir(directory, { recursive: true });
        await writeFile(`${directory}/index.html`, html);
      }
      await writeFile("dist/404.html", html);
    },
  };
}

export default defineConfig({
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  build: {
    target: "es2022",
  },
  plugins: [react(), staticRouteCopies()],
});
