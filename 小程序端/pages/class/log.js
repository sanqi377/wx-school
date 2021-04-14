// pages/class/log.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                name: '全部',
                active: true,
            },
            {
                id: 1,
                name: '待上课',
                active: false,
            },
            {
                id: 2,
                name: '已完成',
                active: false,
            },
            {
                id: 3,
                name: '已取消',
                active: false,
            }
        ],
        content: null,
        defaultContent: null,
        useContent: null,
        reContebt: null
    },

    cancel: function (e) {
        let data = this.data.content
        let id = e.currentTarget.dataset.id;
        this.setData({
            useContent: data
        })
        let useData = this.data.useContent;
        let defaultData = this.data.defaultContent
        defaultData = useData[0]
        useData[0].forEach((val, index) => {
            if (id == val.id) {
                var that = this;
                wx.getStorage({
                    key: 'user_id',
                    success: function (res) {
                        wx.request({
                            url: 'http://localhost:3000/class/setstatus',
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                id: id,
                                user_id: res.data
                            },
                            success: function (res) {
                                console.log(res.data.data)
                                val.status = 0
                                that.setData({
                                    reContebt: val,
                                    defaultData: useData
                                })

                                defaultData.splice(index, 1)
                                that.setData({
                                    defaultContent: defaultData,
                                })
                                useData[3][index].status = 0
                                useData[3].unshift(that.data.reContebt)
                            }
                        })
                    }
                })



            }
        });
    },

    clickTab: function (e) {
        let id = e.target.dataset.id;
        let active = this.data.tabs;

        this.setData({
            defaultContent: null
        })
        for (let i = 0; i < active.length; i++) {
            if (id == active[i].id) {
                active[i].active = true
            } else {
                active[i].active = false
            }
            this.setData({
                tabs: active
            })
        }
        for (let x = 0; x < 4; x++) {
            if (id == x) {
                this.setData({
                    useContent: this.data.content[x]
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getStorage({
            key: 'user_id',
            success: function (res) {
                wx.request({
                    url: 'http://localhost:3000/class/setstatus',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        id: res.data
                    },
                    success: function (res) {
                        console.log(res)
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this;
        wx.getStorage({
            key: 'user_id',
            success: function (res) {
                wx.request({
                    url: 'http://localhost:3000/class/alllog',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        id: res.data
                    },
                    success: function (res) {
                        that.setData({
                            content: res.data.data,
                            defaultContent: res.data.data[0]
                        })
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