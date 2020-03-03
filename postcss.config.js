module.exports = {
  plugins: {
    'autoprefixer': {},
    'cssnano': {},
    'postcss-preset-env': {},
    'postcss-discard-comments': {},
    'postcss-merge-longhand': {},
    'postcss-text-remove-gap': {},
    'postcss-combine-duplicated-selectors': {},
    'css-mqpacker': {},
    'postcss-uncss': {
      'html': ['./src/views/index.html'],
      'ignore': [new RegExp('.*\.no-.*')]
    },
    'postcss-assets': {
      'basePath': 'src',
      'loadPaths': ['img'],
      'relative': true
    }
    //'postcss-font-magician': {}
  }
}
