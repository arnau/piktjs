import nodePolyfills from "rollup-plugin-polyfill-node"
import { nodeResolve } from "@rollup/plugin-node-resolve"
// import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.js",
  output: {
    name: "pikt",
    file: "index.js",
    format: "iife",
    globals: ["path", "fs"],
    // plugins: [terser()],
  },
  preserveSymlinks: true,
  plugins: [
    nodePolyfills({
      include: ["path", "fs"]
    }),
    nodeResolve({
      browser: true,
    }),
  ],
}
