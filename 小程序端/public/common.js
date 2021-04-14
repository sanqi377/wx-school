const config = require("./config");
module.exports = {
    request: (options, data) => {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key: 'access_token',
                success: function (res) {
                    data.access_token = res.data;
                    wx.request({
                        url: config.baseUrl + options.url,
                        data: data,
                        method: options.type,
                        success: function (res) {
                            resolve(res);
                        },
                        error: function (err) {
                            reject(err);
                        }
                    })
                },
                fail: function () {
                    wx.request({
                        url: config.baseUrl + options.url,
                        data: data,
                        method: options.type,
                        success: function (res) {
                            resolve(res);
                        },
                        error: function (err) {
                            reject(err);
                        }
                    })
                }
            })
        })
    }
}