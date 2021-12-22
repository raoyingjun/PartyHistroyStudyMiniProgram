const REQUEST_URL = getApp().globalData.REQUEST_URL


const app = getApp()

Page({
  data: {
    carousels: [
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=248924869,672761308&fm=26&gp=0.jpg',
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2021879490,291677325&fm=26&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2781052588,1568560588&fm=26&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1904973291,650534120&fm=26&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3449803529,4081709496&fm=26&gp=0.jpg'
    ],
    list: [],
  },
  listCarousel: function () {
    let that = this
    wx.request({
      url: `${REQUEST_URL}/user/banners`,
      method: 'get',
      header: {
        Cookie: wx.getStorageSync('cookie')
      },
      success: function (res) {
        if (res.data.code === 200) {
          that.setData({
            carousels: res.data.data
          })
        }
      }
    })
  },
  listChapter: function () {
    wx.showLoading({
      title: '加载章节中...',
    })
    let that = this
    wx.request({
      url: `${REQUEST_URL}/user/chapter/top`,
      method: 'get',
      header: {
        Cookie: wx.getStorageSync('cookie')
      },
      success: function ({ data }) {
        wx.hideLoading()
        if (data.code === 400) {
          wx.showModal({
            title: '提示',
            content: data.message,
            showCancel: false,
            confirmText: '重新登陆',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../login/login',
                })
              }
            }
          })
        } else if (data.code === 200) {
          that.setData({
            list: data.data
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '获取章节失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onLoad() {
    this.listChapter()
    this.listCarousel()
  }
})