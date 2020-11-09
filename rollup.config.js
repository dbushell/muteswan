import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
const pkg = require('./package.json');

const {NODE_ENV} = process.env;

const isDev = NODE_ENV === 'development';
const isProd = !isDev;

const namePrefix = pkg.name;
const nameSuffix = isDev ? '' : '.min';

const globals = {crypto: 'crypto'};
if (isDev) {
  globals.react = 'React';
  globals['react-dom'] = 'ReactDOM';
  globals.redux = 'Redux';
}

export default {
  input: 'src/components/index.jsx',
  output: {
    file: `public/assets/${namePrefix}${nameSuffix}.js`,
    format: 'module',
    globals
  },
  plugins: [
    isProd &&
      alias({
        entries: [
          {find: 'react', replacement: 'preact/compat'},
          {find: 'react-dom', replacement: 'preact/compat'}
        ]
      }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.npm_package_author_name': JSON.stringify(pkg.author.name),
      'process.env.npm_package_author_url': JSON.stringify(pkg.author.url),
      'process.env.npm_package_version': JSON.stringify(pkg.version)
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.json']
    }),
    commonjs(),
    babel({exclude: '**/node_modules/**', babelHelpers: 'runtime'}),
    isProd && terser()
  ]
};
