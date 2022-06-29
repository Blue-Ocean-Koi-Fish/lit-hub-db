const dbAddress = 'mongodb://localhost:27017/lit_hub_users';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('dotenv').config();
mongoose.connect(`mongodb+srv://${process.env.mongoUser}:${process.env.mongoPass}@${process.env.mongoURL}/lit_hub_db?retryWrites=true&w=majority`);

mongoose.connect(dbAddress)
  .then(() => console.log(`Connected to: ${dbAddress}`))
  .catch((err) => {
    console.log(`There was a problem connecting to mongo at: ${dbAddress}`);
    console.log(err);
  });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  bookList: [{
    bookName: String,
    onPage: Number,
  }],
});

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

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, 'password', (error, isMatch) => {
    if (error) {
      console.log(error);
      callback(error);
    }
    callback(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
