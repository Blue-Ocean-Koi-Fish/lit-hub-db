const axios = require('axios');

const url = 'http://gutendex.com/books'

function search(params) {
  console.log(params);
  return axios.get(url)
  .catch(err => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

function getTxt(txtUrl = 'https://www.gutenberg.org/files/11/11-0.txt') {
  return axios.get(txtUrl)
  .catch(err => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

module.exports = {
  search,
  getTxt
}

