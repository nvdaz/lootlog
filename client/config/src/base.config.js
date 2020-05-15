import merge from 'webpack-merge';

import loaders from './lib/loaders.config';
import optimization from './lib/optimization.config';
import output from './lib/output.config';
import plugins from './lib/plugins.config';
import resolve from './lib/resolve.config';

export default merge(loaders, optimization, output, plugins, resolve);
