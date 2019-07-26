const pkg = require('./package.json');

export default [{
  input: 'src/index.js',
  output: {
    file: pkg.main,
    format: 'cjs',
    sourcemap: true,
  },
  external: ['fs', 'util'],
}];
