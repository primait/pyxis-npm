const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const stylelintOptions = {
    context: 'scss',
    emitError: true,
    emitWarning: true,
    failOnWarning: true,
    ignoreDisables: true,
    syntax: 'scss',

    'font-family-name-quotes': 'always-unless-keyword',
    'font-family-no-duplicate-names': 'true',
    'font-weight-notation': 'numeric',
    'function-calc-no-invalid': true,
    'function-calc-no-unspaced-operator': true,
    'function-comma-space-after': 'always',
    'function-name-case': 'lower',
    'function-url-quotes': 'always',
    'function-whitespace-after': 'always',
    'unit-no-unknown': true,
    'property-no-unknown': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-block-no-duplicate-properties': true,
    'block-no-empty': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'at-rule-no-unknown': true,
    'comment-no-empty': true,
    'no-descending-specificity': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,
    'shorthand-property-no-redundant-values': true,
    'value-no-vendor-prefix': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-no-important': true,
    'selector-max-combinators': 2,
    'selector-max-compound-selectors': 2,
    'selector-max-id': 0,
    'selector-max-specificity': '0,2,0',
    'selector-max-type': 1,
    'selector-no-qualifying-type': true,
    'max-nesting-depth': 2,
    'no-unknown-animations': true,
    'length-zero-no-unit': true,
    'unit-case': 'lower',



}

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production'
    const testPlugin = 
        ['accordions', 
         'buttons',
         'containers',
        ].map(template => {
            return new HtmlWebpackPlugin({ 
                filename: `test/${template}.html`, 
                template: `test/${template}.html` 
            })
        })

    let conf = {

        context: path.resolve(__dirname, 'src'),

        entry: {
            pyxis: './pyxis.js',
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            filename: devMode ? '[name].bundle.js' : '[name].bundle.[hash].js'
        },

        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, 'src', 'scss')],
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
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
                    loader: 'html-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.(ttf|eot|svg|woff(2)?|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader',
                    exclude: /src\/assets\/media/,
                    options: { name: '[name].[ext]', outputPath: 'assets/fonts/' }
                },
                {
                    test: /\.(jpg|svg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader',
                    exclude: /src\/assets\/fonts/,
                    options: { name: '[name].[ext]', outputPath: 'assets/media/' }
                }
            ],
        },
        plugins: ([
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({ filename: '[name].css' }),
            new StylelintPlugin(stylelintOptions),
        ]).concat(testPlugin),
        devServer: {
            compress: false,
            port: 8080,
            disableHostCheck: true
        }
    }

    if (devMode) {
        conf = Object.assign(conf, { devtool: 'inline-source-map' })
    }

    return conf
}
