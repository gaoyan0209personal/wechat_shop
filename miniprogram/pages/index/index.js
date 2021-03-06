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
    user_id: null
  },

  async search(e) {
    // 搜索商品
    wx.showLoading({
      title: '加载中',
    })
    if (!this.data.orderBy) {
      if (this.data.allgoods.length !== this.data.goods.length) {
        this.setData({
          goods: this.data.allgoods
        })
      }
    } else if (this.data.orderBy == "Name" && this.data.name) {
      this.setData({
        goods: this.data.allgoods.filter(word => word[this.data.orderBy].toLowerCase().includes(this.data.name.toLowerCase()))
      })
    } else {
      this.setData({
        goods: this.data.allgoods.filter(word => word[this.data.orderBy].toLowerCase().includes(this.data.name.toLowerCase()))
      })
    }
    wx.hideLoading()
  },

  async getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.openid !== null) {
      await db.collection('inventory').where({
        _openid: app.globalData.openid,
      }).orderBy('EmailTimeID', 'desc').get().then(res => { //TODO: need to consider case that has above 20 items.
        this.setData({
          goods: res.data,
          allgoods: res.data,
        })
      })
    }
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

  onChange: function (event) {
    const id_number = event.currentTarget.dataset['index']
    const quantity = event.detail
    db.collection('inventory').doc(id_number).update({
      data: {
        // 表示指示数据库将字段自增 
        Quantity: quantity
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        console.log("failed")
      }
    })
    this.getGoodsList();
    wx.stopPullDownRefresh();
  },

  bindaftertaxpriceChange: function (event) {
    const item_id = event.currentTarget.dataset['index']
    const description = event.detail['value']
    db.collection('inventory').doc(item_id).update({
      data: {
        // 表示指示数据库将字段自增 
        description: description
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        console.log("failed")
      }
    })
    this.getGoodsList();
    wx.stopPullDownRefresh();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log("options", app.globalData.openid)
    this.setData({
      name: options.name,
      categoryId: options.categoryId,
      user_id: options.openid
    })
    this.getGoodsList();
    console.log("sadfasdf", app.globalData)
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
    this.setData({
      user_id: app.globalData.openid
      // user_id:3
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

    wx.showLoading({
        title: '刷新中！',
        duration: 1000
      }),
      db.collection('inventory').where({
        _openid: app.globalData.openid
      }).skip(this.data.allgoods.length)
      // 限制返回数量为 20 条
      .orderBy('EmailTimeID', 'desc')
      .get()
      .then(res => {
        if (res.data.length > 0) {
          let newdata = this.data.allgoods.concat(res.data);
          this.data.allgoods = newdata;
          this.setData({
            goods: newdata
          })
          this.search()
        } else {
          wx.showToast({
            title: '已到底部',
            duration: 1000
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})