import cleanup from "rollup-plugin-cleanup";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";

export default [
    {
        input: 'dist/esm/e2e/src/memory.main-thread.js',
        output: {
            dir: 'public_html/dist',
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
        input: 'dist/esm/e2e/src/memory.worker.js',
        output: {
            dir: 'public_html/dist',
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