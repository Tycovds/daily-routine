const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    themeColor: "#e0ddaa",
    msTileColor: '#203239',
    iconPaths: {
      favicon32: "./img/icons/favicon.svg",
      favicon16: "./img/icons/favicon.svg",
      appleTouchIcon: "./img/icons/favicon.svg",
      maskIcon: "./img/icons/favicon.svg",
      msTileImage: "./img/icons/favicon.svg"
    }
  }
})
