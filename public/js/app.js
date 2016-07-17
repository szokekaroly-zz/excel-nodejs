//objects
var excel;
var settings;

//document loaded
$(document).ready(function () {
    excel = excelFactory(settings);     //create object
    //cursor keys, tab and enter
    $(document).keydown(function (event) {
        switch (event.keyCode) {
            case 9 :
                excel.endEditSelected(excel.nextCol);
                event.preventDefault();
                break;
            case 13:
                excel.endEditSelected(excel.nextRow);
                event.preventDefault();
                break;
            case 27:
                excel.cancelEditSelected();
                break;
            case 37:
                if (!excel.isEditMode()) {
                    excel.prevCol();
                    event.preventDefault();
                }
                break;
            case 38:
                if (!excel.isEditMode()) {
                    excel.prevRow();
                    event.preventDefault();
                }
                break;
            case 39:
                if (!excel.isEditMode()) {
                    excel.nextCol();
                    event.preventDefault();
                }
                break;
            case 40:
                if (!excel.isEditMode()) {
                    excel.nextRow();
                    event.preventDefault();
                }
                break;
        }
    }).keypress(function (event) {
        if (event.charCode && !excel.isEditMode()) {
            excel.editSelected(event.key);
        }
    });
    $('#A1').addClass('selected');  //selected cell: A1
    $('.rows').click(excel.selectRow);  //select row
    $('.cols').click(excel.selectCol);  //select col
    $('#add-col').click(excel.addCol);  //add column button
    $('#add-row').click(excel.addRow);  //add row button
    //initialize all cell's values with ajax
    $.get('/api/getAllCells', function (resp) {
        console.log(resp);
        try {
            var cells = resp;
            if (cells.status === 'OK') {
                cells = cells.cells;
                for (var i = 0; i < cells.length; i++) {
                    var selector = '.col_' + cells[i].col + '.row_' + cells[i].row;
                    $(selector).html(cells[i].value);
                    //align when value is number
                    if (!isNaN(cells[i].value) && isFinite(cells[i].value)) {
                        $(selector).addClass('right');
                    } else {
                        $(selector).removeClass('right');
                    }
                }
            } else {
                throw cells.msg;
            }
        } catch (e) {
            console.log(e);
        }
    });
});

/**
 * Factory function for creation of excel object
 * @param {settings} settings object
 * @returns {excel} excel object
 */
function excelFactory(settings) {
    var col = 1;
    var row = 1;
    var isEditMode = false;

    /**
     * Get edit mode
     * @returns {Boolean} true if in edit mode
     */
    function getEditMode() {
        return isEditMode;
    }

    /**
     * move focus to the next row's cell
     * @returns {undefined}
     */
    function nextRow() {
        if (row < settings.maxRow) {
            row += 1;
            selectCell();
        }
    }

    /**
     * move focus to the previous row
     * @returns {undefined}
     */
    function prevRow() {
        if (row > 1) {
            row -= 1;
            selectCell();
        }
    }

    /**
     * move the focus to next column's cell
     * @returns {undefined}
     */
    function nextCol() {
        if (col < settings.maxCol) {
            col += 1;
            selectCell();
        }
    }

    /**
     * move focus to previous column
     * @returns {undefined}
     */
    function prevCol() {
        if (col > 1) {
            col -= 1;
            selectCell();
        }
    }

    /**
     * select cell by coord ex. A1
     * @param {string} coord
     * @returns {undefined}
     */
    function setCoord(coord) {
        if (coord && coord.length >= 2) {
            var newRow = parseInt(coord.substr(1));
            var newCol = parseInt(coord.substr(0, 1).charCodeAt(0) - 64);
            if (newRow <= settings.maxRow && newRow >= 1 &&
                    newCol <= settings.maxCol && newCol >= 1) {
                row = newRow;
                col = newCol;
                selectCell();
            }
        }
    }

    /**
     * Edit selected cell by put inside an input field
     * @param {string} text, the pressed character
     * @returns {undefined}
     */
    function editSelected(text) {
        $('.selected').html('<input type="text" />');
        isEditMode = true;
        $('input').focus().val(text);
    }

    /**
     * End cell editing, send value to server by ajax, then move the focus by callback
     * @param {type} callback where to move the focus, left or down
     * @returns {undefined}
     */
    function endEditSelected(callback) {
        if (isEditMode) {
            var value = $('input').val();
            var data = {col: col, row: row, value: value};
            $.post('index.php?home/savecell', data, function (resp) {
                console.log(resp);
                try {
                    var cell = JSON.parse(resp);
                    if (cell.status === 'OK') {
                        $('.selected').html(cell.msg);
                        //align right if value number
                        if (!isNaN(cell.msg) && isFinite(cell.msg)) {
                            $('.selected').addClass('right');
                        } else {
                            $('.selected').removeClass('right');
                        }
                        if (typeof (callback) === 'function')
                            callback();
                    }
                } catch (e) {
                    console.log(e);
                }
            });
            $('.selected').html('');
            isEditMode = false;
        } else {
            if (typeof (callback) === 'function')
                callback();
        }
    }

    /**
     * Cancel edit, if pressed Esc
     * @returns {undefined}
     */
    function cancelEditelected() {
        if (isEditMode) {
            $('.selected').html('');
            isEditMode = false;
        }
    }

    /**
     * Remove all selection
     * @returns {undefined}
     */
    function removeSelection() {
        $('.select-col').removeClass('select-col');
        $('.select-row').removeClass('select-row');
        $('.selected').removeClass('selected');
        $('#remove-selected').addClass('disabled').off('click');
    }

    /**
     * Select one cell
     * @returns {undefined}
     */
    function selectCell() {
        removeSelection();
        var coord = '#' + String.fromCharCode(64 + col) + row;
        $(coord).addClass('selected');
    }

    /**
     * Select entire row
     * @returns {undefined}
     */
    function selectRow() {
        removeSelection();
        row = $(this).html();
        $('.row_' + row).addClass('select-row');
        row = Number(row);
        //enable remove row
        if (settings.maxRow > 1) {
            $('#remove-selected').removeClass('disabled').click(deleteSelectedRow);
        }
    }

    /**
     * Select entire column
     * @returns {undefined}
     */
    function selectCol() {
        removeSelection();
        col = $(this).attr('class').split(" ")[1];
        col = col.split('_')[1];
        $('.col_' + col).addClass('select-col');
        col = Number(col);
        //enble rwmove column
        if (settings.maxCol > 1) {
            $('#remove-selected').removeClass('disabled').click(deleteSelectedCol);
        }
    }

    /**
     * Delete selected column, save deletion with ajax
     * @returns {undefined}
     */
    function deleteSelectedCol() {
        removeSelection();
        $.post('index.php?home/del_col', {col: col}, function (resp) {
           console.log(resp); 
            try {
                respObj = JSON.parse(resp);
                if (respObj.status === 'OK') {
                    //copy all column next to deleted column
                    for (var toCol = col; toCol < settings.maxCol; toCol++) {
                        $('.col_' + toCol).each(function (i, element) {
                            if (i > 0) {
                                var fromCol = toCol + 1;
                                element.innerHTML = $('.col_' + fromCol + '.row_' + i).text();
                            }
                        });
                    }
                    //remove column
                    $('.col_' + settings.maxCol).remove();
                    //re-enabled add column button
                    if (settings.maxCol === 26) {
                        $('#add-col').removeClass('disabled').click(addCol);
                    }
                    settings.maxCol = + respObj.msg;
                } else {
                    throw respObj.msg;
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * Remove selected row, save to database with ajax
     * @returns {undefined}
     */
    function deleteSelectedRow() {
        removeSelection();
        $.post('index.php?home/del_row', {row: row}, function (resp){
            console.log(resp);
            try {
                var respObj = JSON.parse(resp);
                if (respObj.status === 'OK') {
                    settings.maxRow = +respObj.msg;
                    for (var toRow = row; toRow < settings.maxRow + 1; toRow++) {
                        $('.row_' + toRow).each(function (i, element) {
                            if (i > 0) {
                                var fromRow = toRow + 1;
                                element.innerHTML = $('.row_' + fromRow + '.col_' + i).text();
                            }
                        });
                    }
                    $('.row_' + (settings.maxRow + 1)).parent().remove();
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * Add new column to the table, save this with ajax
     * @returns {undefined}
     */
    function addCol() {
        removeSelection();
        $.post('index.php?home/add_col', function (resp) {
            console.log(resp);
            try {
                respObj = JSON.parse(resp);
                if (respObj.status === 'OK') {
                    //new number of columns
                    settings.maxCol = + respObj.msg;
                    //create character for title
                    var colStr = String.fromCharCode(64 + settings.maxCol);
                    //add column
                    $('table tr').each(function (i, element) {
                        if (i === 0) {
                            var th = document.createElement('th');
                            th.innerHTML = colStr;
                            th.className = 'cols col_' + settings.maxCol;
                            th.onclick = selectCol;
                            element.appendChild(th);
                        } else {
                            var td = document.createElement('td');
                            td.id = colStr + i;
                            td.className = 'cell col_' + settings.maxCol + ' row_' + i;
                            element.appendChild(td);
                        }
                    });
                    //if reached the maximum column, disable button
                    if (settings.maxCol === 26) {
                        $('#add-col').addClass('disabled').off('click');
                    }
                } else {
                    throw respObj.msg;
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * Add new row to the table, and save with ajax
     * @returns {undefined}
     */
    function addRow() {
        removeSelection();
        $.post('index.php?home/add_row', function (resp) {
            console.log(resp);
            try {
                respObj = JSON.parse(resp);
                if (respObj.status === 'OK') {
                    var td;
                    var tr = document.createElement('tr');
                    settings.maxRow = +respObj.msg;
                    for (var i = 0; i <= settings.maxCol; i++) {
                        if (i === 0) {
                            td = document.createElement('td');
                            td.innerHTML = settings.maxRow;
                            td.className = 'rows row_' + settings.maxRow;
                            td.onclick = selectRow;
                            tr.appendChild(td);
                        } else {
                            var colStr = String.fromCharCode(64 + i);
                            td = document.createElement('td');
                            td.id = colStr + settings.maxRow;
                            td.className = 'cell col_' + i + ' row_' + settings.maxRow;
                            tr.appendChild(td);
                        }
                    }
                    $('table tr:last').after(tr);
                } else {
                    throw resp.msg;
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    removeSelection();
    //create object
    return {
        settings: settings,
        isEditMode: getEditMode,
        nextRow: nextRow,
        prevRow: prevRow,
        nextCol: nextCol,
        prevCol: prevCol,
        setCoord: setCoord,
        editSelected: editSelected,
        endEditSelected: endEditSelected,
        cancelEditSelected: cancelEditelected,
        selectCell: selectCell,
        selectRow: selectRow,
        selectCol: selectCol,
        deleteSelectedCol: deleteSelectedCol,
        deleteSelectedRow: deleteSelectedRow,
        addCol: addCol,
        addRow: addRow
    };
}

