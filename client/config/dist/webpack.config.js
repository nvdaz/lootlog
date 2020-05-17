'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var merge = _interopDefault(require('webpack-merge'));
var TerserPlugin = _interopDefault(require('terser-webpack-plugin'));
var HtmlPlugin = _interopDefault(require('html-webpack-plugin'));
var DotenvPlugin = _interopDefault(require('webpack-dotenv-plugin'));
var CopyPlugin = _interopDefault(require('copy-webpack-plugin'));
var FaviconsPlugin = _interopDefault(require('favicons-webpack-plugin'));
var AssetManifestPlugin = _interopDefault(require('webpack-assets-manifest'));
var DashboardPlugin = _interopDefault(require('webpack-dashboard/plugin'));
var cleanWebpackPlugin = require('clean-webpack-plugin');
var yargs = _interopDefault(require('yargs'));

var babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        targets: '> 0.25%, not dead',
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      { pragma: 'h', pragmaFrag: 'React.Fragment' },
    ],
    ['@babel/plugin-proposal-export-default-from'],
    ['import-graphql'],
  ],
};

var babel = {
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
    ],
  },
};

var graphql = {
  module: {
    rules: [
      {
        test: /\.graphql?$/i,
        use: [
          {
            loader: 'webpack-graphql-loader',
            options: {
              removeUnusedFragments: true,
              minify: true,
              output: 'document',
            },
          },
        ],
      },
    ],
  },
};

var image = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        oneOf: [
          {
            resourceQuery: /webp/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name]-[hash:8].webp',
                },
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    enabled: false,
                  },
                  optipng: {
                    enabled: false,
                  },
                  pngquant: {
                    enabled: false,
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                  webp: {
                    enabled: true,
                    lossless: true,
                  },
                },
              },
            ],
          },
          {
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name]-[hash:8].[ext]',
                },
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    enabled: true,
                  },
                  optipng: {
                    enabled: true,
                  },
                  pngquant: {
                    enabled: true,
                  },
                  gifsicle: {
                    interlaced: true,
                  },
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash:8].svg',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                enabled: false,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                enabled: false,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                enabled: false,
              },
              svgo: {
                enabled: true,
                plugins: [
                  { removeViewBox: false },
                  { removeEmptyAttrs: false },
                ],
              },
            },
          },
        ],
      },
    ],
  },
};

var sass = {
  module: {
    rules: [
      {
        test: /\.scss$/i,
        oneOf: [
          {
            test: /\.module\.scss$/i,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localsConvention: 'camelCaseOnly',
                },
              },
              'sass-loader',
            ],
          },
          {
            use: ['style-loader', 'css-loader', 'sass-loader'],
            sideEffects: true,
          },
        ],
      },
    ],
  },
};

var loaders = merge(babel, graphql, image, sass);

var optimization = {
  optimization: {
    minimize: true,
    namedChunks: true,
    usedExports: true,
    sideEffects: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendor',
          enforce: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};

const project = path.join(__dirname, '..', '..');
const config = path.join(project, 'config');

var output = {
  output: {
    path: path.resolve(project, 'dist'),
    filename: 'bundle.[hash:8].js',
    chunkFilename: '[name].chunk.[hash:8].js',
    publicPath: '/',
  },
};

var isProduction = (yargs.argv.mode || 'production') === 'production';

var plugins = {
  plugins: [
    new HtmlPlugin({
      minify: true,
      title: 'Loot Log',
    }),
    new FaviconsPlugin({
      logo: path.join(project, 'src', 'assets', 'icon.png'),
      mode: 'webapp',
      cache: true,
      prefix: 'assets/',
      inject: true,
      favicons: {
        appName: 'Loot Log',
        appShortName: 'Loot Log',
      },
    }),
    new CopyPlugin([
      {
        context: path.join(project, 'src', 'assets'),
        from: './**',
        to: path.join(project, 'dist'),
      },
    ]),
    new DotenvPlugin({
      sample: path.join(config, '.env.sample'),
      path: path.join(config, isProduction ? '.env' : '.env.development'),
    }),
    new cleanWebpackPlugin.CleanWebpackPlugin(),
    new AssetManifestPlugin({
      output: 'asset-manifest.json',
      usePathBasedKeys: true,
    }),
    new DashboardPlugin(),
  ],
};

var resolve = {
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.graphql', '.png', '.svg'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
};

var webpack_config = merge(
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

module.exports = webpack_config;
