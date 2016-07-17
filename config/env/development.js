'use strict';
var port = process.env.PORT || 3000;
var db = process.env.MONGODB || 'mongodb://localhost/test';

module.exports = {
    port: port,
    db: db
};