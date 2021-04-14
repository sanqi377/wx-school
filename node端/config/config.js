const config = {
    WX:{
        // 不用验证 token 的路由
        freeCheck: [
            "/user/login",
            "/user/reg"
        ]
    },
    MYSQL: {
        host: "localhost",
        user: "root",
        pass: "root",
        base: "wx",
        port: 3306,
    },
    EXPRESS: {
        port: 3000,
    },
};

module.exports = config;
