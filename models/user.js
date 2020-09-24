const mysql = require('mysql');
const config = require('../config');
const pool = mysql.createPool(config.mysql);
const bcrypt = require('bcryptjs');;
const salt = bcrypt.genSaltSync(10);

//Sql语句
const commands = {
    insert: 'INSERT INTO user(user_id, user_username, user_pwd, user_name, user_age, user_sex, user_identityno, user_credit, user_depart)\
            VALUES(0, ?, ?, ?, ?, ?, ?, ?, ?)',
    update: 'update user \
            set user_username = ?, user_pwd = ?, user_name = ?, user_age = ?, user_sex = ? \
            where user_id = ?',
    delete: 'delete from user where user_id=?',
    queryAll: 'select * from user',
    query: "select * from user where user_username=?"
};

// 导出的方法对象
const user = {
    /**
     * 用户登录
     * @res 返回登录成功与否的消息
     */
    login: function(req, res, next) {
        var param = req.query || req.params;
        //取出连接
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.query, param.username, function(err, row) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (row[0] && bcrypt.compareSync(param.password, row[0].user_pwd)) {
                            res.cookie("account", { data: row[0], last: new Date().getTime() }, { maxAge: 5 * 60 * 1000 });
                            res.json({ code: 200, msg: "LOGIN SUCESS" });
                            console.log(req.cookies["account"]);
                        } else {
                            res.json({ code: -1, msg: "INVALID USERNAME OR WRONG PASSWORD" });
                        }
                    }
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    /**
     * 用户注册
     * @res 返回注册成功与否的消息
     */
    register: function(req, res, next) {
        var param = req.query || req.params;
        //取出连接
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.query, param.username, function(err, row) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (row.length > 0) {
                            res.json({ code: 400, msg: `USER ${param.username} EXIST` });
                            connection.release();
                            return;
                        }
                        var hash = bcrypt.hashSync(param.password, salt);
                        connection.query(commands.insert, [param.username, hash, param.name, param.age, param.sex, param.idno, param.credit, param.depart],
                            function(err, result) {
                                if (err) {
                                    res.json({ code: 400, msg: err.code });
                                } else {
                                    res.json({ code: 200, msg: `USER ${param.username} REGISTER SUCCESS` });
                                }
                                // 释放连接 
                                connection.release();
                            }
                        );

                    }
                    // 释放连接 

                });

            }
        });
    },
    /**
     * 查询全部用户信息
     */
    queryAll: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.queryAll,
                    function(err, result) {
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
    /**
     * 更改用户数据
     */
    update: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var param = req.query || req.params;
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.update, [param.username, param.password, param.name, param.age, param.sex, +param.id],
                    function(err, result) {
                        if (err)
                            res.send(err);
                        else
                            res.json({ code: 200, msg: 'USER UPDATE SUCCESS' });
                        // 释放连接 
                        connection.release();
                    }
                );
            }
        });
    },
    /**
     * 删除用户数据
     */
    delete: function(req, res, next) {
        pool.getConnection(function(err, connection) {
            var id = +req.query.id;
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.delete, id, function(err, result) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({ code: 200, msg: 'USER DELETE SUCCESS' });
                    }
                    connection.release();
                });
            }
        });
    }
}

module.exports = user;