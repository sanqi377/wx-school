const mysql = require('../lib/mysql');
const config = require('../config/config')
class db {
    constructor() {
        this.connection = mysql.createPool({
            host: config.MYSQL.host,
            user: config.MYSQL.user,
            port: config.MYSQL.port,
            password: config.MYSQL.pass,
            database: config.MYSQL.base
        })
        this.common = [{
                message: "服务器出现问题",
                status: 500
            },
            {
                message: "无法访问资源",
                status: 404
            },
        ]
    }

    select(name, tableName, options) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.connection.getConnection(function(err, conn) {
                if (err) {
                    console.log(err)
                    reject(self.common[0])
                } else {
                    if (options) {
                        var sql = `select ${name.toString()} from ${tableName} where ${options} ORDER BY id DESC`;
                    } else {
                        var sql = `select ${name.toString()} from ${tableName} ORDER BY id DESC`;
                    }
                    conn.query(sql, function(err, result) {
                        if (err) {
                            reject(self.common[1])
                        }
                        conn.release()
                        resolve({
                            result
                        })
                    })
                }
            })
        }).catch(err => err)
    }

    insert(tableName, dataOptions, data) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.connection.getConnection(function(err, conn) {
                if (err) {
                    console.log(err)
                    reject(self.common[0])
                } else {
                    let sql = `INSERT INTO ${tableName} (${dataOptions}) VALUES (${data})`
                    conn.query(sql, function(err, result) {
                        if (err) {
                            reject(self.common[1])
                        }
                        conn.release()
                        resolve({
                            result
                        })
                    })
                }
            })
        }).catch(err => err)
    }

    update(tableName, options, data) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.connection.getConnection(function(err, conn) {
                if (err) {
                    console.log(err)
                    reject(self.common[0])
                } else {
                    let sql = `UPDATE ${tableName} SET ${data} WHERE ${options}`;
                    conn.query(sql, function(err, result) {
                        if (err) {
                            reject(self.common[1])
                        }
                        conn.release()
                        resolve({
                            result
                        })
                    })
                }
            })
        }).catch(err => err)
    }

    // 两表联合查询(内连接查询)
    join(leftField, rightField, leftName, RightName, leftWhere, rightWhere) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.connection.getConnection(function(err, conn) {
                if (err) {
                    console.log(err)
                    reject(self.common[0])
                } else {
                    let sql = `select ${leftField},${rightField} from ${leftName} join ${RightName} on ${leftWhere}=${rightWhere} ORDER BY addtime DESC`;
                    conn.query(sql, function(err, result) {
                        if (err) {
                            reject(self.common[1])
                        }
                        conn.release()
                        resolve({
                            result
                        })
                    })
                }
            })
        }).catch(err => err)
    }
}
module.exports = db;