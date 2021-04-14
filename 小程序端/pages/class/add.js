let date = new Date();
let classday = null;
let classname = null;
let classteacher = null;
let classroom = null;
let classnum = null;
let classstart = null;
let classend = null;
Page({

    classname: function (res) {
        classname = res.detail.value
    },

    classteacher: function (res) {
        classteacher = res.detail.value
    },

    classroom: function (res) {
        classroom = res.detail.value
    },

    classnum: function (res) {
        classnum = res.detail.value
    },

    /**
     * 页面的初始数据
     */
    data: {

    },

    getDay: function (e) {
        classday = e.detail
    },

    getTimeStart: function (e) {
        classstart = e.detail + ':00'
        classstart = date.getFullYear() + '-' + classday + ' ' + classstart
        classstart = (new Date(classstart).getTime() / 1000)
    },

    getTimeEnd: function (e) {
        classend = e.detail + ':00'
        classend = date.getFullYear() + '-' + classday + ' ' + classend
        classend = (new Date(classend).getTime() / 1000)
    },

    addClass: function () {
        if (!classname) {
            wx.showToast({
                title: '请输入课程名称',
                icon: 'error'
            })
            return
        }
        if (!classteacher) {
            wx.showToast({
                title: '请输入任课老师',
                icon: 'error'
            })
            return
        }
        if (!classroom) {
            wx.showToast({
                title: '请输入上课教室',
                icon: 'error'
            })
            return
        }
        if (!classnum) {
            wx.showToast({
                title: '请输入上课人数',
                icon: 'error'
            })
            return
        }
        if (!classday) {
            wx.showToast({
                title: '请输入上课日期',
                icon: 'error'
            })
            return
        }
        if (!classstart) {
            wx.showToast({
                title: '请选择上课时间',
                icon: 'error'
            })
            return
        }
        if (!classend) {
            wx.showToast({
                title: '请选择下课时间',
                icon: 'error'
            })
            return
        }
        wx.request({
            url: 'http://localhost:3000/class/add',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                classname: classname,
                classteacher: classteacher,
                classroom: classroom,
                classnum: classnum,
                classday: classday,
                classstart: classstart,
                classend: classend
            },
            success: function(res) {
                wx.showToast({
                  title: res.data.msg,
                  success: function() {
                    wx.reLaunch({
                        url: '/pages/user/index'
                    })
                  }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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