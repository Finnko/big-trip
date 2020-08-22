const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

const isProd = process.argv.indexOf(`-p`) !== -1;

module.exports = {
  mode: isProd ? `production` : `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: isProd ? `eval-source-map` : false,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    compress: true,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [`style-loader`, `css-loader`],
      },
    ],
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: [`en`],
    }),
  ],
};
