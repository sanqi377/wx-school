// 引入 express 模块
const express = require('express');

// 初始化模块
const app = express();

// 中间件设置返回数据格式
app.use(express.urlencoded({
    extended: true
}));

// 配置监听端口
app.listen(3000);

// 导出模块
module.exports = app;