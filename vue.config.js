const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
    lintOnSave: false,
    assetsDir: 'static',
    productionSourceMap: false,
    chainWebpack(config) {
        // if (process.env.ENV === "production") {
        //     config.plugin("webpack-bundle-analyzer")
        //         .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
        //         .end();
        // }

        config
            .plugin('html')
            .tap(args => {
                args[0].title= 'Alchemy Pay Ramp'
                return args
            })
        // 它可以提高第一个屏幕的速度，建议打开预加载
        config.plugin('preload').tap(() => [
            {
                rel: 'preload',
                // to ignore runtime.js
                // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: 'initial',

            }
        ])

        // 当页面太多时，会导致太多无意义的请求
        config.plugins.delete('prefetch')

        // 设置svg精灵加载程序
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
                title:'Alchemy Pay Ramp'
            })
            .end()
    },
}
