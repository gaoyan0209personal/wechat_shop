// pages/orders/orders.js
Page({

  /**
   * Page initial data
   */
  data: {
    classType: [{
        "id": 1,
        "name": "手机"
      },
      {
        "id": 2,
        "name": "数码"
      },
      {
        "id": 3,
        "name": "鲜花"
      },
      {
        "id": 4,
        "name": "服装"
      },
      {
        "id": 5,
        "name": "电脑"
      }
    ],
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
      },
      {
        "id": 7,
        "name": "华为Mate 20",
        "price": 2099,
        "src": "/images/mate20.jpg",
        "classid": 1,
      },
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.cloud.init()
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
    
    wx.cloud.database().collection("orders").get({
      success(res){
        console.log("res",res)
      }
    })
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