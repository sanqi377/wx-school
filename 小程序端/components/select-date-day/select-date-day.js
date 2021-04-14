const date = new Date();
const months = []
const days = []

for (let i = 1; i <= 12; i++) {
    if (i < 10) {
        i = '0' + i
    }
    months.push(i)
}

for (let i = 1; i <= 31; i++) {
    if (i < 10) {
        i = '0' + i
    }
    days.push(i)
}
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        className: null
    },

    /**
     * 组件的初始数据
     */
    data: {
        months,
        days,
        month: date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        value: [date.getMonth(), date.getDate() - 1],
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
                className: this.data.month + "-" + this.data.day,
                animation: this.animation.export(),
            })
            this.triggerEvent('myevent', this.data.month + "-" + this.data.day)
        },
        bindChange(e) {
            const val = e.detail.value;
            val[0] = val[0] + 1;
            if (val[0] < 10) {
                val[0] = '0' + val[0]
            }
            val[1] = val[1] + 1;
            if (val[1] < 10) {
                val[1] = '0' + val[1]
            }
            this.setData({
                month: val[0],
                day: val[1],
                className: val[0] + "-" + val[1]
            })
        }
    }
})