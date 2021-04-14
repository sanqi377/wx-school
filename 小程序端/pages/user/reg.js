let username = null;
let password = null;
Page({
    username: function (event) {
        username = event.detail.value;
    },

    password: function (event) {
        password = event.detail.value;
    },

    /**
     * 页面的初始数据
     */
    data: {
        actives: 'active',
        activet: null
    },

    actives:function() {
        this.setData({
            actives: 'active',
            activet: null
        })
    },

    activet:function() {
        this.setData({
            actives: null,
            activet: 'active'
        })
    },

    ranknum: function () {
        var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var n = 5,
            s = "";
        for (var i = 0; i < n; i++) {
            var rand = Math.floor(Math.random() * str.length);
            s += str.charAt(rand);
        }
        return s;
    },

    reg: function () {
        if (!username) {
            wx.showToast({
                title: '请输入账号',
                icon: 'error'
            })
            return;
        }
        if (!password) {
            wx.showToast({
                title: '请输入密码',
                icon: 'error'
            })
            return;
        }
        wx.request({
            url: 'http://localhost:3000/user/reg',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                username: username,
                password: password,
                salt: this.ranknum()
            },
            success: function (res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2500,
                    success: function () {
                        wx.reLaunch({
                            url: '/pages/user/login',
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