const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const adminRouter = require('./routes/admin');

const app = express();

// 设置模板引擎

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//允许前端 跨域请求
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  //res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

// 设置中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/books', booksRouter);

// 404处理
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
const port = 3000;
app.listen(port, function () {
  console.log(`服务器运行在 http://localhost:${port}`)
})
