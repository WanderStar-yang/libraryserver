const mysql = require('mysql');
const config = require('./config');
const pool = mysql.createPool(config.mysql);

//Sql语句
const commands = {
    insert: 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
    update: 'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    queryAll: 'select * from user'
};

// 导出的方法对象
const user = {
    // 增加数据
    add: function (req, res, next) {
        var param = req.query || req.params;
        //取出连接
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.insert, [param.name, param.age], function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('add success');
                    }
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    // 查询数据
    queryAll: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.queryAll, function (err, result) {
                    if (err)
                        res.send(err);
                    else
                        res.send(result);
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    // 更改数据
    update: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var param = req.query || req.params;
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.update, [param.name, param.age, +param.id], function (err, result) {
                    if (err)
                        res.send(err);
                    else
                        res.send('update success');
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    // 删除数据
    delete: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            var id = +req.query.id;
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.delete, id, function (err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('delete success');
                    }
                    connection.release();
                });
            }
        });
    }
}

module.exports = user;