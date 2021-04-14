const db = require("../lib/mysql");
const md5 = require("md5-node");

module.exports = {
    // 登录
    loginUser: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`*`, `wx_users`, `where username="${data.username}"`).then(
                (res) => {
                    if (!res) resolve({ code: 201, msg: "用户不存在" });
                    if (md5(data.password + res.salt) == res.password) {
                        var access_token = md5(res.password + res.salt);
                        resolve({
                            code: 200,
                            msg: "登录成功",
                            data: {
                                user_id: res.id,
                                access_token: access_token,
                            },
                        });
                    } else {
                        resolve({ code: 201, msg: "密码错误" });
                    }
                }
            );
        });
    },

    // 注册
    regUser: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`*`, `wx_users`, `where username="${data.username}"`).then(
                (res) => {
                    if (res) resolve({ code: 201, msg: "用户已存在" });
                    var str =
                        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    var n = 5,
                        s = "";
                    for (var i = 0; i < n; i++) {
                        var rand = Math.floor(Math.random() * str.length);
                        s += str.charAt(rand);
                    }
                    let salt = s;
                    let password = md5(data.password + salt);
                    db.insert(
                        `username,password,salt`,
                        `wx_users`,
                        `"${data.username}","${password}","${salt}"`
                    ).then(() => {
                        resolve({ code: 200, msg: "注册成功" });
                    });
                }
            );
        });
    },
};
