// const WXAPI = require('apifm-wxapi')
const app = getApp();
// const CONFIG = require('../../config.js')
// const AUTH = require('../../utils/auth')
const SelectSizePrefix = "选择："
// import Poster from 'wxa-plugin-canvas/poster/poster'

Page({
  data: {
    wxlogin: true,

    goodsDetail: {},
    hasMoreSelect: false,
    selectSizePrice: 0,
    selectSizeOPrice: 0,
    totalScoreToPay: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,

    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    shopType: "addShopCar", //购物类型，加入购物车或立即购买，默认为加入购物车
    curGoodsKanjia: 0 ,
  },
  async onLoad(e) {
    this.setData(e)
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
  // async addShopCar() {},
  // toAddShopCar: function(){},


  onShow (){
    // AUTH.checkHasLogined().then(isLogined => {
    //   if (isLogined) {
    //     this.setData({
    //       wxlogin: isLogined
    //     })
    //     this.goodsFavCheck()
    //   }
    // })
    // this.getGoodsDetailAndKanjieInfo(this.data.goodsId)
  },

})
