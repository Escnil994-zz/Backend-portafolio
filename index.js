'use strict'

var mongoose = require('mongoose');

var app = require('./app');

var _private = require('./private/private.json')

var port = process.env.PORT || 3000;

mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;

const uriDB = _private.db_connection;

mongoose.connect(uriDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        console.log('Database is connected!!!')


        //crear servidor y escuchar peticiones http
        app.listen(port, function () {
            console.log('Server on port: ' + port)
        });

    });

module.exports = app;
