'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var project_schema = schema({
    title: String,
    description: String,
    video: String,
    type: String,
    url: String,
    comments: String,
    date: {type: Date, default: Date.now},
    image: String,
    cloudinary_id: String
});

module.exports = mongoose.model('Project', project_schema);
