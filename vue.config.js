const path = require('path')
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  productionSourceMap: false,
  configureWebpack : {
    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production'
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  }
}
