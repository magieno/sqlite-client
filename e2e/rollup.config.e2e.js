import cleanup from "rollup-plugin-cleanup";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";

export default [
    {
        input: 'dist/esm/e2e/specs/memory-main-thread/memory.main-thread.js',
        output: {
            dir: 'public_html/scripts',
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