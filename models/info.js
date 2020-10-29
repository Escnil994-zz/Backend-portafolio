'use strict'

var mongoose = require('mongoose');

var schema = mongoose.Schema;

var info_schema = schema({
    nationality: String,
    name: String,
    second_name: String,
    age: Boolean,
    university: String,
    career: String,
    passioness: String,
    to_eat: String,
    hobbies: String,
    want_to: String,
    idiom_one: String,
    idiom_two: String,
    wanted_to: String,
    feature_one: String,
    feature_two: String,
    feature_three: String,
    feature_four: String,
    feature_five: String,
    twitter: String,
    facebook: String,
    linkedin: String,
    whatssapp: String,
    email: String,
    instagram: String,
    github: String,
});

module.exports = mongoose.model('info', info_schema);
