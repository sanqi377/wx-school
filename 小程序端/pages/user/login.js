let username = null;
let password = null;
Page({
    username: function (event) {
        username = event.detail.value;
    },

    password: function (event) {
        password = event.detail.value;
    },

    toReg: function () {
        wx.navigateTo({
            url: '/pages/user/reg'
        })
    },

    login: function() {
        if (!username) {
            wx.showToast({
                title: '请输入账号',
                icon: 'error',
                duration: 2000
            })
            return false;
        } else if (!password) {
            wx.showToast({
                title: '请输入密码',
                icon: 'error',
                duration: 2000
            })
            return false;
        }
        wx.getUserProfile({
            desc: '获取用户昵称、头像',
            success: function (res) {
                wx.setStorage({
                    key: 'userinfo',
                    data: res.userInfo,
                    success: function () {
                        wx.request({
                            url: 'http://localhost:3000/user/login',
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                username: username,
                                password: password

                            },
                            success: function (res) {
                                if (res.data.code == 201 || res.data.code == 202) {
                                    wx.showToast({
                                        title: res.data.msg,
                                        icon: 'error'
                                    })
                                    return;
                                }
                                wx.showToast({
                                    title: res.data.msg,
                                    success: function () {
                                        wx.setStorage({
                                            key: 'user_id',
                                            data: res.data.data.user_id,
                                            success: function () {
                                                wx.setStorage({
                                                    key: 'token',
                                                    data: res.data.data.token,
                                                    success: function () {
                                                        wx.reLaunch({
                                                            url: '/pages/index/index',
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
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
        wx.hideHomeButton({
            success: function () {
                console.log("隐藏成功！")
            }
        })
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