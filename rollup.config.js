const pkg = require('./package.json');

export default [{
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    },
  ],
  external: ['fs', 'util'],
}];
