const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: path.join(__dirname, 'src/index.js'),
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
          }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node\_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                }
            },
            {
                test: /\.css$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      hmr: process.env.NODE_ENV === 'development',
                    },
                  },
                  'css-loader',
                ],
              },
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 7070,
    }
}
