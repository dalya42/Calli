// app/models/User.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');

var UserSchema = mongoose.Schema({
    username: String,
    password: String,
    role: { type: mongoose.Schema.Types.ObjectId, ref:'Role' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// generate hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// validate password
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// generate java web token
UserSchema.methods.generateJWT = function() {

    // set expiry date 60 days away
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        role: this.role,
        creator: this.creator,
        exp: parseInt(exp.getTime() / 1000)
    }, config.secret);
};

// set user role
UserSchema.methods.setRole = function(role) {
    this.role = role._id;
};
 // set user creator
UserSchema.methods.setCreator = function(creator) {
  this.creator = creator;
};

module.exports = mongoose.model('User', UserSchema);