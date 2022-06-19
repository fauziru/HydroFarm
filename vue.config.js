module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  productionSourceMap: false,
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production'
}
