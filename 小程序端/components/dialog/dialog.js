Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cancle: {
            type: String,
            value: "取消"
        },
        enter: {
            type: String,
            value: "确认"
        },
        title: {
            type: String,
            value: "标题"
        },
        content: {
            type: String,
            value: "内容"
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        isShow: true,
        id: null,
        classData: null,
        windowWidth: '',
        windowHeight: '',
        bodyHeight: '',
        classHeight: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        show(id, user_id, classData) {
            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    var query = wx.createSelectorQuery();
                    query.select('#container').boundingClientRect(function (rect) {
                        that.setData({
                            bodyHeight: rect.height,
                            windowHeight: Math.abs(rect.top),
                            classHeight: res.windowHeight,
                            windowWidth: res.windowWidth,
                            isShow: !that.data.isShow,
                            id: id,
                            user_id: user_id,
                            classData: classData
                        })
                    }).exec();

                },
            })
        },
        cancle() {
            this.setData({
                isShow: !this.data.isShow
            })
        },
        enter() {
            var that = this;
            wx.request({
                url: 'http://localhost:3000/class/addclass',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: that.data.id,
                    user_id: that.data.user_id,
                },
                success: function (res) {
                    that.setData({
                        isShow: !that.data.isShow,
                    })
                    var classData = that.data.classData
                    var classId = that.data.id
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: res.data.msg,
                            success: function () {
                                for (var i = 0; i < classData.length; i++) {

                                    if (classId == classData[i].id) {
                                        classData[i].class_is = 1
                                        classData[i].class_pnum = classData[i].class_pnum + 1
                                    }
                                }
                                that.triggerEvent('enter', classData);
                            }
                        })
                    } else if (res.data.code == 201) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'error',
                            success: function () {
                                // for (var i = 0; i < classData.length; i++) {
                                //     if (classId == classData[i].id) {
                                //         if (classData[i].class_num <= classData[i].class_pnum) {
                                //             classData[i].status = 2
                                //         } else {
                                //             classData[i].class_is = 1
                                //             classData[i].class_pnum = classData[i].class_pnum + 1
                                //         }
                                //     }
                                // }
                                that.triggerEvent('enter', classData);
                            }
                        })
                    }
                }
            })
        }
    }
})