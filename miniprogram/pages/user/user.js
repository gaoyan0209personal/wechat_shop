const db = wx.cloud.database()
const app = getApp()

// pages/user/user.js
Page({

  /**
   * Page initial data
   */
  data: {
    received_email: null, // the draft emails from cloud function receive.
    account: null, // email login info, e.g. {name: "yan", addr: "yangao0209@qq.com", pass: "quapeernkkqahgdf", server: "qq.com", imap: Array(2), …}, this is saved in app as well
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
    if (!app.globalData.openid) {
      this.load_openid();
    }
    var len = 0;
    const oa = options.account;
    console.log("0", oa);
    var self = this;
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
    console.log("1", "this.data", self.data);
    console.log("1", app.globalData.account);
    //当前账户
    const account = self.data.now
    console.log("2", account, typeof account);
    wx.hideToast({ // close login window and start showloading popup until all the emails loaded
      success: (res) => {
        wx.showLoading({
          title: '加载邮件中',
        })
      },
    })
    await wx.cloud.callFunction({
      name: 'receive',
      data: {
        num: 10, // TODO: user should give the number of email to fetch
        account
      }
    }).then(res => {
      self.setData({
        received_email: res,
        email_len: res.result.length,
      })
      db.collection('emails').where({
          _openid: app.globalData.openid,
        }).orderBy('time_id', 'desc')
        .field({
          _id: false,
          time_id: true,
        }).limit(1).get().then(res => {
          console.log(res.data)

          var i;
          if (res.data.length == 0) {
            for (i = 0; i < this.data.email_len; i++) {
              const saved_email = this.data.received_email.result[i]
              db.collection('emails').add({
                data: saved_email,
              })
            }
          } else {
            const latest_date = res.data[0].time_id // latest email date
            for (i = 0; i < this.data.email_len; i++) {
              if (this.data.received_email.result[i].time_id > latest_date) {
                const saved_email = this.data.received_email.result[i]
                db.collection('emails').add({
                  data: saved_email,
                })
              }
            }
          }

        }).catch(console.error)

      wx.hideLoading();
      
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