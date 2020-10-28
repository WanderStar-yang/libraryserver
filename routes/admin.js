const express = require('express');
const router = express.Router();
const admin = require('../models/admin')


router.post('/login', function(req, res, next) {
    admin.login(req, res, next);
});
router.get('/info', function(req, res, next) {
    admin.getInfo(req, res, next);
})
router.post('/logout', function(req, res, next) {
    admin.logout(req, res, next);
});
router.post('/uploadavatar', function(req, res, next) {
    admin.uploadAvatar(req, res, next)
})
router.post('/updateinfo', function(req, res, next) {
    admin.updateInfo(req, res, next)
})

module.exports = router;