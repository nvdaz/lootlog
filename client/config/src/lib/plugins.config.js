import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';
import DotenvPlugin from 'webpack-dotenv-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import FaviconsPlugin from 'favicons-webpack-plugin';
import AssetManifestPlugin from 'webpack-assets-manifest';
import DashboardPlugin from 'webpack-dashboard/plugin';
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin';

import isProduction from '../isProduction';
import { project, config } from '../project';

export default {
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
    new CleanPlugin(),
    new AssetManifestPlugin({
      output: 'asset-manifest.json',
      usePathBasedKeys: true,
    }),
    new DashboardPlugin(),
  ],
};
