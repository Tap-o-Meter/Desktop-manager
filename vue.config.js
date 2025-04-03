const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './',
      nodeIntegration: true,
      externals: ['serialport'],
      extraMetadata: {
        publish: "never",
        // Si tienes build en package.json que no quieres que se incluya, también puedes removerlo:
        build: undefined
      }
    },
  },
})
