const db = wx.cloud.database()
const app = getApp()
const regexpEachItem = /(?<Name>.+)\s+\$(?<Price>.+)T\s+(?<UPC>\d+)\s+(?<StyleNumber>\w+)\s+(?<Color>\w+)\s+(?<Quantity>\d+)\s@\s\$(?<OriginalPrice>.+)/g;
const regexpTax = /SALES\sTAX\s-\s(?<Tax>.+)%/
// pages/user/user.js
Page({
  /**
   * Page initial data
   */
  data: {
    balance: 0.00,
    freeze: 0,
    score: 0,
    growth: 0,
    score_sign_continuous: 0,
    rechargeOpen: false, // 是否开启充值[预存]功能
    checkSta: 1,

    // 用户订单统计数据
    count_id_no_confirm: 0,
    count_id_no_pay: 0,
    count_id_no_reputation: 0,
    count_id_no_transfer: 0,

    received_email: null, // the draft emails from cloud function receive.
    account: null, // email login info, e.g. {name: "yan", addr: "yangao0209@qq.com", pass: "quapeernkkqahgdf", server: "qq.com", imap: Array(2), …}, this is saved in app as well
  },

  onGotUserInfo: function (event) {
    console.log(event)
  },

  loademail: async function (options, load_number) {
    wx.hideToast({ // close login window and start showloading popup until all the emails loaded
      success: (res) => {
        wx.showLoading({
          title: '加载邮件中',
        })
      },
    })
    if (!app.globalData.openid) {
      // this.load_openid();
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
      let now = result[0] // result has all emails.
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
    await wx.cloud.callFunction({
      name: 'receive',
      data: {
        num: 10, // TODO: user should give the number of email to fetch
        account
      }
    }).then(res => {
      self.setData({
        received_email: res,
        email_len: res.result.length, // Uncaught (in promise) TypeError: Cannot read property 'length' of null
      })
      db.collection('emails').where({
          _openid: app.globalData.openid,
        }).orderBy('time_id', 'desc')
        .field({
          _id: false,
          time_id: true,
        }).limit(1).get().then(res => {
          var i;
          if (res.data.length == 0) { // current user latest coach email, if user has.
            for (i = 0; i < this.data.email_len; i++) {
              const saved_email = this.data.received_email.result[i]
              this.addemail(saved_email)
              this.addinventory(saved_email)
            }
          } else {
            const latest_date = res.data[0].time_id // latest email date
            for (i = 0; i < this.data.email_len; i++) {
              if (this.data.received_email.result[i].time_id > latest_date) {
                const saved_email = this.data.received_email.result[i]
                this.addemail(saved_email)
                this.addinventory(saved_email)
              }
            }
          }
        }).catch(console.error)
      wx.hideLoading();
    })
  },

  addemail: function (saved_email) {
    db.collection('emails').add({
      data: saved_email,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增邮件记录成功',
        })
        console.log('[数据库] [新增邮件记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增邮件记录失败'
        })
        console.error('[数据库] [新增邮件记录] 失败：', err)
      }
    })
  },

  addinventory: function (saved_email) {
    const emailBody = saved_email.body[0] // saved_email.body is an array whose size is one
    const emailTimeId = saved_email.time_id
    const matches = emailBody.matchAll(regexpEachItem);
    const tax = emailBody.match(regexpTax)[1];
    const title = saved_email.title
    for (const match of matches) {
      const item = match.groups;
      item['Tax'] = tax;
      item['EmailTimeID'] = emailTimeId;
      item['EmailTitle'] = title;
      item['buyer'] = '';
      item['tracknumber'] = null;
      item['sellprice'] = null;
      db.collection('inventory').add({
        data: item,
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '新增库存记录成功',
          })
          console.log('[数据库] [新增库存记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增库存记录失败'
          })
          console.error('[数据库] [新增库存记录] 失败：', err)
        }
      })
    }
    // return matches;
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      openid: app.globalData.openid,
    });
    // db.collection("user").doc(this.data.openid).get().then(res => {
    //   console.log(res)
    //   })
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
    // this.setData({
    //   userInfo: app.globalData.userInfo,
    // });
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

  },

  toBind(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    db.collection("user").where({
      _openid: this.data.openid
    }).get().then(res => {
      if (res.data.length == 0) {
        // db.collection("user").add(



        // )
      } else {

      }
    }).catch(
      console.error
    )


  },
})