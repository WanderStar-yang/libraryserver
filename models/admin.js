const mysql = require('mysql');
const config = require('../config');
const pool = mysql.createPool(config.mysql);
const utils = require('../utils')
const fs = require('fs')

//Sql语句
const commands = {
    login: "select password from admin where username = ?",
    queryByToken: "select * from admin where token = ?",

    updateLastLogin: "update admin set token = ?,lastLoginIp = ?,lastLoginTime = ? where username = ?",



    updatePassword: "update admin set password = ? where token = ?",
    updateInfo: "update admin set name = ?, sex = ?, email = ?, introduction = ? where token = ?",
    updateAvatar: "update admin set avatar = ? where token = ?",
};

// 导出的方法对象
const admin = {
    /**
     * 管理员登录
     * @res 返回登录成功与否的消息
     */
    login: function(req, res, next) {
        const param = req.body || req.query || req.params;

        //取出连接
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.login, param.username, function(err, row) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (row[0] && row[0].password == param.password) {
                            let token = utils.token();
                            let ip = req.headers['x-forwarded-for'] ||
                                req.ip ||
                                req.connection.remoteAddress ||
                                req.socket.remoteAddress ||
                                req.connection.socket.remoteAddress || '';
                            connection.query(commands.updateLastLogin, [token, ip, Date.now(), param.username]);
                            res.json(utils.builder({ 'token': token }, "", 200));
                        } else
                            res.json(401, utils.builder({ isLogin: true }, '账户或密码错误', 401));

                    }
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    /**
     * 获得管理员信息
     */
    getInfo: function(req, res, next) {
        const token = req.get('access-token');
        //取出连接
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.queryByToken, token, function(err, row) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (row[0]) {
                            res.json(utils.builder(JSON.parse(JSON.stringify(row[0])), "", 200));
                        } else
                            res.status(401).json(utils.builder({ isLogin: true }, "没有信息", 401));
                    }
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    /**
     * 登出
     */
    logout: function(req, res, next) {
        res.json('logout');
    },
    /**
     * 上头像并存入数据库
     */
    uploadAvatar: function(req, res, next) {
        const token = req.get('access-token');
        if (req.files != [] && req.files != undefined) {
            for (let i = 0; i < req.files.length; i++) {
                let oldPath = req.files[i].path;
                let newFileName = req.files[i].filename;
                console.log(req.files[i]);
                //存入数据库
                pool.getConnection(function(err, connection) {
                    if (err) {
                        console.log("数据库连接失败")
                    } else {
                        connection.query(commands.queryByToken, token, function(err, row) {
                            if (!err) {
                                if (row[0]) {
                                    fs.unlinkSync('uploads\\avatar\\' + row[0].avatar, function() { err })
                                }
                            }
                        });
                        connection.query(commands.updateAvatar, [newFileName + ".jpg", token], function(err, row) {
                            if (err) {
                                res.send(err);
                            } else {
                                fs.rename(oldPath, 'uploads\\avatar\\' + newFileName + ".jpg", function(err) {
                                    if (!err) {
                                        res.json(utils.builder({ url: newFileName + ".jpg", status: 'done' }, "", 200))
                                    } else {
                                        res.status(401).json(utils.builder({}, "上传失败", 401));
                                    }
                                })
                            }
                            // 释放连接 
                            connection.release();
                        });
                    }
                });


            }
        } else {
            res.send('上传的文件为空！');
        }

    },
    /**
     * 修改简介
     */
    updateInfo: function(req, res, next) {
        const param = req.body || req.query || req.params;
        const token = req.get('access-token');
        //取出连接
        pool.getConnection(function(err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.updateInfo, [param.name, param.sex, param.email, param.introduction, token],
                    function(err, row) {
                        if (err) {
                            res.send(err);
                        } else {
                            if (row.affectedRows == 1) {
                                res.json(utils.builder({ status: 'done' }, "修改成功", 200));
                            } else
                                res.status(401).json(utils.builder({}, '修改失败', 401));
                        }
                        // 释放连接 
                        connection.release();
                    });
            }
        });
    },


}

module.exports = admin;