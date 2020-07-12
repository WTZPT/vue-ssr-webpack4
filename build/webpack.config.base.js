const path = require('path')

const config = {
    entry:path.join(__dirname,'../client/index.js'),
    output:{
        filename:'bundle.[hash:8].js',
        path:path.join(__dirname,'../dist')
    },
    module:{
        rules:[
            {
                test:/\.jsx$/,
                loader:'babel-loader'
            },
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude: /node_modules/
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
                use:["url-loader?limit=7654&name=resources/[path][name]-[hash:8].[ext]"]
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
    }
   
}

module.exports = config; 