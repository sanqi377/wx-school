const server = require("../lib/server");
const mysql = require("../model/User");
const md5 = require("md5-node");
const db = new mysql();

// 登陆接口
server.post("/user/login", async (req, res) => {
    let data = req.body;
    let where = "username='" + data.username + "'";
    let dataBase = await db.select(
        "id,username,password,salt",
        "wx_users",
        where
    );
    dataBase = dataBase.result[0];
    if (dataBase.username) {
        if (md5(data.password + dataBase.salt) == dataBase.password) {
            var token = md5(dataBase.id + dataBase.salt);
            res.send({
                code: 200,
                msg: "登陆成功",
                data: { user_id: dataBase.id, token: token },
            });
        } else {
            res.send({ code: 202, msg: "密码错误" });
        }
    } else {
        res.send({ code: 201, msg: "用户不存在" });
    }
});

// 注册接口
server.post("/user/reg", async (req, res) => {
    let data = req.body;
    let dataOptions = "username,password,salt";
    data.password = md5(data.password + data.salt);
    let dataValue = `"${data.username}","${data.password}","${data.salt}"`;
    let where = "username='" + data.username + "'";
    let selectData = await db.select("username", "wx_users", where);
    if (!selectData.result[0]) {
        await db.insert("wx_users", dataOptions, dataValue);
        res.send({ code: 200, msg: "注册成功" });
    } else {
        res.send({ code: 200, msg: "用户名重复，请换一个" });
    }
});

// 签到接口
server.post("/user/sign", async (req, res) => {
    let data = req.body;
    let where = "id=" + data.id;
    let dataBase = await db.select(
        "id,sign_in,sign_day,sign_time",
        "wx_users",
        where
    );
    dataBase = dataBase.result[0];
    var update =
        "sign_in=" +
        data.sign_in +
        ",sign_time=" +
        parseInt(data.sign_time / 1000) +
        ",sign_day=" +
        parseInt(dataBase.sign_day + 1);
    await db.update("wx_users", where, update);
    var dataValue = `${dataBase.id},${Date.parse(new Date()) / 1000}`;
    await db.insert("wx_sign_log", "user_id,addtime", dataValue);
    res.send({
        code: 200,
        msg: "签到成功",
        data: {
            sign: 1,
            sign_time: dataBase.sign_time,
            sign_day: parseInt(dataBase.sign_day + 1),
        },
    });
});

// 签到记录接口
server.post("/user/sign-log", async (req, res) => {
    let data = req.body;
    let where = "user_id=" + data.id;
    let dataBase = await db.select("user_id,addtime", "wx_sign_log", where);
    dataBase = dataBase.result;
    for (var i = 0; i < dataBase.length; i++) {
        dataBase[i].addtime = timestampToTime(dataBase[i].addtime);
    }
    res.send({ code: 200, msg: "获取成功", data: dataBase });
});

// 更新签到接口
server.post("/user/gxsign", async (req, res) => {
    let data = req.body;
    let where = "id=" + data.id;
    let dataBase = await db.select(
        "sign_in,sign_day,sign_time",
        "wx_users",
        where
    );
    dataBase = dataBase.result[0];
    if (data.sign) {
        var update = "sign_in=0";
        await db.update("wx_users", where, update);
        console.log("这货没签到");
    }
    console.log("这货签到了");
    res.send({ code: 200, msg: "更新成功", data: dataBase });
});

// 课程列表
server.post("/class/list", async (req, res) => {
    let data = req.body;
    let dataBase = await db.select("*", "wx_class");
    dataBase = dataBase.result;
    var num = [];
    var isNo = [];
    for (var i = 0; i < dataBase.length; i++) {
        // 获取课程数据时判断课程是否到期，到期则从数组删除
        for (var x = i; x < dataBase.length; x++) {
            if (dataBase[x].class_end < new Date().getTime() / 1000) {
                dataBase.splice(x, 1);
                x = x - 1;
            }
        }
        // 时间戳转日期格式
        dataBase[i].class_start = timestampToTime_day(dataBase[i].class_start);
        dataBase[i].class_end = timestampToTime_day(dataBase[i].class_end);

        // 判断此课用户是否已经选择
        num = await db.select(
            "*",
            "wx_class_log",
            `class_id = ${dataBase[i].id}`
        );
        isNo = await db.select(
            "*",
            "wx_class_log",
            `user_id = ${data.id} and class_id=${dataBase[i].id}`
        );
        dataBase[i].class_pnum = num.result.length;

        // 判断人数是否够了，够了就改变状态
        if (dataBase[i].class_num <= dataBase[i].class_pnum) {
            await db.update(
                "wx_class",
                "id=" + dataBase[i].id,
                "class_status=2"
            );
        } else {
            await db.update(
                "wx_class",
                "id=" + dataBase[i].id,
                "class_status=1"
            );
        }

        if (isNo.result[0]) {
            dataBase[i].class_is = 1;
        } else {
            dataBase[i].class_is = 0;
        }
    }
    res.send({ code: 200, msg: "获取成功", data: dataBase });
});

// 添加课程
server.post("/class/add", async (req, res) => {
    let data = req.body;
    let dataOptions =
        "class_name,class_teacher,class_room,class_num,class_day,class_start,class_end";
    let dataValue = `"${data.classname}","${data.classteacher}","${data.classroom}","${data.classnum}","${data.classday}","${data.classstart}","${data.classend}"`;
    await db.insert("wx_class", dataOptions, dataValue);
    res.send({ code: 200, msg: "添加成功" });
});

// 加入课程
server.post("/class/addclass", async (req, res) => {
    let data = req.body;

    // 查询课程可允许多少学生
    let classData = await db.select("*", "wx_class", `id = ${data.id}`);
    let classNum = classData.result[0].class_num;

    // 查询课程已报名多少学生
    let isClass = await db.select("*", "wx_class_log", `class_id = ${data.id}`);
    let isNum = isClass.result.length;

    if (classNum <= isNum) {
        res.send({ code: 201, msg: "该课已满" });
    } else {
        let dataOptions = "user_id,class_id,status,addtime";
        let dataValue = `"${data.user_id}","${data.id}",1,${parseInt(
            new Date().getTime() / 1000
        )}`;
        await db.insert("wx_class_log", dataOptions, dataValue);
        res.send({ code: 200, msg: "成功" });
    }
});

// 用户所有课程内容
server.post("/class/alllog", async (req, res) => {
    let data = req.body;
    let leftField = `a.addtime,a.status,a.user_id`;
    let rightField = `b.id,b.class_name,b.class_teacher,class_room`;

    // 所有数据
    let dataBase = await db.join(
        leftField,
        rightField,
        "wx_class_log a",
        "wx_class b",
        `a.class_id`,
        `b.id`
    );
    dataBase = dataBase.result;
    for (var i = 0; i < dataBase.length; i++) {
        dataBase[i].addtime = timestampToTime(dataBase[i].addtime);
        if (dataBase[i].user_id != data.id) {
            dataBase.splice(i, 1);
            i = i - 1;
        }
    }

    // 待上课数据
    let dataWait = await db.join(
        leftField,
        rightField,
        "wx_class_log a",
        "wx_class b",
        `a.class_id`,
        `b.id`
    );
    dataWait = dataWait.result;
    for (var i = 0; i < dataWait.length; i++) {
        dataWait[i].addtime = timestampToTime(dataWait[i].addtime);
        if (dataWait[i].user_id != data.id) {
            dataWait.splice(i, 1);
            i = i - 1;
        } else {
            if (dataWait[i].status == 2) {
                console.log("有待上课数据");
            } else {
                dataWait.splice(i, 1);
                i = i - 1;
            }
        }
    }

    // 已完成数据
    let dataComplete = await db.join(
        leftField,
        rightField,
        "wx_class_log a",
        "wx_class b",
        `a.class_id`,
        `b.id`
    );
    dataComplete = dataComplete.result;
    for (var i = 0; i < dataComplete.length; i++) {
        dataComplete[i].addtime = timestampToTime(dataComplete[i].addtime);
        if (dataComplete[i].user_id != data.id) {
            dataComplete.splice(i, 1);
            i = i - 1;
        } else {
            if (dataComplete[i].status == 3) {
                console.log("有已完成数据");
            } else {
                dataComplete.splice(i, 1);
                i = i - 1;
            }
        }
    }

    // 已取消数据
    let dataCancel = await db.join(
        leftField,
        rightField,
        "wx_class_log a",
        "wx_class b",
        `a.class_id`,
        `b.id`
    );
    dataCancel = dataCancel.result;
    for (var i = 0; i < dataCancel.length; i++) {
        dataCancel[i].addtime = timestampToTime(dataCancel[i].addtime);
        if (dataCancel[i].user_id != data.id) {
            dataCancel.splice(i, 1);
            i = i - 1;
        } else {
            if (dataCancel[i].status == 0) {
                console.log("有已取消数据");
            } else {
                dataCancel.splice(i, 1);
                i = i - 1;
            }
        }
    }
    res.send({
        code: 200,
        msg: "获取成功",
        data: { 0: dataBase, 1: dataWait, 2: dataComplete, 3: dataCancel },
    });
});

// 更改已选课程状态
server.post("/class/setstatus", async (req, res) => {
    var data = req.body;
    if (!data.user_id) {
        var dataBase = await db.select(
            "*",
            "wx_class_log",
            `user_id = ${data.id}`
        );
        for (let i = 0; i < dataBase.result.length; i++) {
            if (
                dataBase.result[i].status == 1 ||
                dataBase.result[i].status == 2
            ) {
                if (dataBase.result[i].status == 1) {
                    let dataValue = await db.select(
                        "*",
                        "wx_class",
                        `id = ${dataBase.result[i].class_id}`
                    );
                    let time = new Date().getTime() / 1000;
                    if (dataValue.result[0].class_start - time <= 3600) {
                        await db.update(
                            "wx_class_log",
                            "id=" + dataBase.result[i].id,
                            "status=2"
                        );
                    }
                } else if (dataBase.result[i].status == 2) {
                    let dataValue = await db.select(
                        "*",
                        "wx_class",
                        `id = ${dataBase.result[i].class_id}`
                    );
                    let time = new Date().getTime() / 1000;
                    if (time > dataValue.result[0].class_end) {
                        await db.update(
                            "wx_class_log",
                            "id=" + dataBase.result[i].id,
                            "status=3"
                        );
                    }
                }
            }
        }
    } else {
        var dataBase = await db.select(
            "*",
            "wx_class_log",
            `class_id = ${data.id} and user_id = ${data.user_id}`
        );
        await db.update(
            "wx_class_log",
            "id=" + dataBase.result[0].id,
            "status=0"
        );
    }
    res.send({ code: 200, msg: "更新成功" });
});

// 查询课表
server.post("/class/biao", async (req, res) => {
    let dataBase = await db.select("*", "wx_classb");
    var week = "7123456".charAt(new Date().getDay());
    var dataValue = [];
    for (let i = 0; i < dataBase.result.length; i++) {
        if (dataBase.result[i].class_week == week) {
            dataValue.push(dataBase.result[i]);
        }
    }
    res.send({ code: 200, data: dataValue });
});

// 普通时间戳转日期
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + "-";
    var M =
        (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
    var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

// 截取日期
function timestampToTime_day(timestamp) {
    var date = new Date(timestamp * 1000);
    var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return h + m;
}
