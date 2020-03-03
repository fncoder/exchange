const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const generateHtmlPlugins = templateDir =>{
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      excludeAssets: [/html.*.js/, /css.*.js/],
      inject: true,
      cache: true
    })
  })
}

const htmlPlugins = generateHtmlPlugins('../src/views')

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    html: './index.js',
    css: './sass/index.js',
    bundle: './modules/index.js'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  module: {
      rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          },
        ]
      },
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use:[
          {
            loader: 'file-loader',
            options:{
              name: '[name].[ext]',
              outputPath: 'assets/img',
              emitFalse: false
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader',
            options:{
              removeScriptTypeAttributes: true
            }
          },
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/global.min.css'
    }),
    ...htmlPlugins,
    new HtmlWebpackExcludeAssetsPlugin(),
    new CopyPlugin([
      {
        from: 'img',
        to: 'assets/img'
      },
      {
        from: 'fonts',
        to: 'assets/fonts'
      },
      {
        from: '*.html',
        to: './'
      },
  ]),
  new ImageminPlugin({
    test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 75,
          progressive: true
      })
    ],
    optipng: {
      optimizationLevel: 3
    },
    jpegtran: null,
    cacheFolder: path.resolve(__dirname, '../src/cache-img')
  }),
  new CleanWebpackPlugin({
    cleanAfterEveryBuildPatterns: [
      path.resolve(__dirname, '../dist/css.js'),
      path.resolve(__dirname, '../dist/html.js')
    ],
  })
  ]
};
