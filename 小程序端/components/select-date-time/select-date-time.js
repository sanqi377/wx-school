const date = new Date();
const hours = []
const branchs = []

for (let i = 0; i <= 24; i++) {
    if (i < 10) {
        i = '0' + i
    }
    hours.push(i)
}

for (let i = 0; i < 60; i++) {
    if (i < 10) {
        i = '0' + i
    }
    branchs.push(i)
}
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cmtHour: null,
        cmtBranch: null,
        className: null
    },

    /**
     * 组件的初始数据
     */
    data: {
        hours,
        branchs,
        hour: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        branch: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        value: [date.getHours(), date.getMinutes()],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSelect() {
            // 开启动画效果
            this.animation = wx.createAnimation()
            this.animation.translateY('-500rpx').step()
            this.setData({
                animation: this.animation.export(),
            })
        },
        hideSelect() {
            // 取消动画效果
            this.animation = wx.createAnimation()
            this.animation.translateY('500rpx').step()
            this.setData({
                animation: this.animation.export(),
            })
        },
        showSelect() {
            // 确认动画效果
            this.animation = wx.createAnimation()
            this.animation.translateY('500rpx').step()
            this.setData({
                className: this.data.hour + ":" + this.data.branch,
                animation: this.animation.export(),
            })
            this.triggerEvent('myevent', this.data.hour + ":" + this.data.branch)
        },
        bindChange(e) {
            const val = e.detail.value;
            if (val[0] < 10) {
                val[0] = '0' + val[0]
            }
            if (val[1] < 10) {
                val[1] = '0' + val[1]
            }
            this.setData({
                hour: val[0],
                branch: val[1],
                cmtHour: val[0],
                cmtBranch: val[1],
                className: (val[0]) + ":" + val[1]
            })
        }
    }
})