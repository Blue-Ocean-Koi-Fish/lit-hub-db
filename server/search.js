const axios = require('axios');

const url = 'http://gutendex.com/books';

function search(clientQuery) {
  let addQuery = '';
  if (clientQuery) {
    const queryKeys = Object.keys(clientQuery);
    queryKeys.forEach((element) => {
      addQuery += `${element}=${clientQuery[element]}&`;
    });
  }
  return axios.get(`${url}?${addQuery}`)
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

function getTxt(txtUrl) {
  return axios.get(txtUrl)
    .then((data) => {
      const parsedData = data.data.slice(data.data.indexOf('<body>'), data.data.indexOf('</body>') + 7);
      return parsedData;
    })
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

function popular() {
  return axios.get(url);
}

module.exports = {
  search,
  getTxt,
  popular,
};
