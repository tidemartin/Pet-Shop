var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', function(req, res, next) {
    next()
});

module.exports = router;
