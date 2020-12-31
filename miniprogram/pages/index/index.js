const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
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

  searchTab(e) {
    var p = this.data.productAll;
    var id = e.currentTarget.id;
    console.log(e);
    var list = [];
    for (var i = 0; i < p.length; i++) {
      if (p[i].classid == id) {
        list.push(p[i])
      }
    }
    this.setData({
      productList: list
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: async function (options) {
    const oa = options.account
    console.log("0", oa);
    var self = this
    await wx.cloud.callFunction({
      name: 'account'
    }).then(({
      result
    }) => {
      let now = result[0]
      console.log("0", now)
      if (oa) {
        now = result.find(v => v.addr = oa)
      }
      console.log("0", now)
      self.setData({
        account: result,
        now
      })
      app.globalData.account = result
    })
    console.log("1", "app.globalData.account", app.globalData.account);
    console.log("1", "this.data", self.data);
    //当前账户
    const account = self.data.now
    console.log("2", account, typeof account);
    await wx.cloud.callFunction({
      name: 'receive',
      data: {
        // default
        num: 3,
        account
      }
    }).then(res => {
      console.log(res.result);
      app.globalData.email.push(...res.result)
      self.setData({
        mail: res.result
      })
    })
    
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
    db.collection("categories").get({
      success(res) {
        that.setData({
          classType: res.data
        })
      },
      fail(res) {
        console.log("请求失败", res)
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