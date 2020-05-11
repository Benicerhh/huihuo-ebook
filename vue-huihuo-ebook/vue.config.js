/* function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList') */

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    './' : '/',
  devServer: {
    /* before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }, */
    host: '127.0.0.1',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null, // 设置代理
    /*     configureWebpack: {
          performance: {
            hints: 'warning',
            maxAssetSize: 1024 * 800,
            maxEntrypointSize: 1024 * 800
          }
        } */
  }
}
