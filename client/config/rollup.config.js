import path from 'path';
import cleanup from 'rollup-plugin-cleanup';
import builtins from 'builtin-modules';

import pkg from '../package.json';

export default [
  {
    input: path.join(__dirname, 'src', 'webpack.config.js'),
    plugins: [cleanup()],
    external: [...Object.keys(pkg.devDependencies), ...builtins],
    output: {
      file: path.join(__dirname, 'dist', 'webpack.config.js'),
      format: 'cjs',
    },
  },
];
