const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const app = express();
const search = require('./search.js');
require('dotenv').config();

const corsOptions = {
  origin: 'http://localhost:8081'
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(
  cookieSession({
    name: 'lit-hub-session',
    secret: process.env.COOKIE_SECRET,
    httpOnly: true
  })
);

app.get('/test', (req, res) => {
  res.json({ message: 'Welcome to LitHub!' });
})

app.get('/search', (req, res) => {

  search.search(req.params)
  .then(data => (console.log('/search call is working! Data: ', data.data)))
  .catch(err => (console.log('/search is currently failing. Error: ', err)));

  res.json({ message: 'Search has been used' });
})

app.get('/search/author', (req, res) => {

  res.json({message: 'author call has not been completed'});
})

app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
})