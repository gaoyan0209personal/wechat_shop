// pages/additem/additem.js
wx.cloud.init()
const db = wx.cloud.database({
  throwOnNotFound: true
})
Page({
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/component/pages/form/form'
    }
  },

  data: {
    pickerHidden: true,
    chosen: ''
  },

  pickerConfirm(e) {
    this.setData({
      pickerHidden: true
    })
    this.setData({
      chosen: e.detail.value
    })
  },

  pickerCancel() {
    this.setData({
      pickerHidden: true
    })
  },

  pickerShow() {
    this.setData({
      pickerHidden: false
    })
  },
  
  formSubmit(e) {
    db.collection('orders').orderBy('_id', 'desc')
    .limit(1)
    .get()
    .then(res => {
      db.collection("orders").add(
            {
              data:{
                _id: res.data[0]?res.data[0]._id + 1:1,
                name:e.detail.value.input_name,
                styleID:e.detail.value.input_styleID,
                brand:e.detail.value.input_brand,
                barCode:e.detail.value.input_barCode,
                category:e.detail.value.input_category,
                color:e.detail.value.input_color,
                quantity:e.detail.value.input_quantity,
                cost:e.detail.value.input_cost,
              }
            }
          )
          
    }).then(
      wx.navigateBack()
    )
    
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      searchinput: ''
    })
  }
})