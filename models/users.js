'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var user_schema = schema({
    name: String,
    email: String,
    password: String,
    avatar: String
}, {
    timestamp: true
});

module.exports = mongoose.model('User', user_schema);
