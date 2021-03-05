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
const { NODE_ENV, APP_SDK_URL, APP_WIDGET_URL } = require('./env');

const banner = `/*!
 * Livetag JS SDK v${pkg.version}
 * ${process.env.APP_SDK_URL}
 *
 * Email: info@livetag.sg
 * WhatsApp: +65 8021 2045
 *
 * Copyright (c) ${copyrightYear()} Livetag Pte Ltd. All rights reserved.
 * Released under the ${pkg.license} license
 *
 * Date: ${buildDate()}
 */`;

const development = NODE_ENV === 'development';
const production = NODE_ENV === 'production';

const envVars = {
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'process.env.APP_WIDGET_URL': JSON.stringify(APP_WIDGET_URL),
  'process.env.APP_SDK_URL': JSON.stringify(APP_SDK_URL),
};

function copyrightYear() {
  return new Date().getUTCFullYear();
}

function buildDate() {
  let d = new Date();
  let year = d.getUTCFullYear();
  let month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  let day = d.getUTCDate().toString().padStart(2, '0');
  let hours = d.getUTCHours().toString().padStart(2, '0');
  let minutes = d.getUTCMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}Z`;
}

const config = {
  plugins: [
    replace({ ...envVars }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: development,
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
      sourcemap: development,
    },
  },
  {
    ...config,
    input: 'src/index.esm.js',
    output: {
      esModule: true,
      file: 'dist/livetag.esm.js',
      format: 'esm',
      sourcemap: development,
    },
  }
];
