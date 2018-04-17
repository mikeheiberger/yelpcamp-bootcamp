const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

module.exports = mongoose.model(
    'User',
    new mongoose.Schema({
        username: String,
        password: String
    }).plugin(passportLocalMongoose)
);