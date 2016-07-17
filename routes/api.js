'use strict';
var express = require('express');
var router = express.Router();
var controller = require('../controllers/api');

/* GET api version. */
router.get('/', controller.index);

router.get('/getAllCells', controller.getAllCells);

module.exports = router;
