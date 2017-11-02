module.exports = {
  entry: "./app/main.js",
  output: {
    filename: "./app/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  watch: true
}
