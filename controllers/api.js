'use strict';

/**
 * GET version
 * 
 */
function index(req, res, next) {
    res.json({ version: '1.0.0' });
}

function update(req, res, next) {
    res.json({ status: 'OK'});
}

module.exports = {
    index: index,
    update: update
};