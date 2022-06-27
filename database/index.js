// const dbAddress = 'mongodb://localhost:27017/lit_hub_users';
// const mongoose = require('mongoose');
const UserModel = require('./models/users');

// mongoose.connect(dbAddress)
//   .then(() => console.log(`Connected to: ${dbAddress}`))
//   .catch((err) => {
//     console.log(`There was a problem connecting to mongo at: ${dbAddress}`);
//     console.log(err);
//   });

module.exports = {
  createNewUser: (userName, passWord, callback) => {
    const newUserDocument = new UserModel({
      username: userName,
      password: passWord,
      bookList: [],
    });
    console.log('newUserDocument', newUserDocument);
    newUserDocument.save((error) => {
      if (error) {
        callback(error);
      } else {
        callback({ success: true });
      }
    });
  },

  logInUser: (userName, passWord, callback) => {
    UserModel.findOne({ username: userName }).exec((error, user) => {
      if (error) {
        callback({ error: true });
      } else if (!user) {
        callback({ error: true });
      } else {
        user.comparePassword(passWord, (matchError, isMatch) => {
          if (matchError) {
            callback({ error: true });
          } else if (!isMatch) {
            callback({ error: true });
          } else {
            user.loggedIn = true;
            callback({ success: true });
          }
        });
      }
    });
  },

  // getAllUsers: (callback) => {
  //   return UserModel.find()
  // },

};
