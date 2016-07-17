'use strict';

/**
 * @description GET index page
 */
function index(req, res, next) {
     res.render('index', { title: 'Excel on web' });
}

module.exports = {
    index: index
}