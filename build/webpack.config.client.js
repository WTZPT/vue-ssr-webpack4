const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

const  VueLoaderPlugin = require('vue-loader/lib/plugin')
const defaultPlugins = [
      new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV: isDev ? '"development"':'"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin()
]
const devServer = {
    port: 8080,
    host: '0.0.0.0',
    overlay:{
        errors:true
     
    },
    hot:true 
}

let config 

if(isDev) {
    config = merge(baseConfig,{
        devtool:'#cheap-module-eval-source-map',
        module:{
            rules:[
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
            ]
        },
        devServer,
        plugins: defaultPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin() 
        ])
    })
 
} else {
    config = merge(baseConfig,{
        entry: {
            appp: path.join(__dirname,'../client/index.js'),
            vendor:['vue']
    
        },

        output:{
            filename : '[name].[chunkhash:8].js'
        },

        module:{
            rules:[
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
            ]
        },

        plugins : defaultPlugins.concat([
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
        ])
    })
    
   
    
     config.plugins.push(
         
     )
     
}

module.exports = config;