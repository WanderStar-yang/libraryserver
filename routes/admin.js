const express = require('express');
const router = express.Router();
const admin = require('../models/admin')


router.post('/login', function (req, res, next) {
    admin.login(req, res, next);
});


module.exports = router;
