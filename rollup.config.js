const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

export default {
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'cjs',
  plugins: [
    babel({
      presets: [['env', { modules: false }], 'stage-2'],
      exclude: 'node_modules/**',
      babelrc: false,
    }),
  ],
  external: [
    'rxjs/Observable',
    'rxjs/add/observable/fromPromise',
  ],
};
