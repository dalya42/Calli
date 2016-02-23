// app/models/User.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

var UserSchema = mongoose.Schema({
    username     : String,
    password     : String
});

// generate hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// validate password
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {

    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, config.secret);
};

module.exports = mongoose.model('User', UserSchema);