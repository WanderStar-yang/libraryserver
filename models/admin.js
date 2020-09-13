const mysql = require('mysql');
const config = require('./config');
const pool = mysql.createPool(config.mysql);

//Sql语句
const commands = {
    query: "select admin_pwd from admin where admin_username=?"
};

// 导出的方法对象
const admin = {
    /**
     * 管理员登录
     * @returns 返回登录成功与否 True or False
     */
    login: function (req, res, next) {
        var param = req.query || req.params;
        //取出连接
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.query, param.username, function (err, row) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (row[0] && row[0].admin_pwd == param.password)
                            res.json({ code: 200, msg: "login sucess" });
                        else
                            res.json({ code: -1, msg: "invalid username or wrong password" });
                    }
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
}

module.exports = admin;