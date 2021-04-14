Page({

    /**
     * 页面的初始数据
     */
    data: {
        userName: null,
        avatarUrl: null,
        sign: null,
        sign_day: 0,
    },

    // 签到
    sign: function () {
        var that = this;
        var time = Date.parse(new Date());
        wx.getStorage({
            'key': 'user_id',
            success: function (res) {
                wx.request({
                    url: 'http://localhost:3000/user/sign',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        id: res.data,
                        sign_in: 1,
                        sign_time: time
                    },
                    success: function (res) {
                        that.setData({
                            sign: res.data.data.sign,
                            sign_day: res.data.data.sign_day
                        })

                    }
                })
            }
        })
    },

    // 未登陆 路由跳转
    login: function () {
        wx.reLaunch({
            url: '/pages/user/login'
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
        var that = this;

        // 获取头像、昵称
        wx.getStorage({
            key: 'userinfo',
            success: function (res) {
                that.setData({
                    avatarUrl: res.data.avatarUrl,
                    userName: res.data.nickName
                })
            }
        })

        // 获取签到状态
        wx.getStorage({
            key: 'user_id',
            success: function (res) {
                wx.request({
                    url: 'http://localhost:3000/user/gxsign',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        id: res.data
                    },
                    success: function (ress) {
                        let signTime = new Date(ress.data.data.sign_time * 1000).toDateString();
                        let time = new Date().toDateString();
                        if (signTime != time) {
                            wx.request({
                                url: 'http://localhost:3000/user/gxsign',
                                method: 'POST',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                    id: res.data,
                                    sign: 0
                                },
                                success: function(resss) {
                                    that.setData({
                                        sign_day: resss.data.data.sign_day
                                    })
                                }
                            })
                        } else {
                            that.setData({
                                sign: ress.data.data.sign_in,
                                sign_day: ress.data.data.sign_day
                            })
                        }
                    }
                })
            }
        })
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