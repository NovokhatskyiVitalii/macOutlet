const miniCss = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode: mode,
  entry: './js/app.js',
  output: {
    filename: 'app.js',
  },
  module: {
    rules: [{
      test: /\.(s*)css$/,
      use: [
        miniCss.loader,
        'css-loader',
        'sass-loader',
      ]
    }]
  },
  plugins: [
    new miniCss({
      filename: 'style.css',
    }),
  ]
};