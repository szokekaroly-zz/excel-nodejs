'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CellSchema = require('./cells').CellSchema;

var ExcelSchema = new Schema({
    MaxCol: "Number",
    MaxRow: "Number",
    Cells: [CellSchema]
});

var ExcelModel = mongoose.model('Excel', ExcelSchema);

module.exports = {
    ExcelSchema: ExcelSchema,
    ExcelModel: ExcelModel
}