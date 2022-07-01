// const dbAddress = 'mongodb://localhost:27017/lit_hub_users';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.mongoUser}:${process.env.mongoPass}@${process.env.mongoURL}/lit_hub_db?retryWrites=true&w=majority`)
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => console.log('Error connecting to mongodb', err));

// Database Schemas
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
});

const BookSchema = new mongoose.Schema({
  username: String,
  bookId: Number,
  meta: mongoose.Schema.Types.Mixed,
  page: Number,
});

const SettingSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  language: {
    type: String,
    default: 'English',
  },
  'color-blindedness': {
    type: String,
    default: 'none',
  },
  font: {
    type: String,
    default: 'Times',
  },
  fontSize: {
    type: Number,
    default: 24,
  },
});

// Encrypts user password before it is saved.
UserSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        throw next(saltError);
      } else {
        bcrypt.hash(user.password, salt, (hashError, hash) => {
          if (hashError) {
            throw next(hashError);
          }
          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

// Used to check provided password against stored password
UserSchema.methods.comparePassword = (password, userPassword, callback) => {
  bcrypt.compare(password, userPassword, (error, isMatch) => {
    if (error) {
      console.log(error);
      callback(error);
    } else {
      callback(null, isMatch);
    }
  });
};

const UserModel = mongoose.model('User', UserSchema);

const BookModel = mongoose.model('Book', BookSchema);

const SettingModel = mongoose.model('Setting', SettingSchema);

module.exports = { UserModel, BookModel, SettingModel };
