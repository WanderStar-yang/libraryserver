const mysql = require('mysql');
const config = require('./config');
const pool = mysql.createPool(config.mysql);

//Sql语句
const commands = {
    insert: 'INSERT INTO user(user_id, user_username, user_pwd, user_name, user_age, user_sex)\
            VALUES(0, ?, ?, ?, ?, ?)',
    update: 'update user \
            set user_username = ?, user_pwd = ?, user_name = ?, user_age = ?, user_sex = ? \
            where user_id = ?',
    delete: 'delete from user where user_id=?',
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
                connection.query(commands.insert,
                    [param.username, param.password, param.name, param.age, param.sex],
                    function (err, result) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json({ code: 200, msg: 'user add success' });
                        }
                        // 释放连接 
                        connection.release();
                    }
                );
            }
        });
    },
    // 查询数据
    queryAll: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.queryAll,
                    function (err, result) {
                        if (err)
                            res.send(err);
                        else
                            res.json(result);
                        // 释放连接 
                        connection.release();
                    }
                );
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
                connection.query(commands.update,
                    [param.username, param.password, param.name, param.age, param.sex, +param.id],
                    function (err, result) {
                        if (err)
                            res.send(err);
                        else
                            res.json({ code: 200, msg: 'user update success' });
                        // 释放连接 
                        connection.release();
                    }
                );
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
                        res.json({ code: 200, msg: 'user delete success' });
                    }
                    connection.release();
                });
            }
        });
    }
}

module.exports = user;