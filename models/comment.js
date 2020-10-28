'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var comment_schema = schema({
    name: String,
    email: String,
    comment: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', comment_schema);