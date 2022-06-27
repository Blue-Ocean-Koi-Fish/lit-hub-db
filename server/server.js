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
  res.json({ message: 'Welcome to LitHub!', query: req.query });
})

app.get('/search', (req, res) => {

  search.search(req.query)
  .then(data => {
    console.log(data.data);
    res.json(data.data);
  })
  .catch(err => (console.log('/search is currently failing. Error: ', err)));
})

app.get('/txt', (req, res) => {

  search.getTxt(req.query.url)
  .then(data => {
    res.json(data.data);
  })
  .catch(err => (console.log('/search is currently failing. Error: ', err)));
})

app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
})