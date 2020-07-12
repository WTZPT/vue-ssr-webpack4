const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

const  VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = {
    entry:path.join(__dirname,'src/index.js'),
    output:{
        filename:'bundle.[hash:8].js',
        path:path.join(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.jsx$/,
                loader:'babel-loader'
            },
            {
                test:/\.css$/,
                use:["style-loader","css-loader"]
            },
           
            { 
                test:/\.less$/,
                use:["style-loader","css-loader","less-loader"]
            },
            {
                test:/\.(png|jpg|gif|jpeg|bmp)$/,
                use:["url-loader?limit=7654&name=[hash:8]-[name].[ext]"]
            },
            {
                test:/\.(ttf|eot|svg|woff|woff2)$/,
                use:["url-loader"]
            },
            {
                test:/\.scss$/,
                use:["style-loader","css-loader","sass-loader"]
            },
            {
                test:/\.vue$/,
                use:["vue-loader"]
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV: isDev ? '"development"':'"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin()
    ]
}

if(isDev) {
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8080,
        host: '0.0.0.0',
        overlay:{
            errors:true
         
        },
        hot:true 
    }
    config.module.rules.push(
        {
            test:/\.styl/,
            use:[
                'style-loader',
                'css-loader',
                {
                    loader:'postcss-loader',
                    options:{
                        sourceMap:true
                    }
                },  
                'stylus-loader'
            ]
        },
     )
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = {
        appp: path.join(__dirname,'src/index.js'),
        vendor:['vue']

    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
        {
            test:/\.styl/,
            use: ExtractPlugin.extract({
                fallback:'style-loader',
                use:[
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap:true
                        }
                    },  
                    'stylus-loader'
                ]
            })
        },
     )
     config.plugins.push(
         new ExtractPlugin('styles.[md5:contenthash:hex:8].css '),
         new webpack.optimize.SplitChunksPlugin({
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                //打包重复出现的代码
                vendor: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0, // This is example is too small to create commons chunks
                    name: 'vendor'
                },
                //打包第三方类库
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: Infinity
                }
            }
        }),

        new webpack.optimize.RuntimeChunkPlugin({
            name: "manifest"
        }),
     )
     
}

module.exports = config;