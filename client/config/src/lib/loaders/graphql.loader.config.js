export default {
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
