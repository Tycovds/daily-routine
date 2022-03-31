const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    themeColor: "#e0ddaa",
    msTileColor: '#203239',
    iconPaths: {
      favicon32: "./img/icons/favicon-32x32.png",
      favicon16: "./img/icons/favicon-16x16.png",
      appleTouchIcon: "./img/icons/apple-touch-icon-120x120.png",
      maskIcon: "./img/icons/favicon.svg",
      msTileImage: "./img/icons/msapplication-icon-144x144.png"
    }
  }
})
