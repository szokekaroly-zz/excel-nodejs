'use strict';
$(document).ready(function() {
    $('input').each(function(index, element) {
        var coord = $(element).parent().attr('id');
        element.cell = new Cell(coord);
        element.addEventListener('blur', function(event) {
            this.cell.value = this.value;
            this.cell.send();
        });
    });
});

/**
 * Basic excel cell object
 */
function Cell(coord) {
    var _coord = coord;
    var _col;
    var _row;
    var _value;

    this.getCoord = function() {
        return _coord;
    };

    this.getCol = function() {
        return _col;
    };

    this.getRow = function() {
        return _row;
    };

    this.value = function(value) {
        if (! arguments.length) {
            return _value;
        } else {
            _value = value;
        }
    };

    coord = coord.toUpperCase() || 'A1';
    _col = coord.charCodeAt(0) - 64;
    _row = parseInt(coord.substring(1));
    //console.log(coord, _col, _row);
}

Cell.prototype.send = function() {
    var data = {
        coord: this.getCoord(), 
        value: this.value
    };
    $.post('/api/update', data, function(data) {
        console.log('success ajax response:', data);
    });
};
