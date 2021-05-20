const db = wx.cloud.database()
const app = getApp()

Page({
  data: {
    emails: [],
    active_email_index: 0,
  },

  selectTap: function (e) {
    // console.log(e);
    // var id = e.currentTarget.dataset.id;
    // WXAPI.updateAddress({
    //   token: wx.getStorageSync('token'),
    //   id: id,
    //   isDefault: 'true'
    // }).then(function(res) {
    //   wx.navigateBack({})
    // })
  },

  addAddess: function () {
    wx.navigateTo({
      url: "/pages/email-address-add/index"
    })
  },

  editAddess: function (e) {
    console.log(e);

    // wx.navigateTo({
    //   url: "/pages/email-address-add/index?id=" + e.currentTarget.dataset.id
    // })
  },

  onLoad: function () {
    const id_ = app.globalData.openid
    db.collection('user').doc(id_).get().then(
      res => {
        if (res.data.active_email_index != null) {
          this.setData({
            active_email_index: res.data.active_email_index,
          })
        }
        if (res.data.mails != null) {
          this.setData({
            emails: res.data.mails
          })
        }
      })

  },
  
  onShow: function () {
    // AUTH.checkHasLogined().then(isLogined => {
    //   if (isLogined) {
    //     this.initShippingAddress();
    //   } else {
    //     AUTH.openLoginDialog()
    //   }
    // })
  },
  async initShippingAddress() {
    wx.showLoading({
      title: '',
    })
    // const res = await WXAPI.queryAddress(wx.getStorageSync('token'))
    // wx.hideLoading({
    //   success: (res) => {},
    // })
    // if (res.code == 0) {
    //   this.setData({
    //     addressList: res.data
    //   });
    // } else if (res.code == 700) {
    //   this.setData({
    //     addressList: null
    //   });
    // } else {
    //   wx.showToast({
    //     title: res.msg,
    //     icon: 'none'
    //   })
    // }
  },
  onPullDownRefresh() {
    //   this.initShippingAddress()
    //   wx.stopPullDownRefresh()
    // },
    // processLogin(e) {
    //   if (!e.detail.userInfo) {
    //     wx.showToast({
    //       title: '已取消',
    //       icon: 'none',
    //     })
    //     return;
    //   }
    // AUTH.register(this);
  },

  onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    const app_id = app.globalData.openid;
    const index = event.currentTarget.dataset.idx
    const that = this
    switch (position) {
      case 'left':
      case 'cell':
        wx.showModal({
          title: "邮箱选择成功",
          content: "",
          showCancel: false,
          success(res) {
            that.setData({
              active_email_index: index
            })
            db.collection('user').doc(app_id).update({
              data: {
                active_email_index: index
              },
              success: function (res) {
                console.log(res.data)
              }
            })
          },
          fail(e) {
            console.error(e)
          }
        })
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '确定删除吗？',
          content: ""
        }).then((res) => {
          instance.close();
          if (res.confirm) {
            console.log('用户点击确定')
            let before_remove = this.data.emails
            before_remove.splice(index,1)
            if (this.data.active_email_index > index){ 
              console.log("if")
              that.setData({
                active_email_index: that.data.active_email_index-1,
                emails:before_remove
              }) 
            } else { 
              console.log("else")
              that.setData({
                emails:before_remove
            }) }
            db.collection('user').doc(app_id).update({
              data: {
                active_email_index: this.data.active_email_index,
                mails:this.data.emails
              },
              success: function (res) {
                console.log("email 数据库更新成功")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        });
        break;
    }
  },
})