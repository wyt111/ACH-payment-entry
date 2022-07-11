module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  //elment-ui按需引入
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //vant按需引入
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}

