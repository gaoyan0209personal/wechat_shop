const app = getApp();
const SelectSizePrefix = "选择："
const db = wx.cloud.database()


Page({
  data: {
    wxlogin: true,
    updated_sellprice:null,
    updated_buyer:null,
    updated_tracknumber:null
  },

  submitForm(e) {
    // db.collection('inventory').doc(this.data.id).update({
    //   data: {
    //     sellprice:this.data.sellprice,
    //     buyer: this.data.buyer,
    //     tracknumber: this.data.tracknumber,
    //   }
    // }).then(res => console.log(res)).catch(console.error)

    this.setData({
      updated_sellprice: this.data.sellprice,
      updated_buyer: this.data.buyer,
      updated_tracknumber: this.data.tracknumber,
    })
  },

  bindaftertaxpriceChange: function (e) {
    this.setData({
      sellprice: e.detail.value
    })
  },

  bindbuyerChange: function (e) {
    this.setData({
      buyer: e.detail.value
    })
  },

  bindtracknumberChange: function (e) {
    this.setData({
      tracknumber: e.detail.value
    })
  },

  async onLoad(e) {
    this.setData(e)
    this.setData({
      originalaftertax: (Number(e.originalprice) * (Number(e.tax) / 100 + 1)).toFixed(2)
    })
    //   if (e && e.scene) {
    //     const scene = decodeURIComponent(e.scene) // 处理扫码进商品详情页面的逻辑
    //     if (scene && scene.split(',').length >= 2) {
    //       e.id = scene.split(',')[0]
    //       wx.setStorageSync('referrer', scene.split(',')[1])
    //     }
    //   }
    //   this.data.goodsId = e.id
    //   const that = this
    //   this.data.kjJoinUid = e.kjJoinUid    
    //   let goodsDetailSkuShowType = wx.getStorageSync('goodsDetailSkuShowType')
    //   if (!goodsDetailSkuShowType) {
    //     goodsDetailSkuShowType = 0
    //   }
    //   this.setData({
    //     goodsDetailSkuShowType,
    //     curuid: wx.getStorageSync('uid')
    //   })
  },


  onShow() {
    
  },
})