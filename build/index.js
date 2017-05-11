const babel = require('rollup-plugin-babel');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const pMap = require('p-map');
const rollup = require('rollup');
const uglify = require('uglify-js');

// prettier-ignore
const banner =
  '/*!\n' +
  ' * observable-fetch.js v' + pkg.version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Robin van der Vleuten <robin@webstronauts.co>\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const buildEntry = config => {
  const isMinified = /min\.js$/.test(config.dest);

  return rollup.rollup(config).then(bundle => {
    let code = bundle.generate(config).code;

    if (isMinified) {
      code = uglify.minify(code).code;
    }

    return writeEntry(config.dest, code);
  });
};

const writeEntry = (dest, code) =>
  new Promise((resolve, reject) => {
    fs.writeFile(dest, code, err => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });

const plugins = [
  babel({
    presets: [['env', { modules: false }]],
    plugins: ['transform-object-rest-spread'],
    exclude: 'node_modules/**',
    babelrc: false,
  }),
];

const external = ['rxjs/Observable', 'rxjs/add/observable/fromPromise'];

const builds = [
  {
    entry: path.join(process.cwd(), 'src/index.js'),
    dest: path.join(process.cwd(), `dist/${pkg.name}.js`),
    format: 'cjs',
  },
  {
    entry: path.join(process.cwd(), 'src/index.js'),
    dest: path.join(process.cwd(), `dist/${pkg.name}.min.js`),
    format: 'cjs',
  },
  {
    entry: path.join(process.cwd(), 'src/index.js'),
    dest: path.join(process.cwd(), `dist/${pkg.name}.esm.js`),
    format: 'es',
  },
];

pMap(builds, config =>
  buildEntry(
    Object.assign({}, config, {
      banner,
      plugins,
      external,
    })
  )
);
