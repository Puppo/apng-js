import { readFileSync } from 'fs';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const babelConfig = {
  babelHelpers: 'bundled',
  presets: [['@babel/preset-env', { targets: '> 0.5%, last 2 versions, not dead' }]],
  plugins: ['@babel/plugin-transform-class-properties'],
};

const libraryPlugins = [
  resolve({ browser: true, preferBuiltins: false }),
  commonjs(),
  babel(babelConfig),
];

export default [
  // Library – CommonJS (Node / legacy bundlers)
  {
    input: 'src/library/parser.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    plugins: libraryPlugins,
  },
  // Library – ESM (modern bundlers / native ESM)
  {
    input: 'src/library/parser.js',
    output: {
      file: pkg.module,
      format: 'esm',
    },
    plugins: libraryPlugins,
  },
  // Library – UMD (browser <script> tag / AMD / CommonJS fallback)
  {
    input: 'src/library/parser.js',
    output: {
      file: 'lib/index.umd.js',
      format: 'umd',
      name: 'apngJS',
      exports: 'named',
    },
    plugins: libraryPlugins,
  },
  // Demo page – IIFE bundle for GitHub Pages (docs/)
  {
    input: 'src/demo-page/index.js',
    output: {
      file: 'docs/index.js',
      format: 'iife',
    },
    plugins: [
      ...libraryPlugins,
      postcss({ inject: true }),
    ],
  },
];
