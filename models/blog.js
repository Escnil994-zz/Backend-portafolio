'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var blog_schema = schema({
    title: String,
    intro: String,
    content: String,
    more: String,
    author: String,
    body: String,
    date: {type: Date, default: Date.now},
    image: String,
    cloudinary_id: String
});

module.exports = mongoose.model('Blog', blog_schema);
