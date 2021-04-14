// pages/class/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classList: [],
        content: "12312312"
    },

    showClass: function (e) {
        var that = this;
        wx.getStorage({
            key: 'user_id',
            success: function(res) {
                let id = e.currentTarget.dataset.id;
                let user_id = res.data
                let classList = that.data.classList
                that.dialog.show(id,user_id,classList)
            }
        })
    },

    enter: function(event) {
        this.setData({
            classList: Array.from(event.detail),
            success: function(res) {
                console.log(1)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: 'user_id',
            success: function (res) {
                wx.request({
                    url: 'http://localhost:3000/class/list',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        id: res.data
                    },
                    success: function (res) {
                        that.setData({
                            classList: res.data.data
                        })
                    }
                })
            }
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.dialog = this.selectComponent('#dialog');
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