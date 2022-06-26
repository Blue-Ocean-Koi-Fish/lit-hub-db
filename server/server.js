require('dotenv').config();
const express = require('express');
// const axios = require('axios');
const { createNewUser, logInUser } = require('../database/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  res.json({ message: 'Welcome to LitHub!' });
});

app.get('./allUsers', (req, res) => {

});

app.post('/newUser', (req, res) => {
  const { username, password } = req.body;

  createNewUser(username, password, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log('User logged in.');
      res.sendStatus(201);
    }
  });
});

app.post('/userLogin', (req, res) => {
  const { username, password } = req.body;

  logInUser(username, password, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log('User logged in.');
      res.sendStatus(201);
    }
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server listening on port ', process.env.SERVER_PORT);
});
