'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CellSchema = new Schema({
    Row: 'String',
    Col: 'String',
    Value: 'String'
});

var CellModel = mongoose.model('Cell', CellSchema);

module.exports = {
    CellSchema: CellSchema,
    CellModel: CellModel
};