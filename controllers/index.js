'use strict';
var Excel = require('../models/excel').ExcelModel;

function createHeader(maxCol) {
    var result = [];
    for (var i = 0; i < maxCol; i++) {
        result.push(String.fromCharCode(i + 65));
    }
    return result;
}

function createRows(maxRow) {
    var result = [];
    for (var i = 0; i < maxRow; i++) {
        result.push(i + 1);
    }
    return result;
}

/**
 * @description GET index page
 */
function index(req, res, next) {
    Excel.find({}, function(err, excel) {
        if (err) {
            return res.status(500).send(err);
        }
        if (excel.length === 0) {
            var ex = new Excel({
                MaxCol: 10,
                MaxRow: 10,
                Cells: []
            });
            ex.save(function(err, excel) {
                var header = createHeader(excel[0].MaxCols);
                return res.render('index', { title: 'Excel on web', header: header, excel: excel[0], settings : {maxCol: excel[0].MaxCol, maxRow: excel[0].MaxRow} });
            });
        } else {
            var header = createHeader(excel[0].MaxCol);
            res.render('index', { title: 'Excel on web', header: header, excel: excel[0], settings : {maxCol: excel[0].MaxCol, maxRow: excel[0].MaxRow} });
        }
    });
}

module.exports = {
    index: index
}