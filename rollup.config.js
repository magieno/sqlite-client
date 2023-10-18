import cleanup from "rollup-plugin-cleanup";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: 'dist/esm/sqlite-client.js',
    output: {
      dir: 'dist/bundle',
      format: 'esm',
      exports: "auto",
      compact: true,
    },
    plugins: [
      json(),
      nodeResolve({
        preferBuiltins: true,
      }),
    ]
  },
  {
    input: 'dist/esm/sqlite-client-worker.js',
    output: {
      dir: 'dist/bundle',
      format: 'esm',
      exports: "auto",
      compact: true,
    },
    plugins: [
      json(),
      nodeResolve({
        preferBuiltins: true,
      }),
    ]
  }
]
// {
//   input: 'dist/cjs/server/src/lambda.js',
//   output: {
//     dir: 'dist/bundle/server/src',
//     format: 'cjs',
//     exports: "auto",
//     compact: true,
//   },
//   external: [],
//   plugins: [
//     typescript({
//       tsconfigOverride: {
//         exclude: ["infrastructure/local/src/**/*.ts"]
//       }
//
//     }),
//     nodeResolve({
//       preferBuiltins: true,
//     }),
//     commonjs({
//       transformMixedEsModules: true,
//     }),
//     json(),
//     cleanup({
//       "comments": "none",
//     }),
//   ]
// };
