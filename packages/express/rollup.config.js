import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

import pkg from './package.json';

const plugins = [typescript(), nodeResolve({ modulesOnly: true }), commonjs(), json()];

export default {
    input: 'src/index.ts',
    output: [
        { file: pkg.main, format: 'cjs', exports: 'auto' },
        { file: pkg.module, format: 'es' },
        { file: pkg.browser, format: 'umd', name: 'sessionreplay' },
    ],
    plugins,
};
