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
    goods: null,
    allgoods: null,
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

  async search(e) {
    // 搜索商品
    wx.showLoading({
      title: '加载中',
    })
    if (!this.data.orderBy) {
      this.setData({
        goods: this.data.allgoods
      })
    } else {
      this.setData({
        goods: this.data.allgoods.filter(word => word[this.data.orderBy] == this.data.name)
      })
    }
    wx.hideLoading()
  },

  async getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    await db.collection('inventory').where({
      _openid: app.globalData.openid,
    }).orderBy('EmailTimeID', 'desc').get().then(res => { //TODO: need to consider case that has above 20 items.
      this.setData({
        goods: res.data,
        allgoods: res.data,
      })
    })
    wx.hideLoading()
  },

  filter(e) {
    this.setData({
      orderBy: e.currentTarget.dataset.val
    })
    this.search()
  },

  bindinput(e) {
    this.setData({
      name: e.detail.value
    })
  },

  bindconfirm(e) {
    this.setData({
      name: e.detail.value
    })
    this.search()
  },

  changeShowType() {
    if (this.data.listType == 1) {
      this.setData({
        listType: 2
      })
    } else {
      this.setData({
        listType: 1
      })
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      categoryId: options.categoryId
    })
    this.getGoodsList();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {},

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
    this.setData({
      orderBy: ""
    })
    this.getGoodsList();
    wx.stopPullDownRefresh();
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