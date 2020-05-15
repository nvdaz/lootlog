export default {
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
