module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    chainWebpack: config => {
      config
        .plugin('html')
        .tap(args => {
          args[0].title= 'Alchemy Pay'
          return args
        })
    },
}
2
