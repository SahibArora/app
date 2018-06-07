const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    default: '',
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: '',
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  pages: { type: Array },
  googleId: {
    type: String,
    // enforce uniqueness but allow multiple documents with null and undefined values
    index: {
      unique: true,
      partialFilterExpression: {
        googleId: { $type: 'string' }
      }
    }
  }
});

userSchema.methods.hashPassword = function hashPassword(password) {
  bcrypt.hash(password, null, null, (innerErr, hash) => {
    if (innerErr) { return next(innerErr); }
    this.password = hash;
  });
};

userSchema.methods.verifyPassword = function verifyPassword(password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
