var express = require('express');
var router = express.Router();
var admin = require('../server/admin')


router.post('/login', function (req, res, next) {
    admin.login(req, res, next);
});


module.exports = router;
