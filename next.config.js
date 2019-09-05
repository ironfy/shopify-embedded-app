require("dotenv").config();
const withCSS = require('@zeit/next-css'); // To import CSS from webpack
const webpack = require('webpack'); // Webpack

const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY); // The api key

// Exports the module with CSS and returns the webpack config with the apiKey, used in Polaris comp.
module.exports = withCSS({
  webpack: (config) => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
});