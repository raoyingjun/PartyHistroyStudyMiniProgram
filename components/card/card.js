const REQUEST_URL = getApp().globalData.REQUEST_URL
const OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
Component({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: Boolean,
    cid: Number, // 章节编号
    questions: {
      type: Array,
      value: []
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    question: {},
    rightSize: 0,
    current: 0, // 当前所在的题目的索引
    total: 0, // 总题数
  },
  lifetimes: {
    ready() {
      this.setData({
        question: this.data.questions[0],
        total: this.data.questions.length
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    singleChange(e) {
      const radioItems = this.data.question.answers;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].aid == e.detail.value;
      }
      this.setData({
        'question.answers': radioItems
      });
    },
    multiChange(e) {
      const checkboxItems = this.data.question.answers,
        values = e.detail.value;
      console.log(values);
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false;
        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (checkboxItems[i].aid == values[j]) {
            checkboxItems[i].checked = true;
            break;
          }
        }
      }
      this.setData({
        'question.answers': checkboxItems
      });
    },
    submit() {
      const that = this
      wx.showLoading({
        title: '正在提交...',
        mask: true
      })
      wx.request({
        url: `${REQUEST_URL}/user/chapter/log`,
        method: 'post',
        data: { 
          rightSize: this.data.rightSize,
          cid: this.data.cid
        },
        header: {
          Cookie: wx.getStorageSync('cookie')
        },
        success: function ({
          data
        }) {
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
            that.close(true)
          } else {
            wx.showToast({
              title: data.message,
              duration: 2000,
              icon: 'none'
            })
          }
        },
        fail() {
          wx.hideLoading()
          wx.showToast({
            title: '提交时出错，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    close(isSubmit) {
      isSubmit = typeof isSubmit === 'boolean' // if boolean is submit, else is event
      console.log(isSubmit);
      this.triggerEvent('close', {
        isSubmit
      }, {
        bubble: true
      })
    },
    prev() {
      this.setData({
        question: this.data.questions[this.data.current - 1],
        current: this.data.current - 1
      })
    },
    isRight() {
      var items = this.data.question.answers
      for (var i = 0, len = items.length; i < len; i++) {
        if ((items[i].checked && (items[i].status === 'ERROR')) || (!items[i].checked && (items[i].status === 'RIGHT'))) return false
      }
      console.log('g')
      return true
    },
    confirm() {
      if (!this.isSelected()) {
        return
      }
      let note = ''
      if (this.isRight()) {
        note += '恭喜你答对啦。'
        this.setData({
          rightSize: this.data.rightSize + 1
        })
      } else {
        note += '很抱歉，你答错了。'
      }
      note += '正确答案为' + this.formatRightAnswer()
      this.setData({
        'question.confirmed': true,
        'question.note': note
      })
    },
    getChoosedSize() {
      const items = this.data.question.answers
      var choosedLen = 0 // 选中的题数量
      for (var i = 0, len = items.length; i < len; i++) {
        if (items[i].checked) choosedLen++
      }
      return choosedLen;
    },
    isSelected() {
      const choosedSize = this.getChoosedSize()
      if (this.data.question.type === 'MULTI') {
        if (choosedSize < 2) {
          wx.showToast({
            title: '请至少选择两个答案',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        return true
      } else {
        if (choosedSize < 1) {
          wx.showToast({
            title: '请至少选择一个答案',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        return true
      }
    },
    formatRightAnswer() {
      var msg = []
      var items = this.data.question.answers
      for (var i = 0, len = items.length; i < len; i++) {
        if (items[i].status === 'RIGHT') msg.push(OPTIONS[i])
      }
      return msg.join('、')
    },
    next() {
      this.setData({
        question: this.data.questions[this.data.current + 1],
        current: this.data.current + 1
      })
    },
  }
})