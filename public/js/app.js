'use strict';
$(document).ready(function() {
    var cell = new Cell(1,1,'alma');
    cell.Value('körte');
});

var Cell = function(row, col, value) {
    var _row;
    var _col;
    var _value;
    var _coord;

    var self = this;

    function _propRow(newRow) {
        if (typeof newRow === 'undefined') {
            return _row;
        } else {
            if (typeof newRow !== 'number'  || newRow < 1) {
                _row = 1;
            } else {
                if (_row > 26) {
                    _row = 26;
                } else {
                    _row = newRow;
                    self.send(_row);
                }
            }
            _setCoord();
        }
    }
    function _propCol(newCol) {
        if (typeof newCol === 'undefined') {
            return _col;
        } else {
            if (typeof newCol !== 'number'  || newCol < 1) {
                _col = 1;
            } else {
                if (_col > 26) {
                    _col = 26;
                } else {
                    _col = newCol;
                    self.send(_col);
                }
            }
            _setCoord();
        }
    }

    function _setCoord() {
        if (_col && _row) {
            _coord = '' + String.fromCharCode(64 + _col) + _row;
        }
    }
    
    this.getCoord = function() {
        return _coord;
    }

    this.Value = function(newValue) {
        if (typeof newValue === 'undefined') {
            return _value;
        } else {
            _value = newValue;
            this.send(_value);
        }
    };

    return this;
};

Cell.prototype.send = function(data) {
    console.log(data);
};
