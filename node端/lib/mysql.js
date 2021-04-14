const mysql = require("mysql");
const config = require("../config/config");

// 创建 mysql 连接
const connection = mysql.createConnection({
    host: config.MYSQL.host,
    user: config.MYSQL.user,
    port: config.MYSQL.port,
    password: config.MYSQL.pass,
    database: config.MYSQL.base,
});
connection.connect();

// 查询数据
const query = (fields, table, options) => {
    return new Promise((resolve, reject) => {
        var sql = `select ${fields} from ${table} ${options}`;
        connection.query(sql, function (error, results) {
            if (error) reject(error);
            resolve(results[0]);
        });
    });
};

// 新增数据
const insert = (fields, table, values) => {
    return new Promise((resolve, reject) => {
        var sql = `insert into ${table}(${fields}) values(${values})`;
        connection.query(sql, function (error, results) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

// 更新数据
const update = (fields, table, where) => {
    return new Promise((resolve, reject) => {
        var sql = `update ${table} set ${fields} where ${where}`;
        connection.query(sql, function (error, results) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

// 删除数据
const deletes = (table, where) => {
    return new Promise((resolve, reject) => {
        var sql = `delete from ${table} where ${where}`;
        console.log(sql);
        connection.query(sql, function (error, results) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

module.exports = {
    query,
    insert,
    update,
    deletes,
};
