const path = require('path');
const _ = require('lodash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let webpackConfig = {
	entry: path.join(__dirname, '/client/index.js'),
	output: {
		filename: 'build.js',
		path: path.join(__dirname, '/public')
	},
	module:{
		rules:[{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		},
		{
			test: /\.scss$/,
			use: [
				process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
				"css-loader", // translates CSS into CommonJS
				"sass-loader" // compiles Sass to CSS, using Node Sass by default
			]
		}]
	},
	plugins: []
};

if( process.env.NODE_ENV  === 'production' )
{
	_.merge(webpackConfig, {
		mode : 'production'
	});
	webpackConfig.plugins.push(new MiniCssExtractPlugin({
		// Options similar to the same options in webpackOptions.output
		// both options are optional
		filename: "[name].css",
		chunkFilename: "[id].css"
	}));
}
else if ( process.env.NODE_ENV  === 'development' )
{
	_.merge(webpackConfig, {
		mode : 'development',
		watch: true,
		devtool: "source-map",
		watchOptions: {
			ignored: /node_modules/
		}
	});
}

module.exports = webpackConfig;