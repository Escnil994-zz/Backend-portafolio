const cloudinary = require('cloudinary').v2;

const _private = require('../private/private.json');


cloudinary.config({
    cloud_name: _private.cloudinary_name,
    api_key: _private.cloudinary_api_key,
    api_secret: _private.cloudinary_secret_key
});

module.exports = cloudinary;
