const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const app = express();
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

app.listen(process.env.PORT, () => {
  console.log('Server listening on port ' + process.env.PORT);
})