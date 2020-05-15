import path from 'path';
import merge from 'webpack-merge';

import loaders from './lib/loaders.config';
import optimization from './lib/optimization.config';
import output from './lib/output.config';
import plugins from './lib/plugins.config';
import resolve from './lib/resolve.config';

import isProduction from './isProduction';
import { project } from './project';

export default merge(
  isProduction
    ? {
        mode: 'production',
      }
    : {
        mode: 'development',
        devServer: {
          contentBase: path.join(project, 'dist'),
          compress: true,
          historyApiFallback: { index: '/' },
          proxy: {
            path: '/graphql',
            target: 'http://localhost',
            changeOrigin: true,
            changeHost: true,
          },
        },
        devtool: 'source-map',
      },
  loaders,
  optimization,
  output,
  plugins,
  resolve,
);
