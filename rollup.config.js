const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

export default {
  entry: 'src/index.js',
  dest: pkg.main,
  format: 'cjs',
  plugins: [
    babel({
      presets: [['env', { modules: false }]],
      plugins: ['transform-object-rest-spread'],
      exclude: 'node_modules/**',
      babelrc: false,
    }),
  ],
  external: [
    'rxjs/Observable',
    'rxjs/add/observable/fromPromise',
  ],
};
