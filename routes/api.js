'use strict';
var express = require('express');
var router = express.Router();

/* GET api version. */
router.get('/', function(req, res, next) {
    res.json({ version: '1.0.0' });
});

module.exports = router;