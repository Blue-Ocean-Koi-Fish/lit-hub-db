require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const search = require('./search');
const { UserModel, BookModel, SettingModel } = require('../database/models/users');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/test', (req, res) => (res.json({ message: 'Welcome to LitHub!' })));

// GutenDex Querying Routes
app.get('/search', (req, res) => {
  console.log(req.query);
  search.search(req.query)
    .then((data) => (res.json(data.data)))
    .catch((err) => (console.log('/search is currently failing. Error: ', err)));
});

app.get('/txt', (req, res) => {
  search.getTxt(req.query.url)
    .then((data) => (res.send(data)))
    .catch((err) => {
      console.log('/txt is currently failing. Error: ', err);
      res.send('The text does not exist');
    });
});

app.get('/popular', (req, res) => {
  search.popular()
    .then((data) => {
      res.json(data.data);
    })
    .catch((err) => {
      console.log('/popular is currently failing. Error: ', err);
      res.sendStatus(500);
    });
});

// User Registration / Log-in Routes
app.post('/registerUser', (req, res) => {
  const { username, password } = req.body;

  UserModel.create({
    username,
    password,
  })
    .then(() => SettingModel.create({
      username,
    }))
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.post('/loginUser', (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (err || !user) {
      res.status(500).json({ msg: 'Invalid credentials.', err });
    } else {
      user.comparePassword(password, user.password, (err2, isMatch) => {
        if (err2 || !isMatch || !user) {
          res.status(500).json({ msg: 'Invalid credentials.', err2 });
        } else {
          SettingModel.findOne({
            username,
          })
            .then((data) => {
              const settings = {
                language: data.language,
                'color-blindedness': data['color-blindedness'],
                font: data.font,
                fontSize: data.fontSize,
              };
              const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
              res.json({
                token,
                id: user._id,
                username: user.username,
                settings,
              });
            });
        }
      });
    }
  });
});

app.put('/logoutUser', (req, res) => {
  res.end();
});

// Admin Routes
// app.delete('/deleteUser', (req, res) => {
//   const { username } = req.body;

//   UserModel.deleteOne({ username }, (err) => {
//     if (err) {
//       res.status(500).json({ msg: err });
//     }
//     res.status(204).json({ success: true });
//   });
// });

// app.get('/allUsers', (req, res) => {
//   UserModel.find().exec()
//     .then((data) => {
//       res.json(data);
//     })
//     .catch((err) => {
//       throw err;
//     });
// });

app.post('/verifyToken', (req, res) => {
  const cookie = req.cookies.s_id;
  jwt.verify(cookie, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.sendStatus(401);
    } else {
      UserModel.findById(payload.id, 'username')
        .then((data) => {
          res.status(200).send(data.username);
        });
    }
  });
});

const verifyToken = (req, res, next) => {
  const cookie = req.cookies.s_id;
  if (jwt.verify(cookie, process.env.JWT_SECRET)) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// Book Collection Routes
app.post('/addToCollection', verifyToken, (req, res) => {
  const { username, bookId, meta } = req.body;
  BookModel.create({
    username,
    bookId,
    meta,
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

app.put('/updateCollection', verifyToken, (req, res) => {
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

app.delete('/removeFromCollection', verifyToken, (req, res) => {
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

app.get('/collection/:username', verifyToken, (req, res) => {
  BookModel.find({ username: req.params.username })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.put('/updateSettings', verifyToken, (req, res) => {
  SettingModel.findOneAndUpdate({
    username: req.body.username,
  }, req.body.settings)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
