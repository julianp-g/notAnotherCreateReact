const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
    entry: path.join(__dirname, 'src_2/index.js'),
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
              test: /\.s(a|c)ss$/,
              exclude: /\.module.(s(a|c)ss)$/,
              loader: [
                isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: isDevelopment
                  }
                }
              ]
            },
            {
              test: /\.(woff|ttf|eot|png|svg|jpg|gif|cur)$/,
              use: [
                'file-loader',
              ],
            },
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist_2')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist_2'),
        port: 7070,
    }
}
