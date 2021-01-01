const db = wx.cloud.database()
const app = getApp()

// pages/user/user.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  onGotUserInfo: function (event) {
    console.log(event)
  },

  load_openid: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.showToast({
          title: '用户登录成功',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '用户登录失败',
        })
      }
    })
  },

  loademail: async function (options, load_number) {
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
        num: 10, // TODO: user should give the number of email to fetch
        account
      }
    }).then(res => {
      console.log(res)
      // res.result.foreach(emailObject => {
      // })
      db.collection('emails').add({
        data: res.result[0],
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
        },
        fail: err => {
          console.log(err);
        }
      })
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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