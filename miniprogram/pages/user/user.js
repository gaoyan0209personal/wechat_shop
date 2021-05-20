const db = wx.cloud.database()
const app = getApp()
const regexpEachItem = /(?<Name>.+)\s+\$(?<Price>.+)T\s+(?<UPC>\d+)\s+(?<StyleNumber>\w+)\s+(?<Color>\w+)\s+(?<Quantity>\d+)\s@\s\$(?<OriginalPrice>.+)/g;
const regexpTax = /SALES\sTAX\s-\s(?<Tax>.+)%/
import bindViewTap from '../login/login'
// pages/user/user.js
Page({
  /**
   * Page initial data
   */
  data: {
    received_email: null, // the draft emails from cloud function receive.
    account: null, // email login info, e.g. {name: "yan", addr: "yangao0209@qq.com", pass: "quapeernkkqahgdf", server: "qq.com", imap: Array(2), …}, this is saved in app as well
    // 用户订单统计数据
    userInfo: app.globalData.userInfo,
    email_quantity:10
  },

  goLogin: function (event) {
    wx.navigateTo({
      url: '/pages/login/login' //跳转
    })
  },

  loademail: async function (options, load_number) {
    wx.hideToast({ // close login window and start showloading popup until all the emails loaded
      success: (res) => {
        wx.showLoading({
          title: '加载邮件中',
        })
      },
    })
    wx.showLoading({title: '加载邮件中...'})
    const oa = options.account;
    var self = this;
    await wx.cloud.callFunction({
      name: 'account'
    }).then(({
      result
    }) => {
      result = [result]
      let now = result[0] // result has all emails.
      if (oa) {
        now = result.find(v => v.addr = oa)
      }
      self.setData({
        account: result,
        now
      })
      app.globalData.account = result
    })
    //当前账户
    const account = self.data.now
    await wx.cloud.callFunction({
      name: 'receive',
      data: {
        num: this.data.email_quantity, 
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
        wx.showLoading({
          title: '加载邮件中',
          
        })
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
      item['description'] = null;
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
    if (!this.data.userInfo || !this.data.openid) {
      this.setData({
        userInfo: app.globalData.userInfo,
        openid: app.globalData.openid,
      })
    }
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

  onChange:function(event){
    // console.log(event.detail)
    this.setData({
      email_quantity: event.detail,
    })
  }

})