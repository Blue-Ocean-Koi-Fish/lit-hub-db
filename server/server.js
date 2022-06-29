require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const search = require('./search');
const { UserModel, BookModel } = require('../database/models/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => (res.json({ message: 'Welcome to LitHub!' })));

// GutenDex Querying Routes
app.get('/search', (req, res) => {
  search.search(req.query)
    .then((data) => (res.json(data.data)))
    .catch((err) => (console.log('/search is currently failing. Error: ', err)));
});

app.get('/txt', (req, res) => {
  search.getTxt(req.query.url)
    .then((data) => (res.json(data.data)))
    .catch((err) => {
      console.log('/txt is currently failing. Error: ', err);
      res.send('The text does not exist');
    });
});

// User Registration / Log-in Routes
app.post('/newUser', (req, res) => {
  const { username, password } = req.body;

  UserModel.create({
    username,
    password,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.post('/userLogin', (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (err || !user) {
      res.status(500).json({ msg: 'Invalid credentials.', err });
    } else {
      user.comparePassword(password, user.password, (err2, isMatch) => {
        if (err2 || !isMatch || !user) {
          res.status(500).json({ msg: 'Invalid credentials.', err2 });
        } else {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
          res.cookie('token', token, { httpOnly: true, secure: true });
          res.sendStatus(201);
        }
      });
    }
  });
});

// Admin Routes
app.delete('/deleteUser', (req, res) => {
  const { username } = req.body;

  UserModel.deleteOne({ username }, (err) => {
    if (err) {
      res.status(500).json({ msg: err });
    }
    res.status(204).json({ success: true });
  });
});

app.get('/allUsers', (req, res) => {
  UserModel.find().exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      throw err;
    });
});

// Book Collection Routes
app.post('/addToCollection', (req, res) => {
  const { username, bookId } = req.body;
  BookModel.create({
    username,
    bookId,
    page: 1,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.put('/updateCollection', (req, res) => {
  const { username, bookId, page } = req.body;
  BookModel.findOneAndUpdate({
    username,
    bookId,
  }, { page })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.delete('/removeFromCollection', (req, res) => {
  const { username, bookId } = req.body;
  BookModel.findOneAndDelete({
    username,
    bookId,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get('/collection/:username', (req, res) => {
  BookModel.find({ username: req.params.username })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
