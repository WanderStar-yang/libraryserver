const express = require('express');
const router = express.Router();
const user = require('../models/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('user api');
});

router.get('/queryall', function (req, res, next) {
  user.queryAll(req, res, next);
});
router.get('/update', function (req, res, next) {
  user.update(req, res, next);
});
router.get('/delete', function (req, res, next) {
  user.delete(req, res, next);
});
router.post('/register', function (req, res, next) {
  user.register(req, res, next);
});
router.post('/login', function (req, res, next) {
  user.login(req, res, next);
});

module.exports = router;
