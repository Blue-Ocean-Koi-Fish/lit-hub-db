const express = require('express');
const cors = require('cors');
const search = require('./search');
require('dotenv').config();

const app = express();

// const corsOptions = {
//   origin: 'http://localhost:8081',
// };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  res.json({ message: 'Welcome to LitHub!', query: req.query });
});

app.get('/search', (req, res) => {
  console.log(req.query);
  search.search(req.query)
    .then((data) => {
      // console.log(data.data);
      res.json(data.data);
    })
    .catch((err) => (console.log('/search is currently failing. Error: ', err)));
});

app.get('/txt', (req, res) => {
  search.getTxt(req.query.url)
    .then((data) => {
      res.json(data.data);
    })
    .catch((err) => (console.log('/txt is currently failing. Error: ', err)));
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
