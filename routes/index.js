'use strict';
var express = require('express');
var router = express.Router();

/* Routes */
var api = require('./api');

/* Controllers */
var controller = require('../controllers/');

/* GET home page. */
router.get('/', controller.index);

/* API routes */
router.use('/api', api);

module.exports = router;
