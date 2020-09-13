const express = require('express');
const router = express.Router();
const book = require('../models/book')

/* GET books listing. */
router.get('/', function (req, res, next) {
  res.send('book api');
});
router.get('/add', function (req, res, next) {
  book.add(req, res, next);
});
router.get('/queryall', function(req, res, next) {
  book.queryAll(req, res, next);
});
router.get('/query', function(req, res, next) {
  book.query(req, res, next);
});
router.get('/update', function(req, res, next) {
  book.update(req, res, next);
});
router.get('/delete', function(req, res, next) {
  book.delete(req, res, next);
});

module.exports = router;
