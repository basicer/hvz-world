const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js',
    },
    output: {
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-react-jsx']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.md$/,
                use: ["raw-loader"],
            },
        ]
    },
    resolve: {
        alias: {
            react: "preact/compat",
            "react-dom": "preact/compat",
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    devServer: {
        port: 8080,        
        historyApiFallback:true,
        static: './'
    }
});
