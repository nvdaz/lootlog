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
                loader: '@teamsupercell/typings-for-css-modules-loader',
                options: {
                  formatter: 'prettier',
                  eol: '\n',
                  verifyOnly: process.env.NODE_ENV === 'production',
                  disableLocalsExport: true,
                },
              },
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
