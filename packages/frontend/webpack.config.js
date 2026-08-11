const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserPlugin = require('terser-webpack-plugin');

// let isDevelopment = process.env.NODE_ENV.trim() != 'production'
// let isDevelopment = process.env.NODE_ENV.trim() != 'production'
let nodeEnv = process.env.NODE_ENV.trim()
// let isDevelopment = false
// let isDevelopment = true

// let timestamp = new Date().getTime()

let _buildWithDebugSourceMap = () => {
    return {
        devtool: 'eval',
        optimization: {
            chunkIds: 'named',
            mangleExports: false,
            moduleIds: 'named',

            concatenateModules: false,
            // avoidEntryIife: false,
            // flagIncludedChunks: false,
            //  sideEffects: 'flag',

            // minimize: true,

            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true
                    },
                }),
            ],
        },
    }
}

let _buildWithDebugNoSourceMap = () => {
    return {
        devtool: false,
        optimization: {
            chunkIds: 'named',
            mangleExports: false,
            moduleIds: 'named',

            // concatenateModules: false,
            // avoidEntryIife: false,
            // flagIncludedChunks: false,
            // sideEffects: 'flag',

            // minimize: true,

            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true
                    },
                }),
            ],
        },
    }
}

// let _buildWithProduction = () => {
//     return {
//         devtool: false,
//         // optimization: {
//         //     minimizer: [
//         //         new TerserPlugin({
//         //             terserOptions: {
//         //                 keep_classnames: true,
//         //                 keep_fnames: true
//         //             },
//         //         }),
//         //     ],
//         // },
//     }
// }
let _buildWithProduction = _buildWithDebugNoSourceMap

let obj
switch (nodeEnv) {
    case "fast":
        obj = _buildWithDebugNoSourceMap()
        break
    case "debug":
        obj = _buildWithDebugSourceMap()
        break
    case "production":
        obj = _buildWithProduction()
        break
    default:
        throw new Error("err")
}

// let _isChinese = () => {
//     return (navigator.language || navigator.browserLanguage).toLowerCase().includes("zh-cn")
// }

module.exports = {
    ...obj,

    entry: "./src/Main.tsx",
    // mode: !isDevelopment ? 'production' : 'development',
    // mode: nodeEnv == "debug" ? 'production' : nodeEnv,
    mode: 'production',
    // devtool: 'source-map',
    // devtool:'eval-cheap-source-map',
    // devtool: false,
    // devtool: nodeEnv == "debug" || nodeEnv == 'development' ? 'eval' : false,

    // devtool: nodeEnv == "debug" ? 'eval' : false,
    // optimization: nodeEnv == "production" ? {
    //     minimizer: [
    //         new TerserPlugin({
    //             terserOptions: {
    //                 keep_classnames: true,
    //                 keep_fnames: true
    //             },
    //         }),
    //     ],
    // } : {
    //     chunkIds: 'named',
    //     mangleExports: false,
    //     moduleIds: 'named',

    //     concatenateModules: false,
    //     // avoidEntryIife: false,
    //     // flagIncludedChunks: false,
    //     //  sideEffects: 'flag',

    //     // minimize: true,

    //     minimizer: [
    //         new TerserPlugin({
    //             terserOptions: {
    //                 keep_classnames: true,
    //                 keep_fnames: true
    //             },
    //         }),
    //     ],
    // },


    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/[name].js',
        // filename: `static/js/[name].${timestamp}.js`,
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
        symlinks: true,
        modules: ['node_modules'],
        fallback: { "crypto": false }
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                // use: "ts-loader",
                loader: "ts-loader",
                // options: {
                //     transpileOnly: true,
                //     allowTsInNodeModules: true,
                //     // onlyCompileBundledFiles: true
                // }
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                use: [
                    // isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    // nodeEnv == "development" ? 'style-loader' : MiniCssExtractPlugin.loader,
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // sourceMap: nodeEnv == "development"
                            sourceMap: false
                        }
                    }
                    // false ? 'style-loader' : MiniCssExtractPlugin.loader,
                    // 'css-loader',
                    // {
                    //     loader: 'sass-loader',
                    //     options: {
                    //         sourceMap: false
                    //     }
                    // }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] //在Webpack中，loader的执行顺序是从右向左执行的，webpack先将所有css模块依赖解析完得到计算结果再创建style标签。因此把style-loader放在css-loader的前面。
            },
        ]
    },
    plugins: [
        /**
        * All files inside webpack's output.path directory will be removed once, but the
        * directory itself will not be. If using webpack 4+'s default configuration,
        * everything under <PROJECT_DIR>/dist/ will be removed.
        * Use cleanOnceBeforeBuildPatterns to override this behavior.
        *
        * During rebuilds, all webpack assets that are not used anymore
        * will be removed automatically.
        *
        * See `Options and Defaults` for information
        */
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[hash].css',
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            hash: true, // cache busting
            cache: false,
            // timestamp: timestamp,
            filename: 'index.html',
            inject: true,
            // favicon:_isChinese() ? path.resolve('favicon_cn.ico') : path.resolve('favicon_en.ico'),//favicon路径
            favicon: path.resolve('favicon_cn.ico'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '../meta3d-jiehuo-abstract/src/resource/',
                    to: './meta3d-jiehuo-abstract/'
                },


                {
                    from: './src/resource/',
                    to: './resource/'
                },
                {
                    from: './src/resource_girl/',
                    to: './resource_girl/'
                },

                {
                    from: '../../mods/',
                    to: './'
                },



                {
                    from: '../website/chinese/build/',
                    to: './website/chinese/'
                },
                {
                    from: '../website/english/build/',
                    to: './website/english/'
                },
            ],
        }),
    ],
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    }
};