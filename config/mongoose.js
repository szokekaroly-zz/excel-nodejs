'use strict';
var config = require('./config');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/**
 * @description Initialize mongoose models
 */
function initModels() {

}

/**
 * @description Initialize mongodb
 */
function init() {
    var db = mongoose.connect(config.db, function(err) {
        if (err) {
            throw err;
        }
        console.log('Successfully connected');
    });

    initModels();
    
    return db;
};

module.exports = init;