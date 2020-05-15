export default {
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
