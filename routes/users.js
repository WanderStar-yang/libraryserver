var express = require('express');
var router = express.Router();
var user = require('../server/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('user api');
});
router.get('/add', function (req, res, next) {
  user.add(req, res, next);
});
router.get('/queryall', function(req, res, next) {
  user.queryAll(req, res, next);
});
router.get('/update', function(req, res, next) {
  user.update(req, res, next);
});
router.get('/delete', function(req, res, next) {
  user.delete(req, res, next);
});

module.exports = router;
