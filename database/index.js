require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  res.json({ message: 'Welcome to LitHub!' });
});

// Testing route
app.get('/allUsers', (req, res) => {
  UserModel.find().exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      throw err;
    });
});

app.post('/newUser', (req, res) => {
  const { username, password } = req.body;

  const newUserDocument = new UserModel({
    username,
    password,
    bookList: [],
    loggedIn: false,
  });
  newUserDocument.save((error) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.post('/userLogin', (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ msg: 'Invalid credentials.', err });
    }
    user.comparePassword(password, (err) => {
      if (err) {
        res.status(500).json({ msg: 'Invalid credentials.', err });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
      res.json({
        token,
        id: user._id,
        username: user.username,
      });
    });
  });
});

app.post('/userLogout', (req, res) => {
  const { username } = req.body;

  UserModel.findOneAndUpdate({ username }, { loggedIn: false }).exec((err) => {
    if (err) {
      res.status(500).json({ msg: err });
    } else {
      res.status(204).json({ success: true });
    }
  });
});

app.delete('/deleteUser', (req, res) => {
  const { username } = req.body;

  UserModel.deleteOne({ username }, (err) => {
    if (err) {
      res.status(500).json({ msg: err });
    }
    res.status(204).json({ success: true });
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server listening on port ', process.env.SERVER_PORT);
});
