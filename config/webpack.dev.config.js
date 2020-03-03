const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    })
  })
}

const htmlPlugins = generateHtmlPlugins('../src/views')

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: {
    bundle: './wds.js',
  },
  mode: 'development',
  output: {
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../src/views'),
    hot: true,
    compress: true,
    port: 3001
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, '../src/sass/global.scss')
        ],
        use: [
            'style-loader',
            'css-loader',
            'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      },
      {
       test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',

          },
        ],
      },
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, '../src/modules'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-formatter-pretty')
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: 'html-loader'
      }
    ]
  },
  plugins: [
    ...htmlPlugins
  ]
};
