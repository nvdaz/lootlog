import merge from 'webpack-merge';

import babel from './loaders/babel.loader.config';
import graphql from './loaders/graphql.loader.config';
import image from './loaders/image.loader.config';
import sass from './loaders/sass.loader.config';

export default merge(babel, graphql, image, sass);
