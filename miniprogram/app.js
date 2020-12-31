//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error(" 2.2.3 或以上的基础库以使用云能力")
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'firstone-jhme8'  //在运行的时候如果出现找不到资源环境这样的错误， 那就在云函数文件中初始化环境的时候把这条语句加进去
      })
    }
  },
  globalData: {
    userInfo: null,
    email: [], 
    account: [],
  }
})