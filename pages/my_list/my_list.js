const REQUEST_URL = getApp().globalData.REQUEST_URL

Page({
  listChapter: function () {
    let that = this
    this.setData({
      loadingMsg: '加载中...',
    })
    wx.request({
      url: `${REQUEST_URL}/user/chapter/top`,
      method: 'get',
      header: {
        Cookie: wx.getStorageSync('cookie')
      },
      success: function ({
        data
      }) {
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
          that.data.list.push.apply(that.data.list, data.data)
          that.setData({
            list: that.data.list,
            loadingMsg: ''
          })
        } else {
          that.setData({
            loadingMsg: '没有更多了'
          })
        }
      },
      fail: function () {
        that.setData({
          loadingMsg: '获取章节出错，请返回重试'
        })
      }
    })
  },
  toggleActive: function () {
    this.setData({
      list: []
    })
    this.listChapter()
  },
  /**
   * 页面的初始数据
   */
  data: {
    loadingMsg: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({
    cid
  }) {
    this.setData({
      cid
    })
    this.listChapter()
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})