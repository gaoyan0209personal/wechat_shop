// pages/addcategory/addcategory.js
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
    categories:db.collection("categories"),
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
    var pages  = getCurrentPages()
    db.collection('categories').orderBy('_id', 'desc')
    .limit(1)
    .get()
    .then(res => {
      db.collection("categories").add(
            {
              data:{
                _id: res.data[0]?res.data[0]._id + 1:1,
                name:e.detail.value.input
              }
            }
          )
          
    }).then(
      
    )
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})