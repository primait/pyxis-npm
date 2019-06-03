const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const devMode =  argv.mode !== 'production'
    console.log('devMode?', devMode)
    let conf = {

        context: path.resolve(__dirname, 'src'),

        entry: {
            pyxis: './pyxis.js'
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.[hash].js'
        },

        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, 'src', 'scss')],
                    use: [
                        {loader: MiniCssExtractPlugin.loader},
                        {loader: 'css-loader'},
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                                sourceMap: false,
                                indentedSyntax: false
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    use: ['html-loader']
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.(ttf|eot|svg|woff(2)?|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader',
                    exclude: /src\/assets\/media/,
                    options: {name: '[name].[ext]', outputPath: 'assets/fonts/'}
                },
                {
                    test: /\.(jpg|svg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader',
                    exclude: /src\/assets\/fonts/,
                    options: {name: '[name].[ext]', outputPath: 'assets/media/'}
                }
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({filename: '[name].css'}),
        ],
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: false,
            port: 8080
        }
    }

    if (devMode) {
        conf = Object.assign(conf, {devtool: 'inline-source-map'})
    }

    return conf
}
