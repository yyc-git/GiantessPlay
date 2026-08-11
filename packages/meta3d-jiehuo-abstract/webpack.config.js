const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserPlugin = require('terser-webpack-plugin');

// let isDevelopment = process.env.NODE_ENV.trim() != 'production'
let nodeEnv = process.env.NODE_ENV.trim()

module.exports = {
    entry: "./src/Main.ts",
    mode: nodeEnv == "debug" ? 'production' : nodeEnv,
    devtool: nodeEnv == "debug" || nodeEnv == 'development' ? 'eval' : false,
    optimization: nodeEnv == "production" ? {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true
                },
            }),
        ],
    } : {
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
                // parallel: true,
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    keep_classnames: true,
                    keep_fnames: true
                },
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/[name].js',
        libraryTarget: 'umd'
    },

    // // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
        symlinks: false,
        modules: ['node_modules'],
        fallback: { "crypto": false }
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                // exclude: /node_modules/,

                // // include: /setting-protocol/,
                // include: [/node_modules\/setting-protocol/],
                // use: "ts-loader",
                loader: "ts-loader",
                options: {
                    allowTsInNodeModules: true,
                },
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            // {
            //     test: /\.s(a|c)ss$/,
            //     exclude: /\.module.(s(a|c)ss)$/,
            //     loader: [
            //         isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 sourceMap: isDevelopment
            //             }
            //         }
            //     ]
            // },
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
        // new MiniCssExtractPlugin({
        //     filename: 'static/css/[name].[hash].css',
        // }),
        // new HtmlWebpackPlugin({
        //     template: './index.html',
        //     hash: true, // cache busting
        //     filename: 'index.html',
        //     inject: true,
        //     // favicon: path.resolve('favicon.ico'),//favicon路径
        // }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: './src/resource/',
        //             to: './'
        //         }
        //     ],
        // }),
    ],
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    }
};