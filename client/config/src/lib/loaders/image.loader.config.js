export default {
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
