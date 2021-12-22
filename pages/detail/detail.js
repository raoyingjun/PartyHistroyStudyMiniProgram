const REQUEST_URL = getApp().globalData.REQUEST_URL
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    questions:[],
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cid: options.cid
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.getArticleAndQuestions()
    wx.enableAlertBeforeUnload({
      message: '确认返回吗？您还没有答完题目，答题记录将不会保存'
    })
  },
  openCard() {
    this.setData({
      hidden: false
    })
  },
  getArticleAndQuestions: function () {
    wx.showLoading({
      title: '载入文章中...',
    })
    let that = this
    wx.request({
      url: `${REQUEST_URL}/user/chapter/details/${this.data.cid}`,
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
          let content = data.data.content
          content = content.replace(/img/g, 'img style="width: 100%"')
          content = content.replace(/width:\s?(\d)*\.?(\d)*px/g, 'width: auto')
          that.setData({
            questions: data.data.questionVos,
            content
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
  closeCard(e) {
    const { isSubmit } = e.detail
    if (isSubmit) {
      wx.disableAlertBeforeUnload()
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        duration: 1000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1000);
    }
    this.setData({
      hidden: true
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
  onUnload: function () {},

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