const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'electron-renderer',
    entry: {
        app: [
            './src/frontend/Main.tsx'    
        ],
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].bundle.js',
        //publicPath: '/'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: [path.resolve(__dirname, "node_modules")],   
            },
            {
                test: /\.css$/i,
                use: [ 'style-loader', 'css-loader'],
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ],

    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html') }),
        //new webpack.HotModuleReplacementPlugin()
    ]
}