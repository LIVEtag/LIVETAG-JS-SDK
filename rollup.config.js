import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import license from 'rollup-plugin-license';
import pkg from './package.json';

const banner =
  `/**
 * ${pkg.description}
 * v${pkg.version}
 * License: ${pkg.license} 
 */
`;

const env = process.env.NODE_ENV || 'development';

const config = {
  input: 'src/main.ts',
  output: {
    name: 'Livetag',
    esModule: false,
    exports: 'named',
    file: `dist/livetag${env === 'production' ? '.min' : ''}.js`,
    format: 'umd',
    sourcemap: env === 'development',
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(...[
    terser(),
    license({ banner }),
  ]);
}

export default config;
