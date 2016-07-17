'use strict';

function index(req, res, next) {
    res.json({ version: '1.0.0' });
}

function getAllCells(req, res, next) {
    res.json({status: 'OK', cells: [{col: 1, row: 2, value: 'alma'}]});
}

module.exports = {
    index: index,
    getAllCells: getAllCells
};