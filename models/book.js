const mysql = require('mysql');
const config = require('../config');
const pool = mysql.createPool(config.mysql);

//Sql语句
const commands = {
    insert: 'INSERT INTO books(book_no, book_title, book_isbn, book_author, book_pub, book_class) \
            VALUES(0, ?, ?, ?, ?, ?)',
    update: 'update books \
            set book_no=?, book_title=?, book_isbn=?, book_author=?, book_pub=?, book_class=?\
            where id=?',
    delete: 'delete from books where id=?',
    queryAll: 'select * from books',
    query: 'select * from books '
};

// 导出的方法对象
const book = {
    /**
     * 添加书籍信息
     */
    add: function (req, res, next) {
        let param = req.query || req.params;
        //取出连接
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.insert,
                    [param.name, param.isbn, param.author, param.pub, param.class],
                    function (err, rows) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json({ code: 200, msg: 'BOOK ADD SUCCESS' });
                        }
                        // 释放连接 
                        connection.release();
                    });
            }
        });
    },
    /**
     * 通过param查询书籍信息
     */
    query: function (req, res, next) {
        let param = req.query || req.params;
        let mode = "title"
        for (let i in param) {
            mode = i
        }
        let commandQuery = commands.query + `where book_${mode}=?`;
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commandQuery, param[mode], function (err, rows) {
                    if (err)
                        res.send(err);
                    else
                        res.json(rows);
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    /**
     * 查询全部书籍信息
     */
    queryAll: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.queryAll, function (err, rows) {
                    if (err)
                        res.send(err);
                    else
                        res.json(rows);
                    // 释放连接 
                    connection.release();
                });
            }
        });
    },
    /**
     * 更改数据
     */
    update: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            let param = req.query || req.params;
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.update,
                    [param.name, param.isbn, param.author, param.pub, param.class, +param.id],
                    function (err, rows) {
                        if (err)
                            res.send(err);
                        else
                            res.json({ code: 200, msg: 'BOOK UPDATE SUCCESS' });
                        // 释放连接 
                        connection.release();
                    });
            }
        });
    },
    /**
     * 删除数据
     */
    delete: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            let id = +req.query.id;
            if (err) {
                console.log("数据库连接失败")
            } else {
                connection.query(commands.delete, id, function (err, rows) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({ code: 200, msg: 'BOOK DELETE SUCCESS' });
                    }
                    connection.release();
                });
            }
        });
    }
}

module.exports = book;