import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import license from 'rollup-plugin-license';
import postcss from 'rollup-plugin-postcss';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

// Load environment variables from .env file
require('./env');

const banner = `/**
 * ${pkg.description}
 * Version: ${pkg.version}
 * License: ${pkg.license} 
 */
`;

const env = process.env.NODE_ENV || 'development';
const production = process.env.NODE_ENV === 'production';

const envVars = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.APP_WIDGET_URL': JSON.stringify(process.env.APP_WIDGET_URL),
};

const config = {
  plugins: [
    replace({ ...envVars }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: env === 'development',
      },
    }),
    postcss({
      inject: true,
      minimize: production,
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
    }),
    production && terser(),
    production && license({ banner }),
  ],
};

export default [
  {
    ...config,
    input: 'src/index.js',
    output: {
      esModule: false,
      preserveModules: false,
      exports: 'auto',
      file: 'dist/livetag.js',
      format: 'iife',
      sourcemap: !production,
    },
  },
  {
    ...config,
    input: 'src/index.esm.js',
    output: {
      esModule: true,
      file: 'dist/livetag.esm.js',
      format: 'esm',
      sourcemap: !production,
    },
  },
];
