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
      publish: "never",
      extraMetadata: {
        // Asegúrate de no incluir una propiedad "build" aquí
        build: undefined
      }
    },
  },
})
