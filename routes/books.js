const express = require('express');
const router = express.Router();
const book = require('../models/book')

/* GET books listing. */
router.get('/', function (req, res, next) {
  res.send('book api');
});
 router.get('/queryall', function (req, res, next) {
  book.queryAll(req, res, next);
});
router.get('/query', function (req, res, next) {
  book.query(req, res, next);
});
router.post('/add', function (req, res, next) {
  book.add(req, res, next);
});
router.post('/update', function (req, res, next) {
  book.update(req, res, next);
});
router.post('/delete', function (req, res, next) {
  book.delete(req, res, next);
});

module.exports = router;