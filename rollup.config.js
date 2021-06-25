import { createPlugins } from "rollup-plugin-atomic"

const plugins = createPlugins([["ts", { tsconfig: "./src/tsconfig.json" }, true], "js", "json"])

const RollupConfig = [
  {
    input: "src/main.ts",
    output: [
      {
        dir: "dist",
        format: "cjs",
        sourcemap: process.env.NODE_ENV === "production" ? true : "inline",
      },
    ],
    // loaded externally
    external: ["atom", "zadeh"],
    plugins,
  },
]
export default RollupConfig
