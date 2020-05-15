import path from 'path';

import { project } from '../project';

export default {
  output: {
    path: path.resolve(project, 'dist'),
    filename: 'bundle.[hash:8].js',
    chunkFilename: '[name].chunk.[hash:8].js',
    publicPath: '/',
  },
};
