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

function getTxt(txtUrl = 'https://www.gutenberg.org/files/11/11-0.txt') {
  const checkPostFix = txtUrl.substr((txtUrl.length - 3));
  let newUrl = txtUrl;

  if (checkPostFix === 'zip') {
    newUrl = txtUrl.substr(0, (txtUrl.length - 3));
    newUrl += 'txt';
  }

  return axios.get(newUrl)
    .then((data) => {
      const dataResults = checkPostFix !== 'htm'
        ? data
        : { data: data.data.slice(data.data.indexOf('<body>'), (data.data.indexOf('</body>') + 7)) };

      return dataResults;
    })
    .catch((err) => (console.log('Error when calling axios. Function name: search, File: search.js, Folder: server. The error returned: ', err)));
}

module.exports = {
  search,
  getTxt,
};
