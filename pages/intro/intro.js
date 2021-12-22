// pages/intro/intro.js
Page({
  jumpToLogin() {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  data: {
    countdown: 5
  },
  onLoad: function (options) {},
  onReady: function () {
    console.log('ready');
    this.setData({
      timer: setInterval(() => {
        this.setData({
          countdown: this.data.countdown - 1
        })
        if (this.data.countdown <= 0) {
          this.jumpToLogin()
        }
      }, 1000)
    })
  },
  onUnload: function () {
    clearInterval(this.data.timer)
  }
})