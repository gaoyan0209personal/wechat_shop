const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    listType: 1, // 1为1个商品一行，2为2个商品一行    
    name: '', // 搜索关键词
    orderBy: '', // 排序规则

    classType: [],
    productList: [],
    productAll: [{
        "id": 1,
        "name": "华为Mate 30",
        "price": 4099,
        "src": "/images/mate30.jpg",
        "classid": 1,
      },
      {
        "id": 2,
        "name": "华为Mate 20",
        "price": 2099,
        "src": "/images/mate20.jpg",
        "classid": 1,
      },
      {
        "id": 3,
        "name": "爆款清仓",
        "price": 99,
        "src": "/images/airpods.jpg",
        "classid": 2,
      },
      {
        "id": 4,
        "name": "华为Mate 20",
        "price": 2099,
        "src": "/images/mate20.jpg",
        "classid": 1,
      },
      {
        "id": 5,
        "name": "华为Mate 20",
        "price": 2099,
        "src": "/images/mate20.jpg",
        "classid": 1,
      },
      {
        "id": 6,
        "name": "华为Mate 20",
        "price": 2099,
        "src": "/images/mate20.jpg",
        "classid": 1,
      }
    ]
  },

  addcategory(e) {
    wx.navigateTo({
      url: '/pages/addcategory/addcategory',
    })
  },

  additem(e) {
    wx.navigateTo({
      url: '/pages/additem/additem',
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      categoryId: options.categoryId
    })
    this.search()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("index page onshow run successfully ")
    let that = this
    // db.collection("categories").get({
    //   success(res) {
    //     that.setData({
    //       classType: res.data
    //     })
    //   },
    //   fail(res) {
    //     console.log("请求失败", res)
    //   }

    // })
  },
  async search(){
    // 搜索商品
    // wx.showLoading({
    //   title: '加载中',
    // })
    const _data = {
      orderBy: this.data.orderBy,
      page: 1,
      pageSize: 500,
    }
    if (this.data.name) {
      _data.k = this.data.name
    }
    if (this.data.categoryId) {
      _data.categoryId = this.data.categoryId
    }
    console.log(_data)
    // const res = await WXAPI.goods(_data)
    // wx.hideLoading()
    // if (res.code == 0) {
    //   this.setData({
    //     goods: res.data,
    //   })
    // } else {
    //   this.setData({
    //     goods: null,
    //   })
    // }
  },
  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
