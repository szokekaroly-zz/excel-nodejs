'use strict';

/**
 * GET version
 * 
 */
function index(req, res, next) {
    res.json({ version: '1.0.0' });
}

/**
 * POST save data to db
 */
function update(req, res, next) {
    var coord = req.body.coord;
    var value = req.body.value;
    var response = {status: 'OK', coord: coord, value: value};
    res.json(response);
}

module.exports = {
    index: index,
    update: update
};